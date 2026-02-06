import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/scss/main.scss";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@/css/index.css';


import App from '@/App.tsx'
import queryClient from '@/config/queryClient';
import { AuthProvider } from '@/auth/AuthProvider';


createRoot(document.getElementById('root')!).render(

  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
)
