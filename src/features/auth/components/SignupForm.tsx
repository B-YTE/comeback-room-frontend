import { type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@/features/auth/components/AuthCard';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// 8자 이상, 영문과 숫자를 모두 포함 (ResetPasswordForm과 같은 규칙)
const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,}';

// Figma GUI > 회원가입 (node 333:269)
export const SignupForm = () => {
  const navigate = useNavigate();
  const [isMismatch, setIsMismatch] = useState(false);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('password') !== formData.get('passwordConfirm')) {
      setIsMismatch(true);
      return;
    }
    // shortcut: 회원가입 API(/api/v1/auth/sign-up) 미연동, 연동 시 성공 응답 후 이동
    navigate('/login', { replace: true });
  };

  // shortcut: 이메일 발송·인증, 닉네임 중복 확인 API 미연동이라 아무 동작 안 함, 연동 시 연결
  const handleSendCode = () => {};
  const handleVerifyCode = () => {};
  const handleCheckNickname = () => {};

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
