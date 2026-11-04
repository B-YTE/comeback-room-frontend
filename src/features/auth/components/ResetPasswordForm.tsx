import { type FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { AuthCard } from '@/features/auth/components/AuthCard';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

// 8자 이상, 영문과 숫자를 모두 포함
const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,}';

// Figma GUI > 1-1-3-1 비밀번호 재설정 (node 333:863)
export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const verified = (useLocation().state as { verified?: boolean } | null)?.verified;
  const [isMismatch, setIsMismatch] = useState(false);

  // 비밀번호 찾기를 거치지 않고 주소로 바로 들어오면 찾기 화면으로 돌려보낸다
  if (!verified) return <Navigate to="/find-password" replace />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('password') !== formData.get('passwordConfirm')) {
      setIsMismatch(true);
      return;
    }
    // shortcut: 비밀번호 재설정 API(/api/v1/auth/password/reset) 미연동, 연동 시 성공 응답 후 이동
    navigate('/login', { replace: true });
  };

  return (
    <AuthCard>
      <h1 className="typo-heading-medium text-label-normal">비밀번호 재설정</h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="reset-password" className="typo-heading-h4 text-label-normal">
              비밀번호
            </label>
            <TextField
              id="reset-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상, 영문+숫자 조합"
              pattern={PASSWORD_PATTERN}
              title="8자 이상, 영문과 숫자를 함께 입력해주세요"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="reset-password-confirm" className="typo-heading-h4 text-label-normal">
              비밀번호 확인
            </label>
            <TextField
              id="reset-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력해주세요"
              aria-invalid={isMismatch}
              aria-describedby={isMismatch ? 'reset-password-error' : undefined}
              onChange={() => setIsMismatch(false)}
              required
            />
            {isMismatch && (
              <p
                id="reset-password-error"
                role="alert"
                className="typo-body-medium text-status-negative"
              >
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
        </div>

        <Button type="submit">비밀번호 재설정</Button>
      </form>
    </AuthCard>
  );
};
