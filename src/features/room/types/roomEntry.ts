export interface RoomEntryTarget {
  id: string;
  hasWatchingHistory?: boolean;
  entryCode?: string;
}

export type RoomEntryDialogState =
  | { kind: 'subscribe' | 'subscribed'; roomId: string; opensAt: string }
  | { kind: 'code'; roomId: string }
  | { kind: 'full' };
