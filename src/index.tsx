import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import useMockAdapter from './api/useMockAdapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

const RootApp = () => {
  useMockAdapter();

  return <App />;
};

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootApp />
    </QueryClientProvider>
  </React.StrictMode>
);
