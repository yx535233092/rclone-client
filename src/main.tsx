import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router';

import LayoutPage from '@/layout/LayoutPage.tsx';
import SourceManage from '@/pages/source-manage/index.tsx';
import TargetManage from '@/pages/target-manage/index.tsx';
import MigrateTask from '@/pages/migrate-task/index.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<LayoutPage />}>
          <Route index element={<Navigate to="/migrate-task" replace />} />
          <Route path="migrate-task" element={<MigrateTask />} />
          <Route path="source-manage" element={<SourceManage />} />
          <Route path="target-manage" element={<TargetManage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
