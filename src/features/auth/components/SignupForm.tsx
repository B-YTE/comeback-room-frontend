import { type MouseEvent, type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  checkNicknameAvailability,
  sendEmailCode,
  verifyEmailCode,
} from '@/features/auth/api/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { type Feedback, FormMessage } from '@/features/auth/components/FormMessage';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// 8자 이상, 영문과 숫자를 모두 포함 (ResetPasswordForm과 같은 규칙)
const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,}';

// Figma GUI > 회원가입 (node 333:269)
export const SignupForm = () => {
  const navigate = useNavigate();
  const [isMismatch, setIsMismatch] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<Feedback | null>(null);
  const [codeFeedback, setCodeFeedback] = useState<Feedback | null>(null);
  const [nicknameFeedback, setNicknameFeedback] = useState<Feedback | null>(null);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('password') !== formData.get('passwordConfirm')) {
      setIsMismatch(true);
      return;
    }
    // shortcut: 회원가입 API는 loginId·약관 동의가 필수인데 화면에 해당 항목이 없어 미연동, 백엔드·디자인과 항목을 맞춘 뒤 연결
    navigate('/login', { replace: true });
  };

  // 버튼이 속한 폼에서 입력값을 꺼내고, 비어 있거나 형식이 틀리면 브라우저 검증 문구를 띄운다
  const getValidInput = (event: MouseEvent<HTMLButtonElement>, name: string) => {
    const input = event.currentTarget.form?.elements.namedItem(name);
    return input instanceof HTMLInputElement && input.reportValidity() ? input : null;
  };

  const handleSendCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const emailInput = getValidInput(event, 'email');
    if (!emailInput) return;
    try {
      await sendEmailCode({ email: emailInput.value, purpose: 'SIGN_UP' });
      setEmailFeedback({ text: '인증번호를 발송했습니다.', isError: false });
    } catch (error) {
      setEmailFeedback({ text: getErrorMessage(error), isError: true });
    }
  };

  // shortcut: 받은 verificationToken은 회원가입 API 연동 때 상태로 보관해 제출에 사용
  const handleVerifyCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const emailInput = getValidInput(event, 'email');
    const codeInput = emailInput && getValidInput(event, 'code');
    if (!emailInput || !codeInput) return;
    try {
      await verifyEmailCode({
        email: emailInput.value,
        verificationCode: codeInput.value,
        purpose: 'SIGN_UP',
      });
      setCodeFeedback({ text: '이메일 인증이 완료되었습니다.', isError: false });
    } catch (error) {
      setCodeFeedback({ text: getErrorMessage(error), isError: true });
    }
  };

  const handleCheckNickname = async (event: MouseEvent<HTMLButtonElement>) => {
    const nicknameInput = getValidInput(event, 'nickname');
    if (!nicknameInput) return;
    try {
      const { available } = await checkNicknameAvailability(nicknameInput.value);
      setNicknameFeedback(
        available
          ? { text: '사용 가능한 닉네임입니다.', isError: false }
          : { text: '이미 사용 중인 닉네임입니다.', isError: true },
      );
    } catch (error) {
      setNicknameFeedback({ text: getErrorMessage(error), isError: true });
    }
  };

  return (
    <AuthCard>
      <div className="flex flex-col items-center gap-4">
        <h1 className="typo-heading-medium text-label-strong">회원가입</h1>
        <p className="typo-title-20-regular text-label-neutral">
          이메일 또는 소셜 계정으로 가입하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <label htmlFor="signup-email" className="typo-heading-h4 text-label-normal">
              이메일
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="signup-email"
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
            <label htmlFor="signup-code" className="typo-heading-h4 text-label-normal">
              인증번호 입력
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="signup-code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="인증번호를 입력해주세요"
                required
              />
              <TextFieldButton onClick={handleVerifyCode}>인증하기</TextFieldButton>
            </div>
            <FormMessage feedback={codeFeedback} />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="signup-nickname" className="typo-heading-h4 text-label-normal">
              닉네임
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="signup-nickname"
                name="nickname"
                autoComplete="nickname"
                placeholder="닉네임을 입력해주세요"
                required
              />
              <TextFieldButton onClick={handleCheckNickname}>중복 확인</TextFieldButton>
            </div>
            <FormMessage feedback={nicknameFeedback} />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="signup-password" className="typo-heading-h4 text-label-normal">
              비밀번호
            </label>
            <TextField
              id="signup-password"
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
            <label htmlFor="signup-password-confirm" className="typo-heading-h4 text-label-normal">
              비밀번호 확인
            </label>
            <TextField
              id="signup-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력해주세요."
              aria-invalid={isMismatch}
              aria-describedby={isMismatch ? 'signup-password-error' : undefined}
              onChange={() => setIsMismatch(false)}
              required
            />
            {isMismatch && (
              <p
                id="signup-password-error"
                role="alert"
                className="typo-body-medium text-status-negative"
              >
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
        </div>

        <Button type="submit">회원가입</Button>
      </form>
    </AuthCard>
  );
};
