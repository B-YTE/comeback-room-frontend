# COMEBACK ROOM 프론트엔드 작업 가이드

이 레포의 모든 코드 작업은 「COMEBACK ROOM 프론트엔드 기술 스택 & 협업 가이드」(2026-10-03, @Ahyeong Lee)를 기준으로 한다.
아래 규칙과 충돌하는 방식으로 코드를 작성하지 않는다.

## 기술 스택

| 영역 | 기술 | 용도 |
|---|---|---|
| 언어 | TypeScript (strict) | 전체 |
| 프레임워크 | React + Vite | SPA |
| 라우팅 | React Router | 페이지 이동 |
| 서버 상태 | TanStack Query | 시청방 목록, 리포트, 마이페이지 API |
| 클라이언트 상태 | Zustand | 로그인 유저, 시청방 상태(재생 위치, 참여자, 방장 여부) |
| 스타일 | Tailwind CSS | 전체 UI, 디자인 토큰 |
| HTTP | axios | API 요청, 토큰 인터셉터 |
| 실시간 통신 | @stomp/stompjs 또는 socket.io-client (백엔드와 합의 전) | 채팅, 리액션, 투표, 재생 동기화, 알림 |
| 영상 | YouTube IFrame Player API | 시청방 플레이어 제어 |
| 폼·검증 | React Hook Form + Zod | 회원가입, 시청방 생성, 투표 생성 |
| 차트 | Recharts | 종료 리포트(리액션 타임라인, 투표 결과) |
| API 목업 | MSW | 백엔드 API 완성 전 화면 개발 |
| 코드 품질 | ESLint, Prettier, Husky, lint-staged | 커밋 전 자동 검사 |
| 배포 | Vercel | develop 미리보기, main 운영 |

새 라이브러리는 위 목록에 없으면 추가하기 전에 사용자에게 먼저 확인한다.

### 미정 사항 (확정 전에는 임의로 결정하지 말고 확인할 것)

- 실시간 통신 방식 (WebSocket + STOMP / Socket.IO)
- API 명세 도구와 공통 응답 형식
- 인증 방식 (Access Token 저장 위치, 구글 로그인 리다이렉트 흐름)

## 디자인 (Figma)

- 디자인 파일: https://www.figma.com/design/5ep8CVNydboFXKLMiUEAeJ/%EB%94%94%EC%9E%90%EC%9D%B8 (fileKey `5ep8CVNydboFXKLMiUEAeJ`)
- `component-button` 섹션: node `276:289`
- UI 구현 시 Figma MCP로 디자인 컨텍스트를 가져와서 구현하되, 색상·간격·폰트는 Tailwind 설정의 디자인 토큰으로 옮겨서 사용한다.

## 폴더 구조

```
src/
├── app/              # 라우터, Provider(QueryClient 등), 전역 스타일
├── pages/            # 라우트 단위 화면, 기능을 가져와 배치만 함
│                     # HomePage, RoomPage, RoomCreatePage, ReportPage, MyPage, LoginPage
├── features/         # 기능 단위 묶음
│   ├── auth/
│   ├── room/         # 목록, 생성, 플레이어 동기화
│   ├── chat/
│   ├── reaction/
│   ├── vote/
│   ├── report/
│   └── notification/
│       └── (각 기능 안: components/ hooks/ api/ types/)
├── shared/
│   ├── api/          # axios 인스턴스, 인터셉터
│   ├── socket/       # WebSocket 연결·구독 관리
│   ├── ui/           # Button, Modal, Input 등 공통 컴포넌트
│   ├── hooks/
│   └── utils/
├── stores/           # Zustand 스토어
├── mocks/            # MSW 핸들러
└── types/            # 공통 타입 (API 응답 형식 등)
```

### 폴더 규칙

- 페이지가 아닌 기능 단위로 묶는다. 여러 화면에서 쓰는 기능(예: 투표)은 `features/vote`에 한 번만 작성한다.
- `pages`에는 로직을 두지 않고 `features` 컴포넌트를 조합만 한다.
- 기능 폴더끼리 직접 import하지 않는다. 함께 쓰는 코드는 `shared`로 옮긴다.
- 모든 기능 폴더의 하위 구성은 `components / hooks / api / types`로 통일한다.
- 폴더명은 약어 없이 풀어서 쓴다 (`stInfo` ✗ → `student-info` ○).
- 공통 코드는 `shared` 한 곳에만 둔다.

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `RoomCard.tsx` |
| 훅 | use + camelCase | `useRoomSocket.ts` |
| 일반 함수·변수 | camelCase | `formatViewerCount` |
| 상수 | UPPER_SNAKE_CASE | `MAX_VOTE_OPTIONS` |
| 타입·인터페이스 | PascalCase, Props는 접미사 | `RoomSummary`, `RoomCardProps` |
| 이벤트 핸들러 | handle + 동작 / props는 on + 동작 | `handleSubmit` / `onSubmit` |

## 코드 규칙

- 함수형 컴포넌트 + 화살표 함수로 통일한다.
- `any` 사용 금지. 불가피하면 `unknown`으로 받은 뒤 타입을 좁힌다.
- 절대 경로 import를 쓴다 (`@/features/room/...`).
- 환경 변수는 `.env.local`에 두고 Git에 올리지 않는다. `.env.example`만 공유한다.

## 스타일 규칙 (Tailwind)

- `prettier-plugin-tailwindcss`로 클래스 순서를 자동 정렬한다.
- 조건부 클래스는 `clsx` + `tailwind-merge`를 묶은 `cn()` 유틸로 처리한다.
- 색상·간격·폰트는 임의 값(`text-[#ff0000]`) 대신 설정 파일의 토큰만 사용한다.
- 클래스가 길어지는 버튼·입력창·모달은 `shared/ui` 공통 컴포넌트로 만들어 재사용한다.

## Git 협업 규칙

### 브랜치

| 브랜치 | 용도 |
|---|---|
| `main` | 배포용, 직접 푸시 금지 |
| `develop` | 개발 통합 브랜치, PR로만 병합 |
| `feat/#이슈번호-기능` | 기능 개발 (예: `feat/#12-room-chat`) |
| `fix/#이슈번호-내용` | 버그 수정 |
| `refactor/`, `chore/` | 리팩터링, 설정·패키지 작업 |

### 커밋 메시지

형식: `타입: 내용 (#이슈번호)` — 예: `Feat: 시청방 채팅 메시지 전송 구현 (#12)`

| 타입 | 의미 |
|---|---|
| Feat | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Design | CSS 등 사용자 UI 디자인 변경 |
| Style | 코드 포맷, 세미콜론 등 로직 변경 없는 수정 |
| Refactor | 리팩터링 |
| Comment | 필요한 주석 추가 및 변경 |
| Docs | 문서 수정 |
| Test | 테스트 코드 추가·수정·삭제 (비즈니스 로직 변경 없음) |
| Chore | 빌드·설정 수정, 패키지 설치 등 운영 코드 변경 없는 작업 |
| Asset | 이미지, 아이콘 등 소스 파일 추가 및 수정 |
| Rename | 파일·폴더명 수정 또는 이동만 하는 경우 |
| Remove | 파일 삭제만 하는 경우 |
| Init | 프로젝트 초기 생성 |
| Merge | 브랜치 병합, 충돌 해결 |
| Deploy | 배포 |

- 이모지는 사용하지 않는다.
- 타입은 첫 글자 대문자, 콜론 뒤 한 칸 띄운다.
- 제목은 50자 이내, 끝에 마침표 없음.
- 한 커밋에는 한 가지 작업만 (기능 추가와 리팩터링을 섞지 않기).

### PR 규칙

- PR 템플릿: 작업 내용, 관련 이슈, 스크린샷, 리뷰 포인트
- 병합 방식은 Squash merge
- PR은 작게 (가능하면 변경 300줄 이내)
- 프론트 PR은 다른 프론트 1명 이상 승인 후 병합 (셀프 머지 금지). API 연동 PR은 담당 백엔드도 리뷰어로 추가

### 이슈 관리

- GitHub Issues + Projects 보드 (Todo / In Progress / Review / Done)
- 이슈 템플릿: 기능 / 버그 두 가지
- 라벨: `FE`, `BE`, `feat`, `bug`, `priority:high`

## 프론트-백엔드 협업

### API 명세

- 백엔드가 Swagger(OpenAPI)로 문서화, 확정 전에는 Notion 표로 먼저 합의
- 엔드포인트마다 요청·응답 예시 JSON을 붙여 두면 프론트가 그대로 타입과 목업(MSW)으로 만든다
- 명세 변경 시 단톡방 공유 + 이슈에 기록

### 공통 응답 형식 (제안)

```json
{
  "success": true,
  "code": "ROOM_200",
  "message": "요청 성공",
  "data": {}
}
```

- 에러 코드 예: `ROOM_404` 방 없음, `ROOM_403` 비공개방 코드 불일치, `ROOM_409` 인원 초과
- 날짜는 ISO 8601 문자열 (`2026-10-03T15:00:00+09:00`)
- 목록 API는 페이지네이션 방식 통일 (page/size 또는 커서)

### 인증

- 자체 로그인 + 구글 로그인 모두 JWT 발급으로 통일하는 방향 (제안)
- 미정: Access Token 저장 위치(메모리 vs localStorage). Refresh Token은 httpOnly 쿠키 권장
- 구글 로그인 콜백 URL과 프론트 리다이렉트 경로는 백엔드와 합의
- 개발 단계 CORS 허용 도메인: `localhost:5173`, 배포 도메인

### 시청방 동기화 흐름

1. 방장이 재생·일시정지·탐색하면 플레이어 이벤트를 받아 서버로 `{action, currentTime}` 전송
2. 참여자는 서버 이벤트를 받아 플레이어를 같은 시간으로 이동 후 같은 상태로 맞춤
3. 늦게 입장한 참여자는 입장 시 현재 재생 상태를 서버에서 받아 맞춤
4. 네트워크 지연 차이는 일정 오차(예: 1~2초) 이상일 때만 보정 (오차 기준은 백엔드와 합의)

### 실시간 이벤트 명세 (예시)

| 이벤트 | 방향 | 데이터 |
|---|---|---|
| PLAYER_SYNC | 방장 → 서버 → 전원 | action(play/pause/seek), currentTime |
| CHAT_MESSAGE | 양방향 | userId, nickname, profileImage, content, sentAt |
| REACTION | 양방향 | type(heart/surprise/laugh), videoTime |
| VOTE_CREATED / VOTE_UPDATED / VOTE_CLOSED | 서버 → 전원 | voteId, question, options, counts, deadline |
| PARTICIPANT_JOIN / LEAVE | 서버 → 전원 | 참여자 목록 또는 변경된 유저 |
| ROOM_CLOSED | 서버 → 전원 | roomId (리포트 화면으로 이동) |

## 역할 분담

| 담당자 | 담당 영역 |
|---|---|
| A | 시청방(플레이어 동기화, 소켓, 채팅, 리액션, 투표), 로그인 흐름 |
| B | 공통 UI 컴포넌트, 홈, 시청방 생성, 마이페이지 |
| C | 회원가입 폼, 종료 리포트, 지난 리포트, 알림 |

## 스프린트 계획 (2주 단위)

### 1차 (10/5 ~ 11/10) · 중간 발표

| 스프린트 | 기간 | A | B | C |
|---|---|---|---|---|
| S1 | 10/5 ~ 10/18 | 프로젝트 세팅, 소켓·API 명세 합의 | 공통 UI 컴포넌트, 디자인 토큰 | 로그인·회원가입 화면 (MSW) |
| S2 | 10/19 ~ 11/1 | 플레이어 + 재생 동기화 | 홈 시청방 목록, 정렬 | 시청방 생성 폼 |
| S3 | 11/2 ~ 11/10 | 채팅, 리액션, 참여자 목록 | 로그인·홈 실제 API 연동 | 발표용 데모 시나리오, 버그 수정 |

1차 완료 기준: 로그인 → 방 생성 → 입장 → 방장 재생에 맞춰 동시 시청 → 채팅·리액션까지 실제 서버로 시연

### 2차 (11/11 ~ 12/15) · 최종 발표

| 스프린트 | 기간 | A | B | C |
|---|---|---|---|---|
| S4 | 11/11 ~ 11/24 | 투표 (생성, 실시간 집계) | 비공개방 코드 입장, 마이페이지 | 종료 리포트 기본 통계 |
| S5 | 11/25 ~ 12/8 | 동기화 안정화 (재접속, 지연 보정) | 홈 필터·태그, 진행 예정 방 | 리액션 타임라인, 투표 결과, 지난 리포트 |
| S6 | 12/9 ~ 12/15 | 배포, QA | QA, 반응형 점검 | 알림, 발표 준비 |

2차 완료 기준: 기능 명세서의 시청방·종료 리포트·마이페이지 전체 흐름 동작, 배포 URL로 시연

여유 있을 때 추가: 이메일 인증, 아이디·비밀번호 찾기, 인기 장면, 이번주 인기 영상, 프로필 이미지 수정

## 초기 세팅 체크리스트

- [ ] 프로젝트 생성 (Vite React-TS 템플릿)
- [ ] ESLint, Prettier, Husky, lint-staged 설정
- [ ] 절대 경로 alias(`@/`) 설정
- [ ] 폴더 구조 생성 및 README에 실행 방법 작성
- [ ] axios 인스턴스 + 토큰 인터셉터
- [ ] TanStack Query Provider, Zustand 스토어 기본 틀
- [ ] MSW 설정 + 시청방 목록 목업
- [ ] Tailwind 설정, 디자인 토큰(색상, 폰트) 반영, prettier-plugin-tailwindcss와 `cn()` 유틸 추가
- [ ] 공통 컴포넌트: Button, Input, Modal, Navbar
- [ ] PR·이슈 템플릿, 브랜치 보호 규칙 (main, develop)
- [ ] Vercel 연결 및 develop 브랜치 미리보기 배포
