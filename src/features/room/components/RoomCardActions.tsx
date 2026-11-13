import { IconTrash } from '@/shared/ui/icons';

interface RoomCardActionsProps {
  title: string;
  isPrivate: boolean;
  entryCode?: string;
  onDelete: () => void;
}

export const RoomCardActions = ({
  title,
  isPrivate,
  entryCode,
  onDelete,
}: RoomCardActionsProps) => (
  <>
    {isPrivate && entryCode && (
      <span className="rounded-medium bg-background-elevated px-3 py-1.5 typo-heading-h4 text-label-normal">
        입장코드: {entryCode}
      </span>
    )}
    <button
      type="button"
      aria-label={`${title} 삭제`}
      onClick={(event) => {
        event.stopPropagation();
        onDelete();
      }}
      className="flex items-center gap-3 rounded-medium bg-background-elevated px-3 py-1.5 typo-heading-h4 text-label-normal hover:bg-interaction-hover active:bg-interaction-pressed focus-visible:outline-2 focus-visible:outline-line-focus"
    >
      <IconTrash className="size-6" />
      삭제
    </button>
  </>
);
