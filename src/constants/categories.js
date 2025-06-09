// src/constants/categories.js
export const CATEGORIES = [
  { key: 'cpu',       label: 'CPU' },
  { key: 'graphic',   label: 'GPU' },
  { key: 'mainboard', label: '메인보드' },
  { key: 'memory',    label: '메모리' },
  { key: 'storage',   label: '스토리지' },
  { key: 'power',     label: '파워' },
  { key: 'case',      label: '케이스' },
  { key: 'cooler',    label: '쿨러' },
];

export const SLUGS = CATEGORIES.map((c) => c.key); // ['case','cpu',...]
