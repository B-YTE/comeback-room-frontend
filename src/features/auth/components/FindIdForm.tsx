import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

// Figma GUI > 1-1-2 아이디 찾기 (node 333:1974)
export const FindIdForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // shortcut: 아이디 찾기 API 명세가 없어 예시 아이디로 결과 화면에 이동, 명세 확정 후 응답값으로 교체
    navigate('/find-id/result', { state: { loginId: 'ewhaian' } });
  };

  const handleSendCode = () => {
    // shortcut: 인증번호 발송 API 명세가 없어 아무 동작 안 함, 명세 확정 후 연결
  };

  return (
    <section className="mx-auto mt-40 mb-35 flex w-162.5 flex-col items-center gap-20 rounded-extralarge border border-line-focus bg-background-surface p-14">
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
              <button
                type="button"
                onClick={handleSendCode}
                className="h-14 w-39 shrink-0 rounded-medium bg-label-normal px-6 typo-title-20-semibold text-background-base"
              >
                인증번호 발송
              </button>
            </div>
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
          </div>
        </div>

        <Button type="submit">아이디 찾기</Button>
      </form>
    </section>
  );
};
