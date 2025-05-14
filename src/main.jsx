import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./domains/MainPage/MainPage.jsx";
import LoginPage from "./domains/LoginPage/LoginPage.jsx";
import TotalMeetingComponent from "./domains/MeetingDetailsPage/components/TotalMeetingComponent.jsx";
import Recoder from "./domains/RecodingPage/RecodingPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/meeting-details" element={<TotalMeetingComponent />} />
      <Route path="/recoding" element={<Recoder />} />
    </Routes>
  </BrowserRouter>
);
