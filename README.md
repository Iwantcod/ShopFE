# Computer Shop Frontend

React 19 기반의 컴퓨터 부품 거래 플랫폼 프론트엔드 애플리케이션입니다. 회원 인증 이후 상품 탐색, 장바구니/주문 흐름, 판매자 전용 상품 관리, 관리자 승인·카테고리 관리 등 전반적인 커머스 기능을 제공합니다.

## 주요 기능
- 로그인/회원가입, 역할 기반 접근 제어(일반 회원 · 판매자 · 관리자)
- 카테고리별 상품 목록, 정렬, 페이지네이션, 상세 조회
- 장바구니, 주문 작성 및 주문 내역 조회
- 판매자 대시보드: 상품 등록/수정, 스펙 선택, 이미지 업로드
- 관리자 대시보드: 판매자 승인, 카테고리/스펙 관리, 상품 현황
- 글로벌 토스트/다이얼로그 UI와 다크 모드 지원

## 기술 스택
- **UI**: React 19, React Router 7, Tailwind CSS
- **상태 관리**: Redux Toolkit, RTK Query, Redux Persist
- **폼/유효성 검증**: React Hook Form, Zod
- **빌드/개발**: Vite, PostCSS, Autoprefixer
- **테스트**: Vitest, Testing Library
- **기타**: Axios, js-cookie, k6(성능 테스트)

## 개발 스크립트
```bash
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행 (Vite)
npm run build     # 프로덕션 번들 생성
npm run preview   # 빌드 결과 미리보기
npm run lint      # ESLint 검사
npm run test      # Vitest 단위 테스트
```

## 환경 변수
- `VITE_API_URL`: 백엔드 API 기본 URL (기본값 `https://www.andypjt.site`)

## 폴더 구조 개요
```
src/
  app/            # Redux 스토어 설정
  features/       # Slice & RTK Query 서비스
  pages/          # 라우트 단위 화면
  ui/             # 공용 UI 컴포넌트
  lib/            # 헬퍼 및 유틸리티
  routes/         # 라우트 보호 컴포넌트
  constants/      # 상수 정의
k6/               # k6 성능 테스트 스크립트
tests/            # 테스트 유틸
```

## 라이선스
프로젝트 내부 정책에 따릅니다.
