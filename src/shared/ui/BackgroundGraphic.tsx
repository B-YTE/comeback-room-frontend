import glowBottomUrl from '@/assets/bg-glow-bottom.svg';
import glowTopUrl from '@/assets/bg-glow-top.svg';
import graphicUrl from '@/assets/bg-graphic.svg';

// Figma GUI > bg_graphic (node 499:3585). 로그인·회원가입·계정 찾기·마이페이지 배경
export const BackgroundGraphic = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={glowTopUrl}
        alt=""
        className="absolute -top-216 -right-204.5 size-427.5 max-w-none"
      />
      <img
        src={glowBottomUrl}
        alt=""
        className="absolute top-128 -left-219.25 size-427.5 max-w-none"
      />
      <div className="absolute top-74 -inset-x-61.5 h-198.75">
        <img src={graphicUrl} alt="" className="size-full" />
      </div>
    </div>
  );
};
