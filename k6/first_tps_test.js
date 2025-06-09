/* eslint-env k6 */
import http from 'k6/http';
import { check, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// __ENV fallback for IDE/linters (k6 런타임 외부에서 no-undef 방지)
const ENV = (typeof __ENV !== 'undefined') ? __ENV : {};

/**
 * k6 TPS 성능 테스트 스크립트 (JWT 쿠키 인증 필요)
 *
 * 요구사항
 * - API 요청 시 JWT access token이 담긴 **쿠키** 필요
 * - 트랜잭션 흐름:
 *   1) GET https://www.andypjt.site/api/product/cpu/popular/0  (200이면 성공)
 *   2) GET https://www.andypjt.site/api/product/255             (200이면 성공)
 * - 목표: 200 TPS, 그리고 **95% 요청 p95 < 500ms**
 *
 * 인증 방식
 * - 기본: 환경변수 COOKIE_VALUE 로 JWT 값을 직접 주입 (쿠키 이름은 COOKIE_NAME)
 * - 대안: LOGIN_PATH/USERNAME/PASSWORD 환경변수로 로그인 → Set-Cookie에서 JWT 추출
 *   (둘 다 없으면 테스트 시작 시 실패)
 *
 * 실행 예시
 * 1) 쿠키 값 직접 주입(권장):
 *    k6 run -e COOKIE_VALUE="<jwt>" tps_200_cookie.js
 * 2) 로그인으로 쿠키 획득:
 *    k6 run -e LOGIN_PATH=/api/auth/login -e USERNAME=user -e PASSWORD=pass tps_200_cookie.js
 */

// ===== 설정값 =====
const BASE_ORIGIN = 'http://172.30.1.21:443';
const TARGET_TPS = Number(ENV.TARGET_TPS || 100); // 목표 TPS
const TEST_DURATION = ENV.DURATION || '1m';       // 테스트 길이 (예: 2m)
const COOKIE_NAME = ENV.COOKIE_NAME || 'access_token';
const COOKIE_SECURE = (ENV.COOKIE_SECURE || 'true') === 'true';

// ===== 커스텀 메트릭 =====
export const txn_latency = new Trend('txn_latency'); // 한 트랜잭션(두 요청)의 총 소요 시간
export const txn_success = new Rate('txn_success');  // 트랜잭션 성공률
export const txn_count = new Counter('txn_count');   // 트랜잭션 수

// ===== 시나리오: constant-arrival-rate 로 TPS 고정 =====
export const options = {
  scenarios: {
    tps_const: {
      executor: 'constant-arrival-rate',
      rate: TARGET_TPS,            // 초당 트랜잭션 도착 수 (=TPS)
      timeUnit: '1s',
      duration: TEST_DURATION,
      preAllocatedVUs: Math.max(TARGET_TPS, 100), // 충분히 크게(대기행렬 방지)
      maxVUs: Math.max(TARGET_TPS * 5, 1000),
    },
  },
  thresholds: {
    // 요청 단위 p95 < 500ms  (요구사항)
    http_req_duration: ['p(95)<500'],
    // 실패율 억제(선택)
    http_req_failed: ['rate<0.01'],
    // 트랜잭션 단위 품질 가드(선택)
    txn_success: ['rate>0.99'],
  },
  summaryTrendStats: ['avg','min','med','p(90)','p(95)','p(99)','max'],
  discardResponseBodies: true, // 메모리 절감
};

// ===== 유틸 =====
function tagName(path, method = 'GET') {
  return `${method} ${path}`;
}

function ensureAuthCookie(cookieValue) {
  if (!cookieValue) return;
  const jar = http.cookieJar();
  // BASE_ORIGIN 기준으로 쿠키 주입 → 이후 요청에서 자동 첨부
  jar.set(BASE_ORIGIN, COOKIE_NAME, cookieValue, {
    path: '/',
    secure: COOKIE_SECURE,
    http_only: true,
  });
}

// ===== 인증 쿠키 획득 =====
export function setup() {
  // 1) 쿠키 값 직접 주입(가장 간단/안정)
  if (ENV.COOKIE_VALUE) {
    return { cookieValue: ENV.COOKIE_VALUE };
  }

  // 2) 로그인 후 Set-Cookie에서 추출 (LOGIN_PATH, USERNAME, PASSWORD 필요)
  const loginPath = ENV.LOGIN_PATH; // 예: /api/auth/login
  const username = ENV.USERNAME;
  const password = ENV.PASSWORD;
  if (loginPath && username && password) {
    const url = `${BASE_ORIGIN}${loginPath}`;
    const res = http.post(url, JSON.stringify({ username, password }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { name: tagName(loginPath, 'POST') },
    });

    check(res, {
      'login 2xx': r => r.status >= 200 && r.status < 300,
      'set-cookie exists': r => !!r.headers['Set-Cookie'] || (r.cookies && r.cookies[COOKIE_NAME]),
    });

    let cookieValue = null;
    if (res.cookies && res.cookies[COOKIE_NAME] && res.cookies[COOKIE_NAME].length > 0) {
      cookieValue = res.cookies[COOKIE_NAME][0].value;
    }
    if (!cookieValue && res.headers['Set-Cookie']) {
      const setCookie = Array.isArray(res.headers['Set-Cookie']) ? res.headers['Set-Cookie'][0] : res.headers['Set-Cookie'];
      if (setCookie) {
        const kv = setCookie.split(';')[0];
        const [name, value] = kv.split('=');
        if (name === COOKIE_NAME) cookieValue = value;
      }
    }

    if (!cookieValue) {
      throw new Error('JWT 쿠키 추출 실패: COOKIE_NAME 확인 필요');
    }
    return { cookieValue };
  }

  // 3) 어떤 방법도 주어지지 않은 경우 → 실패
  throw new Error('인증 미설정: COOKIE_VALUE 환경변수 또는 LOGIN_PATH/USERNAME/PASSWORD를 제공하세요.');
}

// ===== 테스트 본문 =====
export default function (data) {
  // 매 VU에서 인증 쿠키를 보장
  ensureAuthCookie(data.cookieValue);

  const start = Date.now();
  let ok = true;

  group('Transaction: popular_then_detail', () => {
    // 1) 인기 CPU 목록 (page 0)
    {
      const path = '/api/product/cpu/popular/0';
      const res = http.get(`${BASE_ORIGIN}${path}`, { tags: { name: tagName(path, 'GET') } });
      const good = check(res, {
        'popular 200': r => r.status === 200,
      });
      ok = ok && good;
    }

    // 2) 특정 상품 상세 (id=255)
    {
      const path = '/api/product/255';
      const res = http.get(`${BASE_ORIGIN}${path}`, { tags: { name: tagName(path, 'GET') } });
      const good = check(res, {
        'detail 200': r => r.status === 200,
      });
      ok = ok && good;
    }
  });

  const dur = Date.now() - start;
  txn_latency.add(dur);
  txn_success.add(ok);
  txn_count.add(1);
}
