// Spinner.jsx – 로딩 상태 표시용 회전 아이콘
export default function Spinner({ size = 6 }) {
  return (
    <svg
      className="animate-spin text-[#c97a40]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={`${size * 4}px`}
      height={`${size * 4}px`}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
      />
    </svg>
  );
}
