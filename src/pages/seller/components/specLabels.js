// specLabels.js — 카테고리별 DTO 필드 → 한글 라벨 매핑
export const LABELS = {
  cpu: {
    coreNum: '코어 수',
    threadNum: '쓰레드 수',
    l3Cache: 'L3 Cache(MB)',
    boostClock: '부스트 클럭(MHz)',
    processSize: '제조공정(nm)',
  },
  graphic: {
    chipSetType: '칩셋',
    chipSetManufacturer: '칩셋 제조사',
    series: '시리즈',
    recommendPower: '권장 전원(W)',
    coreClock: '코어 클럭(MHz)',
    boostClock: '부스트 클럭(MHz)',
    vram: 'VRAM(GB)',
    groups: '그룹',
  },
  memory: {
    groups: '그룹',
    cl: 'CL',
    volume: '용량(GB)',
    speed: '속도(MHz)',
  },
  mainboard: {
    chipSetType: '칩셋',
    cpuSocket: 'CPU 소켓',
    mosFet: 'MOSFET 단계',
    groups: '폼팩터',
    modelGroups: '세부 그룹',
  },
  power: {
    ratedOutputPower: '정격출력(W)',
    groups: '규격',
    plusGrades: '80Plus 등급',
  },
  storage: {
    formFactorType: '폼팩터',
    volume: '용량(GB)',
    fanSpeed: '속도(RPM)',
    groups: '세부 그룹',
  },
  cooler: {
    groups: '쿨러 종류',
    fanSpeed: '팬속도(RPM)',
    noise: '소음(dBA)',
  },
  case: {
    groups: '케이스 종류',
    innerSpace: '내부 공간(mm)',
  },
};
