// ProductForm.jsx – 상품 등록/수정 상위 컨테이너 (ReqProductDto 규격 맞춤)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useAddProductMutation, useUpdateProductMutation } from '../../features/api/sellerApi';
import { useGetProductByIdQuery } from '../../features/api/productApi';
import toFormData from '../../lib/toFormData';
import useToast   from '../../ui/feedback/useToast';

import ProductMainForm     from './components/ProductMainForm';
import CategorySelectModal from './components/CategorySelectModal';
import SpecSelectModal     from './components/SpecSelectModal';
import SpecDetailModal     from './components/SpecDetailModal';

export default function ProductForm({ mode = 'create' }) {
  const isEdit   = mode === 'edit';
  const { id }   = useParams();
  const toast    = useToast();
  const navigate = useNavigate();
  const { userId } = useSelector((s) => s.auth);

  /* 기존 상품 */
  const { data: origin } = useGetProductByIdQuery(Number(id), { skip: !isEdit });

  /* mutation hooks */
  const [addProduct]    = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  /* form state */
  const [form, setForm] = useState({
    name: '',
    categoryId: '',           // 숫자형으로 전송(Number)
    categoryName: '',
    logicalFK: '',            // 숫자형으로 전송(Number)
    specName: '',
    price: '',                // 숫자형으로 전송(Number)
    inventory: '',            // 숫자형으로 전송(Number)
    productImage: null,
    descriptionImage: null,
  });

  /* 수정 모드 초기값 */
  useEffect(() => {
    if (isEdit && origin) {
      setForm(f => ({
        ...f,
        name: origin.name,
        price: origin.price,
        categoryId: origin.categoryId,
        categoryName: origin.categoryName ?? '',
        logicalFK: origin.logicalFK,
        specName: origin.specName ?? '',
        inventory: origin.inventory,
      }));
    }
  }, [isEdit, origin]);

  /* 모달 상태 */
  const [modal, setModal] = useState({ cat: false, list: false, detail: null });

  /* ---------- 제출 ---------- */
  const handleSubmit = async () => {
    // 필수 항목 검증 (빈값이면 Toast)
    if (
      !form.name.trim() ||
      !form.categoryId ||
      !form.logicalFK ||
      !form.price ||
      !form.inventory ||
      (!isEdit && (!form.productImage || !form.descriptionImage))
    ) {
      toast.error('필수 항목을 모두 입력하세요');
      return;
    }


    try {
      if (isEdit) {
        await updateProduct({
          productId: id,
          name: form.name.trim(),
          categoryId: form.categoryId,
          logicalFK: form.logicalFK,
          price: form.price,
          inventory: form.inventory,
          productImage: form.productImage,
          descriptionImage: form.descriptionImage,
      }).unwrap();
        toast.success('수정 완료');
      } else {
        await addProduct({
          name: form.name.trim(),
          categoryId: form.categoryId,
          logicalFK: form.logicalFK,
          price: form.price,
          inventory: form.inventory,
          productImage: form.productImage,
          descriptionImage: form.descriptionImage,
      }).unwrap();
        toast.success('등록 완료');
      }
      navigate('/seller/products');
    } catch {
      toast.error('처리 실패');
    }
  };

  /* ---------- 렌더 ---------- */
  return (
    <>
      <ProductMainForm
        mode={mode}
        form={form}
        setForm={setForm}
        openCategory={() => setModal(m => ({ ...m, cat: true }))}
        openSpecList={() => {
          if (!form.categoryName) { toast.error('카테고리를 먼저 선택하세요'); return; }
          setModal(m => ({ ...m, list: true }));
        }}
        onSubmit={handleSubmit}
      />

      {/* 카테고리 선택 */}
      {modal.cat && (
        <CategorySelectModal
          onClose={() => setModal(m => ({ ...m, cat: false }))}
          onSelect={cat => {
            setForm(f => ({ ...f, ...cat, logicalFK: '', specName: '' }));
            setModal(m => ({ ...m, cat: false, list: true }));
          }}
        />
      )}

      {/* 스펙 목록 */}
      {modal.list && (
        <SpecSelectModal
          category={form.categoryName}
          onClose={() => setModal(m => ({ ...m, list: false }))}
          onSelect={({ id, cat, name }) => setModal(m => ({ ...m, detail: { id, cat, name } }))}
        />
      )}

      {/* 스펙 상세 */}
      {modal.detail && (
        <SpecDetailModal
          category={modal.detail.cat}
          specId={modal.detail.id}
          onClose={() => setModal(m => ({ ...m, detail: null }))}
          onConfirm={({ id, name }) => {
            setForm(f => ({ ...f, logicalFK: id, specName: name }));
            setModal({ cat: false, list: false, detail: null });
          }}
        />
      )}
    </>
  );
}
