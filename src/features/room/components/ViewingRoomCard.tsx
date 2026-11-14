import { RoomCardActions } from '@/features/room/components/RoomCardActions';
import type { ViewingRoom } from '@/features/room/types/viewingList';
import { Playlist } from '@/shared/ui/Playlist';

interface ViewingRoomCardProps {
  room: ViewingRoom;
  onOpen: () => void;
}

export const ViewingRoomCard = ({ room, onOpen }: ViewingRoomCardProps) => {
  const date = new Date(room.viewedAt);
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\.$/, '');
  const timeLabel = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return (
    <li>
      <Playlist
        onOpen={onOpen}
        title={room.title}
        subtitle={room.description}
        thumbnail={room.thumbnail}
        duration={room.duration}
        tags={room.tags}
        dateTime={room.viewedAt}
        date={dateLabel}
        time={timeLabel}
        status={room.status}
        showPrivateRoom={room.isPrivate}
        actions={
          room.isPrivate && room.entryCode ? (
            <RoomCardActions
              title={room.title}
              isPrivate={room.isPrivate}
              entryCode={room.entryCode}
            />
          ) : undefined
        }
      />
    </li>
  );
};
