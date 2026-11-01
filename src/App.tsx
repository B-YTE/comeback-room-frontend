import { Route, Routes } from 'react-router-dom';

import { AppLayout } from '@/app/AppLayout';
import { HomePage } from '@/pages/HomePage';

const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default App;
