// Card.jsx – 흰색 배경·그림자·라운드를 가진 컨테이너
export default function Card({ children }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      {children}
    </div>
  );
}
