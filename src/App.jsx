import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginProvider } from "./contexts/LoginContext";
import MyPage from "./domains/MyPage/MyPage";

function App() {
  return (
    <Router>
      <LoginProvider>
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          {/* 다른 라우트들... */}
        </Routes>
      </LoginProvider>
    </Router>
  );
}

export default App; 