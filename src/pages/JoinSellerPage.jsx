import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';
import {
  useJoinSellerMutation,
  useLazyCheckEmailDupQuery,
  useLazyCheckUsernameDupQuery,
} from '../features/api/authApi';

const sellerJoinSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  name: z.string().min(1, '대표자 이름을 입력해주세요.'),
  birth: z.string().optional().or(z.literal('')),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^\d{3}-\d{4}-\d{4}$/.test(value),
      '휴대폰 번호는 000-0000-0000 형식으로 입력해주세요.',
    ),
  address: z.string().optional().or(z.literal('')),
  addressDetail: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  businessType: z.string().min(1, '업태를 입력해주세요.'),
  businessNumber: z.string().min(1, '사업자등록번호를 입력해주세요.'),
  officeAddress: z.string().min(1, '사업장 주소를 입력해주세요.'),
  bankName: z.string().min(1, '은행명을 입력해주세요.'),
  bankAccount: z.string().min(1, '계좌번호를 입력해주세요.'),
  depositor: z.string().min(1, '예금주명을 입력해주세요.'),
  businessName: z.string().min(1, '상호명을 입력해주세요.'),
});

const defaultValues = {
  email: '',
  password: '',
  name: '',
  birth: '',
  phone: '',
  address: '',
  addressDetail: '',
  zipCode: '',
  businessType: '',
  businessNumber: '',
  officeAddress: '',
  bankName: '',
  bankAccount: '',
  depositor: '',
  businessName: '',
};

export default function JoinSellerPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [joinSeller, { isLoading: joining }] = useJoinSellerMutation();
  const [checkEmailDup, { isFetching: checkingEmail }] = useLazyCheckEmailDupQuery();
  const [checkUsernameDup, { isFetching: checkingBusinessName }] =
    useLazyCheckUsernameDupQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(sellerJoinSchema),
    defaultValues,
  });

  const emailValue = watch('email');
  const businessNameValue = watch('businessName');

  const [emailStatus, setEmailStatus] = useState('unchecked');
  const [businessNameStatus, setBusinessNameStatus] = useState('unchecked');

  useEffect(() => {
    setEmailStatus('unchecked');
  }, [emailValue]);

  useEffect(() => {
    setBusinessNameStatus('unchecked');
  }, [businessNameValue]);

  const isReadyToSubmit = useMemo(
    () => emailStatus === 'valid' && businessNameStatus === 'valid',
    [emailStatus, businessNameStatus],
  );

  const handleEmailCheck = async () => {
    if (!emailValue) {
      toast.push('이메일을 입력한 뒤 중복을 확인하세요.', 'error');
      return;
    }
    try {
      await checkEmailDup(emailValue).unwrap();
      setEmailStatus('valid');
      toast.push('사용 가능한 이메일입니다.');
    } catch {
      setEmailStatus('invalid');
      toast.push('이미 사용 중인 이메일입니다.', 'error');
    }
  };

  const handleBusinessNameCheck = async () => {
    if (!businessNameValue) {
      toast.push('상호명을 입력한 뒤 중복을 확인하세요.', 'error');
      return;
    }
    try {
      await checkUsernameDup(businessNameValue).unwrap();
      setBusinessNameStatus('valid');
      toast.push('사용 가능한 상호명입니다.');
    } catch {
      setBusinessNameStatus('invalid');
      toast.push('이미 사용 중인 상호명입니다.', 'error');
    }
  };

  const onSubmit = async (values) => {
    if (!isReadyToSubmit) {
      toast.push('이메일과 상호명 중복을 확인해주세요.', 'error');
      return;
    }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await joinSeller(formData).unwrap();
      toast.push('판매자 회원가입이 완료되었습니다.');
      reset(defaultValues);
      setEmailStatus('unchecked');
      setBusinessNameStatus('unchecked');
      navigate('/auth/login', { replace: true });
    } catch {
      toast.push('판매자 회원가입에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl space-y-6 rounded-lg bg-white p-8 shadow-card"
      >
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">판매자 회원 가입</h1>
          <p className="text-sm text-gray-500">
            사업자 정보를 입력하고 판매자 계정을 생성하세요.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>이메일</span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleEmailCheck}
                disabled={checkingEmail}
              >
                {checkingEmail ? '확인 중…' : '중복 확인'}
              </Button>
            </label>
            <input
              type="email"
              {...register('email')}
              className="rounded border px-3 py-2"
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
            {emailStatus === 'valid' && (
              <p className="text-sm text-green-600">사용 가능한 이메일입니다.</p>
            )}
            {emailStatus === 'invalid' && (
              <p className="text-sm text-red-500">이미 사용 중인 이메일입니다.</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                {...register('password')}
                className="rounded border px-3 py-2"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">대표자 이름</label>
              <input
                type="text"
                {...register('name')}
                className="rounded border px-3 py-2"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">생년월일</label>
              <input
                type="date"
                {...register('birth')}
                className="rounded border px-3 py-2"
              />
              {errors.birth && (
                <p className="text-sm text-red-500">{errors.birth.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">연락처</label>
              <input
                type="text"
                {...register('phone')}
                className="rounded border px-3 py-2"
                placeholder="010-1234-5678"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">사업자 주소</label>
            <input
              type="text"
              {...register('officeAddress')}
              className="rounded border px-3 py-2"
              placeholder="사업장 주소"
            />
            {errors.officeAddress && (
              <p className="text-sm text-red-500">{errors.officeAddress.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                업태 / 종목
              </label>
              <input
                type="text"
                {...register('businessType')}
                className="rounded border px-3 py-2"
              />
              {errors.businessType && (
                <p className="text-sm text-red-500">{errors.businessType.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                사업자등록번호
              </label>
              <input
                type="text"
                {...register('businessNumber')}
                className="rounded border px-3 py-2"
                placeholder="000-00-00000"
              />
              {errors.businessNumber && (
                <p className="text-sm text-red-500">
                  {errors.businessNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>상호명 (유저네임)</span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleBusinessNameCheck}
                disabled={checkingBusinessName}
              >
                {checkingBusinessName ? '확인 중…' : '중복 확인'}
              </Button>
            </label>
            <input
              type="text"
              {...register('businessName')}
              className="rounded border px-3 py-2"
              placeholder="상호명"
            />
            {errors.businessName && (
              <p className="text-sm text-red-500">{errors.businessName.message}</p>
            )}
            {businessNameStatus === 'valid' && (
              <p className="text-sm text-green-600">사용 가능한 상호명입니다.</p>
            )}
            {businessNameStatus === 'invalid' && (
              <p className="text-sm text-red-500">이미 사용 중인 상호명입니다.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">정산 계좌</label>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  {...register('bankName')}
                  className="rounded border px-3 py-2"
                  placeholder="은행명"
                />
                {errors.bankName && (
                  <p className="text-sm text-red-500">{errors.bankName.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <input
                  type="text"
                  {...register('bankAccount')}
                  className="rounded border px-3 py-2"
                  placeholder="계좌번호"
                />
                {errors.bankAccount && (
                  <p className="text-sm text-red-500">
                    {errors.bankAccount.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 md:col-span-3">
                <input
                  type="text"
                  {...register('depositor')}
                  className="rounded border px-3 py-2"
                  placeholder="예금주명"
                />
                {errors.depositor && (
                  <p className="text-sm text-red-500">{errors.depositor.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">대표 주소</label>
              <input
                type="text"
                {...register('address')}
                className="rounded border px-3 py-2"
                placeholder="대표자 주소"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">우편번호</label>
              <input
                type="text"
                {...register('zipCode')}
                className="rounded border px-3 py-2"
                placeholder="우편번호"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">대표자 상세 주소</label>
            <input
              type="text"
              {...register('addressDetail')}
              className="rounded border px-3 py-2"
              placeholder="상세 주소"
            />
          </div>
        </section>

        <footer className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={joining || !isReadyToSubmit}
          >
            {joining ? '가입 중…' : '판매자 회원가입'}
          </Button>
          {!isReadyToSubmit && (
            <p className="text-center text-sm text-gray-500">
              이메일과 상호명 중복 확인 완료 후 가입할 수 있습니다.
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate('/auth/join/type')}
            className="w-full text-sm text-gray-500 underline"
          >
            회원 유형 선택으로 돌아가기
          </button>
        </footer>
      </form>
    </div>
  );
}
