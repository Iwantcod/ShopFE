// 핵심 입력 필드 + 이미지 미리보기만 담당
import { useState, useMemo } from 'react';

import ImageUpload from './ImageUpload';

const inputCls = 'w-full rounded border px-3 py-2 text-sm';

export default function ProductMainForm({
  mode, form, setForm, openCategory, openSpecList, onSubmit,
}) {
  const isEdit = mode === 'edit';
  const [preview, setPreview] = useState({ product: '', desc: '' });

  const errors = useMemo(()=>{
    const e={};
    if(!form.name.trim())   e.name='필수';
    if(!form.categoryId)    e.category='필수';
    if(!form.logicalFK)     e.spec='필수';
    if(!form.price)         e.price='필수';
    if(!isEdit && !form.inventory) e.inv='필수';
    return e;
  },[form,isEdit]);

  const change=(e)=>{
    const {name, value, files}=e.target;
    if(files){
      const file=files[0];
      setForm(f=>({...f,[name]:file}));
      setPreview(p=>({...p,[name==='productImage'?'product':'desc']:URL.createObjectURL(file)}));
    }else setForm(f=>({...f,[name]:value}));
  };

  return (
    <form
      onSubmit={(e)=>{e.preventDefault(); onSubmit();}}
      className="mx-auto max-w-2xl space-y-6 rounded-2xl bg-white p-6 shadow"
    >
      <h1 className="text-xl font-semibold">
        {isEdit ? '상품 수정' : '상품 등록'}
      </h1>

      {/* 상품명 */}
      <div>
        <label className="text-sm">상품명 *</label>
        <input name="name" value={form.name} onChange={change} className={inputCls}/>
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* 카테고리 & 스펙 */}
      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={openCategory} className={inputCls}>
          {form.categoryName || '카테고리 선택 ▾'}
        </button>
        <button type="button" onClick={openSpecList} className={inputCls}>
          {form.specName || '스펙 선택 ▾'}  
        </button>
      </div>

      {/* 가격·재고 */}
      <div className="grid grid-cols-2 gap-4">
        <input type="number" name="price" value={form.price} onChange={change} placeholder="가격(원)" className={inputCls}/>
        {!isEdit && (
          <input type="number" name="inventory" value={form.inventory} onChange={change} placeholder="재고" className={inputCls}/>
        )}
      </div>

      {/* 이미지 업로드 */}
      <ImageUpload
        label="대표 이미지"
        name="productImage"
        preview={preview.product}
        onChange={change}
        required={!isEdit}
      />
      <ImageUpload
        label="상세 이미지"
        name="descriptionImage"
        preview={preview.desc}
        onChange={change}
        required={!isEdit}
      />

      <button className="btn-primary w-full">{isEdit?'수정하기':'등록하기'}</button>
    </form>
  );
}
