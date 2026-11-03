import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { GuestOnlyRoute } from '@/app/GuestOnlyRoute';
import { FindIdPage } from '@/pages/FindIdPage';
import { FindIdResultPage } from '@/pages/FindIdResultPage';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="find-id" element={<FindIdPage />} />
          <Route path="find-id/result" element={<FindIdResultPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
