import { Link } from 'react-router-dom';

import { IconPlus } from '@/shared/ui/icons';

interface RoomSearchEmptyProps {
  keyword: string;
}

export const RoomSearchEmpty = ({ keyword }: RoomSearchEmptyProps) => {
  return (
    <div className="flex flex-col items-center pt-56 pb-24">
      <h3 className="typo-heading-semibold-36 text-label-strong">
        '{keyword}'에 대한 시청방이 없어요.
      </h3>

      <p className="mt-8 text-center typo-body-large text-label-neutral">
        원하는 시청방이 없다면 직접 시청방을 만들어
        <br />
        다른 팬들과 함께 시청해보세요!
      </p>

      <Link
        to="/rooms/new"
        className="mt-8 flex h-17 items-center gap-2 rounded-medium bg-primary-normal px-5 typo-heading-h4 text-label-normal hover:bg-primary-hover active:bg-primary-pressed"
      >
        <IconPlus className="size-6" />
        시청방 만들기
      </Link>
    </div>
  );
};
