// src/pages/admin/CategoryTable.jsx
import { useState } from 'react';

import {
  useAllCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/api/adminApi';
import Button from '../../ui/core/Button';
import useToast from '../../ui/feedback/useToast';

export default function CategoryTable() {
  const toast = useToast();
  const { data: categories = [], isLoading, isError } = useAllCategoriesQuery();
  const [addCategory, { isLoading: adding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const [newName, setNewName] = useState('');
  const [editing, setEditing] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) {
      toast.push('카테고리 이름을 입력하세요.', 'error');
      return;
    }
    try {
      await addCategory({ categoryName: name }).unwrap();
      setNewName('');
      toast.success?.('카테고리가 추가되었습니다.');
    } catch {
      toast.error('카테고리 추가에 실패했습니다.');
    }
  };

  const startEdit = (category) => {
    setEditing(category.categoryId);
    setEditingName(category.categoryName ?? '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const name = editingName.trim();
    if (!name) {
      toast.push('카테고리 이름을 입력하세요.', 'error');
      return;
    }
    try {
      await updateCategory({ categoryId: editing, categoryName: name }).unwrap();
      toast.success?.('카테고리가 수정되었습니다.');
      setEditing(null);
      setEditingName('');
    } catch {
      toast.error('카테고리 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('해당 카테고리를 삭제할까요?')) return;
    try {
      await deleteCategory(categoryId).unwrap();
      toast.success?.('카테고리를 삭제했습니다.');
    } catch {
      toast.error('카테고리 삭제에 실패했습니다.');
    }
  };

  if (isLoading) return <p>카테고리를 불러오는 중입니다…</p>;
  if (isError) return <p className="text-red-500">카테고리를 불러올 수 없습니다.</p>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">카테고리 관리</h1>
        <p className="text-sm text-gray-500">카테고리를 추가하거나 이름을 변경할 수 있습니다.</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleAdd} className="space-y-3 rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold">카테고리 추가</h2>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="새 카테고리 이름"
          />
          <Button type="submit" disabled={adding} className="w-full">
            {adding ? '추가 중…' : '추가하기'}
          </Button>
        </form>

        <form onSubmit={handleUpdate} className="space-y-3 rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold">카테고리 이름 변경</h2>
          <select
            className="w-full rounded border px-3 py-2"
            value={editing ?? ''}
            onChange={(e) => {
              const id = Number(e.target.value);
              const category = categories.find((c) => c.categoryId === id);
              if (category) startEdit(category);
            }}
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          <input
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="새 이름"
            disabled={!editing}
          />
          <Button type="submit" disabled={!editing || updating} className="w-full">
            {updating ? '수정 중…' : '이름 변경'}
          </Button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">카테고리명</th>
              <th className="px-4 py-2 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.categoryId} className="border-t">
                <td className="px-4 py-2">{cat.categoryId}</td>
                <td className="px-4 py-2">{cat.categoryName}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    className="text-sm text-red-500 hover:underline"
                    disabled={deleting}
                    onClick={() => handleDelete(cat.categoryId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
