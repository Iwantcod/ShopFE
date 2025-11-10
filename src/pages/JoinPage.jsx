import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import Button from '../ui/core/Button';
import useToast from '../ui/feedback/useToast';
import {
  useJoinMutation,
  useLazyCheckEmailDupQuery,
  useLazyCheckUsernameDupQuery,
} from '../features/api/authApi';

const userJoinSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
  username: z.string().min(2, '유저네임은 최소 2자 이상이어야 합니다.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
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
});

const defaultValues = {
  email: '',
  password: '',
  username: '',
  name: '',
  birth: '',
  phone: '',
  address: '',
  addressDetail: '',
  zipCode: '',
};

export default function JoinPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [join, { isLoading: joining }] = useJoinMutation();
  const [checkEmailDup, { isFetching: checkingEmail }] = useLazyCheckEmailDupQuery();
  const [checkUsernameDup, { isFetching: checkingUsername }] =
    useLazyCheckUsernameDupQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(userJoinSchema),
    defaultValues,
  });

  const emailValue = watch('email');
  const usernameValue = watch('username');

  const [emailStatus, setEmailStatus] = useState('unchecked'); // unchecked | valid | invalid
  const [usernameStatus, setUsernameStatus] = useState('unchecked');

  useEffect(() => {
    setEmailStatus('unchecked');
  }, [emailValue]);

  useEffect(() => {
    setUsernameStatus('unchecked');
  }, [usernameValue]);

  const isReadyToSubmit = useMemo(
    () => emailStatus === 'valid' && usernameStatus === 'valid',
    [emailStatus, usernameStatus],
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

  const handleUsernameCheck = async () => {
    if (!usernameValue) {
      toast.push('유저네임을 입력한 뒤 중복을 확인하세요.', 'error');
      return;
    }
    try {
      await checkUsernameDup(usernameValue).unwrap();
      setUsernameStatus('valid');
      toast.push('사용 가능한 유저네임입니다.');
    } catch {
      setUsernameStatus('invalid');
      toast.push('이미 사용 중인 유저네임입니다.', 'error');
    }
  };

  const onSubmit = async (values) => {
    if (!isReadyToSubmit) {
      toast.push('이메일과 유저네임 중복을 확인해주세요.', 'error');
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await join(formData).unwrap();
      toast.push('회원가입이 완료되었습니다. 로그인해주세요.');
      reset(defaultValues);
      setEmailStatus('unchecked');
      setUsernameStatus('unchecked');
      navigate('/auth/login', { replace: true });
    } catch {
      toast.push('회원가입에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-6 rounded-lg bg-white p-8 shadow-card"
      >
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">일반 회원 가입</h1>
          <p className="text-sm text-gray-500">
            기본 정보를 입력하고 회원가입을 완료하세요.
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

          <div className="flex flex-col gap-2">
            <label className="flex items-center justify-between text-sm font-medium text-gray-700">
              <span>유저네임</span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleUsernameCheck}
                disabled={checkingUsername}
              >
                {checkingUsername ? '확인 중…' : '중복 확인'}
              </Button>
            </label>
            <input
              type="text"
              {...register('username')}
              className="rounded border px-3 py-2"
              placeholder="사용할 닉네임"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
            {usernameStatus === 'valid' && (
              <p className="text-sm text-green-600">사용 가능한 유저네임입니다.</p>
            )}
            {usernameStatus === 'invalid' && (
              <p className="text-sm text-red-500">이미 사용 중인 유저네임입니다.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              {...register('password')}
              className="rounded border px-3 py-2"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                {...register('name')}
                className="rounded border px-3 py-2"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

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
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">휴대폰 번호</label>
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

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">주소</label>
            <input
              type="text"
              {...register('address')}
              className="rounded border px-3 py-2"
              placeholder="주소"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">상세 주소</label>
              <input
                type="text"
                {...register('addressDetail')}
                className="rounded border px-3 py-2"
              />
              {errors.addressDetail && (
                <p className="text-sm text-red-500">{errors.addressDetail.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">우편번호</label>
              <input
                type="text"
                {...register('zipCode')}
                className="rounded border px-3 py-2"
              />
              {errors.zipCode && (
                <p className="text-sm text-red-500">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </section>

        <footer className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={joining || !isReadyToSubmit}
          >
            {joining ? '가입 중…' : '회원가입'}
          </Button>
          {!isReadyToSubmit && (
            <p className="text-center text-sm text-gray-500">
              이메일과 유저네임 중복 확인 완료 후 가입할 수 있습니다.
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
