import Modal from '../../../ui/dialog/Modal';
import { useAllCategoriesQuery } from '../../../features/api/categoryApi';
import SkeletonTable from '../../../ui/composite/SkeletonTable';

export default function CategorySelectModal({ onClose, onSelect }) {
  const { data=[], isLoading } = useAllCategoriesQuery();

  return (
    <Modal title="카테고리 선택" onClose={onClose}>
      {isLoading ? <SkeletonTable rows={6}/> : (
        <ul>
          {data.map(c=>(
            <li key={c.categoryId}>
              <button
                onClick={()=>onSelect({ categoryId:c.categoryId, categoryName:c.categoryName })}
                className="block w-full px-3 py-2 text-left hover:bg-gray-100"
              >
                {c.categoryName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
