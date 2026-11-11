import { type SubmitEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { resetPassword } from '@/features/auth/api/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { type Feedback, FormMessage } from '@/features/auth/components/FormMessage';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

// 8자 이상, 영문과 숫자를 모두 포함
const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,}';

// Figma GUI > 1-1-3-1 비밀번호 재설정 (node 333:863)
export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const verificationToken = (useLocation().state as { verificationToken?: string } | null)
    ?.verificationToken;
  const [isMismatch, setIsMismatch] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isPending, setIsPending] = useState(false);

  // 비밀번호 찾기에서 이메일 인증을 거치지 않고 주소로 바로 들어오면 찾기 화면으로 돌려보낸다
  if (!verificationToken) return <Navigate to="/find-password" replace />;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = String(formData.get('password'));
    const newPasswordConfirm = String(formData.get('passwordConfirm'));
    if (newPassword !== newPasswordConfirm) {
      setIsMismatch(true);
      return;
    }
    setIsPending(true);
    try {
      await resetPassword({ verificationToken, newPassword, newPasswordConfirm });
      navigate('/login', { replace: true });
    } catch (error) {
      setFeedback({ text: getErrorMessage(error), isError: true });
      setIsPending(false);
    }
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
            <FormMessage feedback={feedback} />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          비밀번호 재설정
        </Button>
      </form>
    </AuthCard>
  );
};
