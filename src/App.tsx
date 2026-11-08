import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { GuestOnlyRoute } from '@/app/GuestOnlyRoute';
import { CreatedRoomsPage } from '@/pages/CreatedRoomsPage';
import { FindIdPage } from '@/pages/FindIdPage';
import { FindIdResultPage } from '@/pages/FindIdResultPage';
import { FindPasswordPage } from '@/pages/FindPasswordPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { MyPage } from '@/pages/MyPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { SignupPage } from '@/pages/SignupPage';
import { ViewingListPage } from '@/pages/ViewingListPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="mypage/created-rooms" element={<CreatedRoomsPage />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="mypage/viewing-list" element={<ViewingListPage />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="find-id" element={<FindIdPage />} />
          <Route path="find-id/result" element={<FindIdResultPage />} />
          <Route path="find-password" element={<FindPasswordPage />} />
          <Route path="find-password/reset" element={<ResetPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
