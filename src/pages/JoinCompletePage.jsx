import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';
import { useJoinCompleteMutation } from '../features/api/authApi';

const schema = z.object({
  username: z.string().min(2, '유저네임은 최소 2자 이상이어야 합니다.'),
  birth: z.string().optional().or(z.literal('')),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^\d{3}-\d{4}-\d{4}$/.test(value),
      '전화번호는 000-0000-0000 형식으로 입력해주세요.',
    ),
  address: z.string().optional().or(z.literal('')),
  addressDetail: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
});

const defaultValues = {
  username: '',
  birth: '',
  phone: '',
  address: '',
  addressDetail: '',
  zipCode: '',
};

export default function JoinCompletePage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [joinComplete, { isLoading }] = useJoinCompleteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await joinComplete(formData).unwrap();
      toast.push('추가 정보가 저장되었습니다. 다시 로그인해주세요.');
      navigate('/auth/login', { replace: true });
    } catch {
      toast.push('정보 저장에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl space-y-6 rounded-lg bg-white p-8 shadow-card"
      >
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase text-primary">OAuth 가입 완료</p>
          <h1 className="text-2xl font-semibold text-gray-900">추가 정보 입력</h1>
          <p className="text-sm text-gray-500">
            첫 로그인 시 필요한 정보를 입력하면 가입이 완료됩니다.
          </p>
        </header>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              유저네임(닉네임) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('username')}
              className="w-full rounded border px-3 py-2"
              placeholder="사용할 닉네임"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">생년월일</label>
              <input type="date" {...register('birth')} className="w-full rounded border px-3 py-2" />
              {errors.birth && (
                <p className="text-sm text-red-500">{errors.birth.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">전화번호</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="000-0000-0000"
                className="w-full rounded border px-3 py-2"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">주소</label>
            <input
              type="text"
              {...register('address')}
              placeholder="도로명 주소"
              className="w-full rounded border px-3 py-2"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">상세 주소</label>
              <input
                type="text"
                {...register('addressDetail')}
                className="w-full rounded border px-3 py-2"
                placeholder="동/호수 등"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">우편번호</label>
              <input
                type="text"
                {...register('zipCode')}
                className="w-full rounded border px-3 py-2"
                placeholder="우편번호"
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '저장 중…' : '저장하고 로그인하기'}
        </Button>
      </form>
    </div>
  );
}
