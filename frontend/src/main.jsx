import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Dashboard from './components/Dashboard.jsx';
import UnitPage from './components/UnitPage.jsx';
import ExamPage from './data/ExamPage.jsx';
import LLMOutput from './components/LLMOutput.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This can be your landing page or layout
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/:sectionId/:unitId',
    element: <UnitPage />,
  },
  {
    path: '/dashboard/:sectionId/exam',
    element: <ExamPage />,
  },  
  {
    path: '*',
    element: <div className="p-10 text-red-500 font-bold text-xl">404 - Page Not Found</div>,
  },
  {
    path: '/llm',
    element: <LLMOutput />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
