import { useSelector } from 'react-redux';

import { useMyProductsQuery } from '../../features/api/sellerApi';

export default function SellerDashboardHome() {
  const { userId } = useSelector((s) => s.auth);
  const { data = [], isLoading } = useMyProductsQuery({ userId, offset: 0 });
  if (isLoading) return <p>Loading…</p>;

  const total = data.length;
  const low   = data.filter(p=>p.inventory<5).length;
  const stock = data.reduce((n,p)=>n+p.inventory,0);

  return (
    <div className="grid grid-cols-3 gap-4">
      {['상품 수',total,'재고 부족',low,'총 재고',stock]
        .reduce((acc,v,i)=>{ if(i%2===0) acc.push([v]); else acc.at(-1).push(v); return acc;},[])
        .map(([label,val])=>(
          <div key={label} className="rounded bg-gray-50 p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-semibold">{val}</p>
          </div>
      ))}
    </div>
  );
}
