import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.tsx';
import SettingsPage from './Settings.tsx';
import './i18n/index.ts';
import './index.css';
import { persistor, store } from './store.ts';

const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
];
const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
