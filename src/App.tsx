import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { GuestOnlyRoute } from '@/app/GuestOnlyRoute';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<GuestOnlyRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
