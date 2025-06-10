// File: src/lib/toFormData.js
/** 빈 문자열·undefined·null 은 제외하고 FormData 로 변환 */
export default function toFormData(obj = {}) {
  if (obj instanceof FormData) return obj;   // 이미 FormData면 그대로
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v != null && String(v).trim() !== '') fd.append(k, v);
  });
  return fd;
}