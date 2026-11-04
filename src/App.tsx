import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { GuestOnlyRoute } from '@/app/GuestOnlyRoute';
import { FindIdPage } from '@/pages/FindIdPage';
import { FindIdResultPage } from '@/pages/FindIdResultPage';
import { FindPasswordPage } from '@/pages/FindPasswordPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
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
