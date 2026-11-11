import { type MouseEvent, type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { requestPasswordReset, verifyEmailCode } from '@/features/auth/api/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { type Feedback, FormMessage } from '@/features/auth/components/FormMessage';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// Figma GUI > 1-1-3 비밀번호 찾기 (node 333:836)
export const FindPasswordForm = () => {
  const navigate = useNavigate();
  const [emailFeedback, setEmailFeedback] = useState<Feedback | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<Feedback | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsPending(true);
    try {
      const { verificationToken } = await verifyEmailCode({
        email: String(formData.get('email')),
        verificationCode: String(formData.get('code')),
        purpose: 'PASSWORD_RESET',
      });
      navigate('/find-password/reset', { state: { verificationToken } });
    } catch (error) {
      setSubmitFeedback({ text: getErrorMessage(error), isError: true });
      setIsPending(false);
    }
  };

  // 명세상 재설정 요청 API가 아이디·이메일을 확인하고 인증코드를 발송한다
  const handleSendCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const elements = event.currentTarget.form?.elements;
    const loginIdInput = elements?.namedItem('loginId');
    const emailInput = elements?.namedItem('email');
    if (
      !(loginIdInput instanceof HTMLInputElement) ||
      !(emailInput instanceof HTMLInputElement) ||
      !loginIdInput.reportValidity() ||
      !emailInput.reportValidity()
    ) {
      return;
    }
    try {
      await requestPasswordReset({ loginId: loginIdInput.value, email: emailInput.value });
      setEmailFeedback({ text: '인증번호를 발송했습니다.', isError: false });
    } catch (error) {
      setEmailFeedback({ text: getErrorMessage(error), isError: true });
    }
  };

  return (
    <AuthCard>
      <h1 className="typo-heading-medium text-label-normal">비밀번호 찾기</h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="find-password-id" className="typo-heading-h4 text-label-normal">
              아이디
            </label>
            <TextField
              id="find-password-id"
              name="loginId"
              autoComplete="username"
              placeholder="아이디를 입력해주세요"
              required
            />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="find-password-email" className="typo-heading-h4 text-label-normal">
              이메일
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="find-password-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ewha123@gmail.com"
                required
              />
              <TextFieldButton onClick={handleSendCode}>인증번호 발송</TextFieldButton>
            </div>
            <FormMessage feedback={emailFeedback} />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="find-password-code" className="typo-heading-h4 text-label-normal">
              인증코드 입력
            </label>
            <TextField
              id="find-password-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="인증코드를 입력해주세요"
              required
            />
            <FormMessage feedback={submitFeedback} />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          비밀번호 찾기
        </Button>
      </form>
    </AuthCard>
  );
};
