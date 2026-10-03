# COMEBACK ROOM Frontend

COMEBACK ROOM 프론트엔드 프로젝트입니다.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Axios
- Tailwind CSS
- MSW
- React Hook Form
- Zod
- Recharts

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
```

- `npm run dev`: 개발 서버 실행
- `npm run build`: 배포용 빌드 생성 및 빌드 가능 여부 확인
- `npm run lint`: ESLint 코드 검사
- `npm run format`: Prettier 코드 포맷팅

## Environment Variables

`.env.example` 파일을 참고하여 프로젝트 최상위에 `.env.local` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

`.env.local`은 Git에 올리지 않습니다.

## Branch Convention

- `main`: 배포용 브랜치, 직접 push 금지
- `develop`: 개발 통합 브랜치, PR을 통해 병합
- `feat/#이슈번호-기능`: 기능 개발
- `fix/#이슈번호-내용`: 버그 수정
- `refactor/...`: 리팩터링
- `chore/...`: 설정 및 패키지 관련 작업

예시:

```text
feat/#12-room-chat
fix/#18-login-error
chore/frontend-setup
```

## Commit Convention

커밋 메시지는 다음 형식을 사용합니다.

```text
타입: 내용 (#이슈번호)
```

예시:

```text
Feat: 시청방 채팅 메시지 전송 구현 (#12)
Chore: 프론트엔드 초기 설정
```

사용 가능한 타입:

- `Feat`: 새로운 기능 추가
- `Fix`: 버그 수정
- `Design`: UI 디자인 변경
- `Style`: 코드 포맷 등 로직 변경 없는 수정
- `Refactor`: 리팩터링
- `Comment`: 주석 추가 및 변경
- `Docs`: 문서 수정
- `Test`: 테스트 코드 추가 및 수정
- `Chore`: 빌드, 설정, 패키지 관련 작업
- `Asset`: 이미지 및 아이콘 추가 또는 수정
- `Rename`: 파일 및 폴더명 수정 또는 이동
- `Remove`: 파일 삭제
- `Init`: 프로젝트 초기 생성
- `Merge`: 브랜치 병합 및 충돌 해결
- `Deploy`: 배포

## Folder Structure

```text
src/
├── app/
├── pages/
├── features/
│   ├── auth/
│   ├── room/
│   ├── chat/
│   ├── reaction/
│   ├── vote/
│   ├── report/
│   └── notification/
├── shared/
│   ├── api/
│   ├── socket/
│   ├── ui/
│   ├── hooks/
│   └── utils/
├── stores/
├── mocks/
└── types/
```

### Folder Rules

- `pages`: 페이지 단위 화면. 비즈니스 로직보다는 feature 컴포넌트를 조합합니다.
- `features`: 기능 단위로 코드를 관리합니다.
- `shared`: 여러 기능에서 함께 사용하는 공통 코드를 관리합니다.
- `stores`: Zustand 전역 상태를 관리합니다.
- `mocks`: MSW mock API를 관리합니다.
- `types`: 공통 타입을 관리합니다.

## Pull Request

PR에는 아래 내용을 작성합니다.

- 작업 내용
- 관련 이슈
- 스크린샷
- 리뷰 포인트

프론트 PR은 다른 프론트 팀원 1명 이상의 리뷰 후 병합합니다.
병합 방식은 Squash Merge를 사용합니다.
