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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><MainPage /></AppLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/meetings/:meetingId" element={<AppLayout><MeetingDetailsPage /></AppLayout>} />
        <Route path="/my-schedule" element={<AppLayout><MyPage /></AppLayout>} />
        <Route path="/meeting-details" element={<AppLayout><TotalMeetingComponent /></AppLayout>} />
        <Route path="/recoding" element={<AppLayout><Recoder /></AppLayout>} />
        <Route path="/email-sending" element={<AppLayout><EmailSendingModal /></AppLayout>} />
        <Route path="/set-to-list" element={<AppLayout><SetToListModal /></AppLayout>} />
      </Routes>
  </BrowserRouter>
);
