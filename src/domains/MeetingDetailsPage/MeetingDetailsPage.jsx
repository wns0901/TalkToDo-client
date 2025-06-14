import {
  Alert,
  CircularProgress,
  Container,
  Paper,
  Snackbar
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../apis/baseApi";
import { getMeetingDetails } from "../../apis/fakeApi";
import TabBar from "../../components/TabBar";
import EmailSendingModal from "./components/EmailSendingModal";
import MeetingNotesTab from "./components/MeetingNotesTab";
import TodoScheduleTab from "./components/TodoScheduleTab";
import TotalMeetingComponent from "./components/TotalMeetingComponent";
import { meetingDetailsStyles } from "./css/MeetingDetailsPage.styles";

/**
 * 회의 상세 페이지 컴포넌트
 */
const MeetingDetailsPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const { meetingId } = useParams();

  useEffect(() => {
    fetchMeetingDetails(meetingId);
  }, [meetingId]);

  const fetchMeetingDetails = (id) => {
    setLoading(true);
    getMeetingDetails(id)
      .then((data) => {
        setMeetingData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  /**
   * 탭 변경 핸들러
   */
  const handleTabChange = (event, newValue) => {
    setActiveTabIndex(newValue);
  };

  /**
   * 공유 기능 핸들러
   */
  const handleShare = async (action) => {
    const shareMessages = {
      docs: "Docs 다운로드를 시작합니다.",
      email: "메일로 회의 자료를 발송합니다.",
      members: "회의 인원 설정 화면으로 이동합니다.",
      view: "공유 상태를 확인합니다.",
      default: "공유 기능을 실행합니다.",
    };
    if (action === "email") {
      setEmailModalOpen(true);
      return;
    }

    if (action === "docs") {
      const res = await api.get(`api/meetings/${meetingId}/docx`);
      const docsUrl = res.data;
      console.log(docsUrl);

      window.open(docsUrl, "_blank");
      return;
    }

    const message = shareMessages[action] || shareMessages.default;
    setSnackbar({
      open: true,
      message,
      severity: "info",
    });
  };

  /**
   * 스낵바 닫기 핸들러
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (loading) {
    return <LoadingView />;
  }

  // 에러가 있을 때 표시할 컴포넌트
  if (error) {
    return <ErrorView error={error} />;
  }

  // 데이터가 없을 때 표시할 컴포넌트
  if (!meetingData) {
    return <NoDataView />;
  }

  return (
    <Container maxWidth={false} sx={meetingDetailsStyles.container}>
      <Paper
        sx={{
          ...meetingDetailsStyles.paper,
          maxHeight: "90vh",
          overflowY: "auto",
          width: "95%",
          margin: "0 auto",
        }}
      >
        <TabBar
          value={activeTabIndex}
          onChange={handleTabChange}
          onShare={handleShare}
        />

        <TabPanel value={activeTabIndex} index={0}>
          <TotalMeetingComponent />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={1}>
          <MeetingNotesTab meetingId={meetingData.id} />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={2}>
          <TodoScheduleTab meetingId={meetingData.id} />
        </TabPanel>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <EmailSendingModal
        open={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
      />
    </Container>
  );
};

/**
 * 로딩 중일 때 표시할 컴포넌트
 */
const LoadingView = () => (
  <Container maxWidth="lg" sx={meetingDetailsStyles.loadingContainer}>
    <CircularProgress />
  </Container>
);

/**
 * 에러가 있을 때 표시할 컴포넌트
 */
const ErrorView = ({ error }) => (
  <Container maxWidth="lg" sx={meetingDetailsStyles.container}>
    <Alert severity="error">에러: {error}</Alert>
  </Container>
);

/**
 * 데이터가 없을 때 표시할 컴포넌트
 */
const NoDataView = () => (
  <Container maxWidth="lg" sx={meetingDetailsStyles.container}>
    <Alert severity="info">데이터를 찾을 수 없습니다.</Alert>
  </Container>
);

/**
 * 탭 패널 컴포넌트
 */
const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`meeting-tabpanel-${index}`}
    aria-labelledby={`meeting-tab-${index}`}
    style={{ display: value === index ? "block" : "none", width: "100%" }}
    {...other}
  >
    {children}
  </div>
);

export default MeetingDetailsPage;
