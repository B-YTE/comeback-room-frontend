import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import googleLogoUrl from '@/assets/google-logo.png';
import logoWordmarkUrl from '@/assets/logo-wordmark.svg';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/oauth2/authorization/google`;

// Figma GUI > 1-1-1 로그인 (node 333:239)
export const LoginForm = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // shortcut: 로그인 API 요청 본문·토큰 저장 방식이 명세에 없어 제출해도 아무 동작 안 함, 명세 확정 후 연결
  };

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <section className="mx-auto mt-40 mb-35 flex w-162.5 flex-col items-center gap-20 rounded-extralarge border border-line-focus bg-background-surface p-14">
      <div className="flex flex-col items-center gap-4">
        <h1>
          <img src={logoWordmarkUrl} alt="COMEBACK ROOM" className="w-90" />
        </h1>
        <p className="typo-title-18-semibold text-label-normal">지금, 함께 보는 컴백의 순간</p>
      </div>

      <div className="flex w-full flex-col items-center gap-5 py-8.5">
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <label htmlFor="login-id" className="typo-heading-h4 text-label-normal">
                아이디
              </label>
              <TextField
                id="login-id"
                name="loginId"
                autoComplete="username"
                placeholder="아이디를 입력해주세요"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-4">
                <label htmlFor="login-password" className="typo-heading-h4 text-label-normal">
                  비밀번호
                </label>
                <TextField
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해주세요"
                  required
                />
              </div>
              <Link to="/find-id" className="self-end typo-body-medium text-label-neutral">
                아이디 / 비밀번호 찾기
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button type="submit">로그인</Button>
            <Button variant="secondary" onClick={handleGoogleLogin}>
              <img src={googleLogoUrl} alt="" className="size-9" />
              구글 로그인
            </Button>
          </div>
        </form>

        <p className="typo-label-medium text-label-neutral">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </section>
  );
};
