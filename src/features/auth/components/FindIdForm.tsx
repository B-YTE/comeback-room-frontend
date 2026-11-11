import { type MouseEvent, type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { findId, sendEmailCode, verifyEmailCode } from '@/features/auth/api/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { type Feedback, FormMessage } from '@/features/auth/components/FormMessage';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// Figma GUI > 1-1-2 아이디 찾기 (node 333:1974)
export const FindIdForm = () => {
  const navigate = useNavigate();
  const [emailFeedback, setEmailFeedback] = useState<Feedback | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<Feedback | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    setIsPending(true);
    try {
      const { verificationToken } = await verifyEmailCode({
        email,
        verificationCode: String(formData.get('code')),
        purpose: 'FIND_ID',
      });
      const { loginId } = await findId({ email, verificationToken });
      navigate('/find-id/result', { state: { loginId } });
    } catch (error) {
      setSubmitFeedback({ text: getErrorMessage(error), isError: true });
      setIsPending(false);
    }
  };

  const handleSendCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const input = event.currentTarget.form?.elements.namedItem('email');
    if (!(input instanceof HTMLInputElement) || !input.reportValidity()) return;
    try {
      await sendEmailCode({ email: input.value, purpose: 'FIND_ID' });
      setEmailFeedback({ text: '인증번호를 발송했습니다.', isError: false });
    } catch (error) {
      setEmailFeedback({ text: getErrorMessage(error), isError: true });
    }
  };

  return (
    <AuthCard>
      <h1 className="typo-heading-medium text-label-normal">아이디 찾기</h1>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-14">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="find-id-email" className="typo-heading-h4 text-label-normal">
              이메일
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="find-id-email"
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
            <label htmlFor="find-id-code" className="typo-heading-h4 text-label-normal">
              인증코드 입력
            </label>
            <TextField
              id="find-id-code"
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
          아이디 찾기
        </Button>
      </form>
    </AuthCard>
  );
};
