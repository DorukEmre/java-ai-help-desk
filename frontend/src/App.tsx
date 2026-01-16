import { Routes, Route } from "react-router-dom";

import Header from '@/components/Header';

import HomePage from '@/pages/HomePage';
import Page404 from "@/pages/Page404";

function App() {

  return (
    <div className="d-flex flex-column min-vh-100 bg-back-300 text-neutral-300">
      <Header />

      <main className="flex-fill p-5">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* 404 / Fallback */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </main>

    </div>
  )
}

export default App
