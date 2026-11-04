import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthCard } from '@/features/auth/components/AuthCard';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// Figma GUI > 1-1-3 비밀번호 찾기 (node 333:836)
export const FindPasswordForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // shortcut: 비밀번호 재설정 요청 API(/api/v1/auth/password/reset-request) 미연동, 연동 시 응답 확인 후 이동
    navigate('/find-password/reset', { state: { verified: true } });
  };

  const handleSendCode = () => {
    // shortcut: 인증번호 발송 API 미연동, 아무 동작 안 함
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
          </div>
        </div>

        <Button type="submit">비밀번호 찾기</Button>
      </form>
    </AuthCard>
  );
};
