import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./domains/MainPage/MainPage.jsx";
import LoginPage from "./domains/LoginPage/LoginPage.jsx";
import MeetingDetailsPage from "./domains/MeetingDetailsPage/MeetingDetailsPage.jsx";
import MyPage from "./domains/MyPage/MyPage.jsx";
import TotalMeetingComponent from "./domains/MeetingDetailsPage/components/TotalMeetingComponent.jsx";
import Recoder from "./domains/RecodingPage/RecodingPage.jsx";
import EmailSendingModal from "./domains/MeetingDetailsPage/components/EmailSendingModal.jsx";
import SetToListModal from "./domains/MeetingDetailsPage/components/SetToListModal.jsx";
import AppLayout from "./components/AppLayout";
import LoginContextProvider from "./contexts/LoginContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/meetings/:meetingId" element={<MeetingDetailsPage />} />
          <Route path="/my-schedule" element={<MyPage />} />
          <Route path="/recoding" element={<Recoder />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </LoginContextProvider>
  </BrowserRouter>
);
