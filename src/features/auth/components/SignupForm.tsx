import { type MouseEvent, type SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  checkNicknameAvailability,
  sendEmailCode,
  signUp,
  verifyEmailCode,
} from '@/features/auth/api/auth';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { type Feedback, FormMessage } from '@/features/auth/components/FormMessage';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Button } from '@/shared/ui/Button';
import { IconCheck, IconChevronDown } from '@/shared/ui/icons';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';

// 8자 이상, 영문과 숫자를 모두 포함 (ResetPasswordForm과 같은 규칙)
const PASSWORD_PATTERN = '(?=.*[A-Za-z])(?=.*\\d).{8,}';

const AGREEMENTS = [
  { name: 'termsAgreed', label: '[필수] 이용약관에 동의합니다.' },
  { name: 'privacyAgreed', label: '[필수] 개인정보 처리방침에 동의합니다.' },
];

// Figma GUI > 회원가입 (node 333:269)
export const SignupForm = () => {
  const navigate = useNavigate();
  const [isMismatch, setIsMismatch] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [emailFeedback, setEmailFeedback] = useState<Feedback | null>(null);
  const [codeFeedback, setCodeFeedback] = useState<Feedback | null>(null);
  const [nicknameFeedback, setNicknameFeedback] = useState<Feedback | null>(null);
  const [submitFeedback, setSubmitFeedback] = useState<Feedback | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('password') !== formData.get('passwordConfirm')) {
      setIsMismatch(true);
      return;
    }
    if (!verificationToken) {
      setCodeFeedback({ text: '이메일 인증을 먼저 완료해주세요.', isError: true });
      return;
    }
    setIsPending(true);
    try {
      await signUp({
        loginId: String(formData.get('loginId')),
        email: String(formData.get('email')),
        emailVerificationToken: verificationToken,
        nickname: String(formData.get('nickname')),
        password: String(formData.get('password')),
        passwordConfirm: String(formData.get('passwordConfirm')),
        // 두 체크박스 모두 required라 제출됐다면 동의한 상태
        termsAgreed: true,
        privacyAgreed: true,
      });
      navigate('/login', { replace: true });
    } catch (error) {
      setSubmitFeedback({ text: getErrorMessage(error), isError: true });
      setIsPending(false);
    }
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

  const handleVerifyCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const emailInput = getValidInput(event, 'email');
    const codeInput = emailInput && getValidInput(event, 'code');
    if (!emailInput || !codeInput) return;
    try {
      const { verificationToken } = await verifyEmailCode({
        email: emailInput.value,
        verificationCode: codeInput.value,
        purpose: 'SIGN_UP',
      });
      setVerificationToken(verificationToken);
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
            <label htmlFor="signup-login-id" className="typo-heading-h4 text-label-normal">
              아이디
            </label>
            <div className="flex gap-3.75">
              <TextField
                id="signup-login-id"
                name="loginId"
                autoComplete="username"
                placeholder="아이디를 입력해주세요"
                required
              />
              {/* shortcut: 아이디 중복 확인 API가 명세에 없어 비활성, 중복은 제출 시 409로 알림. API가 생기면 연결 */}
              <TextFieldButton disabled>중복 확인</TextFieldButton>
            </div>
          </div>

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

          <div className="flex flex-col gap-3">
            {AGREEMENTS.map(({ name, label }) => (
              <div key={name} className="flex items-center justify-between">
                <label className="flex items-center gap-4 typo-title-20-regular text-label-neutral">
                  <span className="relative size-6 shrink-0">
                    <input
                      type="checkbox"
                      name={name}
                      required
                      className="peer block size-6 appearance-none rounded-small border border-label-neutral checked:border-primary-normal checked:bg-primary-normal"
                    />
                    <IconCheck className="pointer-events-none absolute inset-0 hidden size-6 text-label-strong peer-checked:block" />
                  </span>
                  {label}
                </label>
                {/* shortcut: 약관 본문이 아직 없어 펼치기 동작 없이 아이콘만 표시, 본문이 나오면 펼침 연결 */}
                <IconChevronDown className="text-label-neutral" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={isPending}>
            회원가입
          </Button>
          <FormMessage feedback={submitFeedback} />
        </div>
      </form>
    </AuthCard>
  );
};
