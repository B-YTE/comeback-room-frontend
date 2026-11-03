import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';

// Figma GUI > 1-1-2-1 아이디 찾기 결과 (node 333:520)
export const FindIdResult = () => {
  const navigate = useNavigate();
  const loginId = (useLocation().state as { loginId?: string } | null)?.loginId;

  // 아이디 찾기를 거치지 않고 주소로 바로 들어오면 찾기 화면으로 돌려보낸다
  if (!loginId) return <Navigate to="/find-id" replace />;

  return (
    <section className="mx-auto mt-40 mb-35 flex w-243.5 flex-col items-center gap-20 rounded-extralarge border border-line-focus bg-background-surface p-14">
      <div className="flex flex-col items-center gap-4">
        <h1 className="typo-heading-medium text-label-normal">아이디 찾기</h1>
        <p className="typo-title-20-regular text-label-neutral">
          입력하신 정보와 일치하는 아이디는 아래와 같습니다.
        </p>
      </div>

      <p className="typo-heading-h1 text-primary-normal">{loginId}</p>

      <div className="flex w-134.5 flex-col gap-4 pb-5">
        <Button onClick={() => navigate('/find-password')}>비밀번호 찾기</Button>
        <Button variant="secondary" onClick={() => navigate('/login')}>
          로그인 페이지로 이동
        </Button>
      </div>
    </section>
  );
};
