# 시청 목록 공통 컴포넌트 검토

- 기준: [Figma GUI](https://www.figma.com/design/5ep8CVNydboFXKLMiUEAeJ?node-id=328-115)의 component 영역 `463:159`, 시청 목록 `333:641`.
- MCP로 페이지 구조, 디자인 컨텍스트와 스크린샷을 확인했다. CLAUDE.md의 “와이어프레임만 있음” 설명과 달리 GUI에는 개발 가능 표시가 붙은 화면과 공통 컴포넌트가 있다.
- 색상은 `theme.css` Semantic 토큰, 글자는 `typo-*`를 사용한다. 아래 크기는 Figma 원본이며 구현은 기존 규칙대로 1/1.5 배율을 적용한다. body 글자는 기존 최소 가독성 크기를 유지한다.

## Component 영역 목록

ActionButton, TextField, input, top bar, logo, 시청방만들기 btn, Search input,
popular video, Watch Room, Filter Chip, filter btn, Summary statistic, Chat message,
Reaction chip, Replay, Rank, Archived poll, popular scene, edit btn, nickname input,
Playlist, Status Badge, 대기방 생성 card, pagenation, arrow, message input,
option input, vote input, filter, 공개/비공개, Title Input, Capacity Input,
구글 로그인 btn, Profile Menu Item.

## Figma ↔ React 대응

| Figma / 노드                     | Variants·Properties·원본 크기                                                                         | React 대응 및 판단                                                                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ActionButton `463:123`           | Type primary/secondary × pressed false/true, 538×66                                                   | 기존 `shared/ui/Button.tsx` 재사용. 추가·재시도에 사용. 기존 hover/active/disabled 동작 유지                                                                                   |
| TextField `463:164`              | Type Default/Focus/Filled/Error, 538×56                                                               | 기존 `shared/ui/TextField.tsx` 재사용. 아티스트 입력에 사용. 현재 Error의 붉은 테두리는 미구현이며 오류 문구·aria-invalid는 유지. 다른 인증 화면의 공통 스타일은 수정하지 않음 |
| TextField 옆 버튼                | 입력창 옆 보조 버튼                                                                                   | 기존 `TextFieldButton.tsx` 확인. 현재 추가 버튼은 기존 ActionButton 유지                                                                                                       |
| top bar `491:332`                | type BeforeLogin/Home/Report, 1920×130                                                                | 기존 `Navbar.tsx`를 앱 레이아웃에서 재사용                                                                                                                                     |
| logo `528:324` / Icons           | logo 385×80 / IconPlus 24×24                                                                          | 기존 로고 에셋 및 `shared/ui/icons/IconPlus.tsx` 재사용                                                                                                                        |
| Playlist `568:5771`              | type default/hover, 1792×261. title/subtitle/date/time 텍스트, showPrivateRoom 불리언. 썸네일 376×211 | 신규 `shared/ui/Playlist.tsx`. 제목·설명·썸네일·길이·태그·날짜·시간·상태·비공개 표시를 props로 받음. `ViewingRoomCard`는 날짜 변환과 데이터 연결만 담당                        |
| Status Badge `568:5740`          | type 진행 중/진행 중료/진행 예정, 108×33 또는 132×33, 점 12×12, gap 16                                | 신규 `shared/ui/StatusBadge.tsx`. live/ended/scheduled를 표시. Figma의 “진행 중료” 오타는 화면과 동일하게 “진행 종료”로 표시                                                   |
| Playlist 태그 `568:5723`         | 콘텐츠에 따른 너비, padding 32/12, radius full, Heading/H4                                            | 신규 `shared/ui/Chip.tsx`의 `Chip`. 카드 태그에 재사용                                                                                                                         |
| 화면 아티스트 필터 `565:5575` 등 | 전체/아티스트 선택 상태, 전체 106×58, 아티스트 126×58. padding 32/12                                  | 같은 파일의 `ChipButton`, selected 및 aria-pressed 제공. 태그와 기본 스타일 공유                                                                                               |
| 항목 추가 `565:5587`             | 190×60, 점선 테두리, IconPlus 24, gap 12                                                              | `ChipButton variant="add"` 및 기존 `IconPlus` 재사용. 펼침 상태는 aria-expanded 사용                                                                                           |
| Filter Chip `540:722`            | 전체/진행중/진행 예정/참여 가능한 방, 422×58                                                          | 시청방 상태 필터용으로 아티스트 필터와 다름. 미구현, 이번 화면에 도입하지 않음                                                                                                 |
| filter btn `550:4025`            | Filter option Default/Selected, Action Primary/Reset, 242×48                                          | 미구현. 팝업 필터·액션용이며 둥근 아티스트 칩과 다름                                                                                                                           |
| filter `594:4750`                | selected true/false, name 텍스트, 260×60, radius medium                                               | 미구현. 정렬 선택 버튼이며 둥근 아티스트 칩과 다름                                                                                                                             |
| 기타 Component 영역 항목         | 위 목록 참조                                                                                          | 현재 `src/shared/ui`와 `src/features`에 해당 이름의 전용 React 구현 없음. 이번 화면 범위 밖                                                                                    |

`src/features/auth`는 AuthCard 및 인증 폼 조합, `src/features/mypage`는 MyPageContent,
`src/features/room`은 시청 목록 조회·필터·날짜 포맷 등 기능을 담당한다. 기능 폴더 간 import를 추가하지 않았다.
`BackgroundGraphic`은 기존 공통 배경이며 이번 화면에 추가할 필요가 없다.

## 범위와 유지 사항

- 기존 Button, TextField, TextFieldButton, Navbar, theme.css는 수정하지 않았다. 새 공통 UI의 사용처는 현재 시청 목록뿐이다.
- Playlist의 hover variant는 테두리 색 차이다. 기존 시청 목록의 live 카드 강조를 그대로 유지했다. 실제 방 이동을 제공하는 버튼/링크는 서버 연동 전까지 추가하지 않았다.
- 기존 로컬 썸네일 5개, 잠금 아이콘, 상태 점 3개 및 IconPlus를 유지했다. API/목업이 제공하는 이미지는 동적으로 전달한다.
- 로딩, 재시도, 빈 목록, 아티스트 선택·추가·중복 검증, 비공개 표시, 길이·태그·한국 시간, 개발용 목록 안내를 유지했다.
- 공통 컴포넌트와 디자인시스템 전체의 기존 차이(예: TextField Error 스타일)는 별도 범위로 남겼다.

## 검증

- `npm run lint`: 통과.
- `npm run build`: 통과 (TypeScript 및 Vite).
- `git diff --check`: 통과.
- React SSR 검사: 상태 3종 × 비공개 여부 2종, 태그 목록·날짜·시간·길이, 필터 선택 상태, 추가 버튼의 접근성 속성 통과. 브라우저 상호작용 테스트를 대체하지는 않는다.
- 브라우저 연결 호스트가 없어 실제 브라우저의 시각·상호작용 검증은 수행하지 못했다.
