import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';

import LayoutPage from '@/layout/LayoutPage.tsx';
import SourceManage from '@/pages/SourceManage.tsx';
import TargetManage from '@/pages/TargetManage.tsx';
import MigrateTask from './pages/MigrateTask.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPage />}>
          <Route index element={<Navigate to="/migrate-task" replace />} />
          <Route path="migrate-task" element={<MigrateTask />} />
          <Route path="source-manage" element={<SourceManage />} />
          <Route path="target-manage" element={<TargetManage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
