// UI 시연용 입장 상태. 실제 서버 정책이나 status 배지로부터 입장 권한을 추론하지 않는다.
export type RoomEntry =
  | { kind: 'not-open'; opensAt: string; subscribed: boolean }
  | { kind: 'code-required' }
  | { kind: 'full' }
  | { kind: 'available' };

export interface RoomEntryTarget {
  id: string;
  entry?: RoomEntry;
  entryCode?: string;
}

export type RoomEntryDialogState =
  | { kind: 'subscribe' | 'subscribed'; roomId: string; opensAt: string }
  | { kind: 'code'; roomId: string; expectedCode?: string }
  | { kind: 'full' };
