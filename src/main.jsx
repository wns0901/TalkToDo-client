import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./domains/MainPage/MainPage.jsx";
import LoginPage from "./domains/LoginPage/LoginPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);
