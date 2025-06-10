// getImageUrl.js — 파일 키 → 실제 이미지 URL 변환
import { API_URL } from '../config';

export default function getImageUrl(key = '') {
  if (!key) return '';
  // 이미 절대 URL(http:// 또는 https://)이면 그대로 사용
  if (/^https?:\/\//i.test(key)) return key;   // ← 정규식: https:// or http://
  return `${API_URL}/api/product/image?name=${encodeURIComponent(key)}`;
}
