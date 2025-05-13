import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginContextProvider from "./contexts/LoginContextProvider.jsx";
import MainPage from "./domains/MainPage/MainPage.jsx";
import LoginPage from "./domains/LoginPage/LoginPage.jsx";
import MeetingDetailsPage from "./domains/MeetingDetailsPage/MeetingDetailsPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/meetings/:meetingId" element={<MeetingDetailsPage />} />
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
