import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import MeetingNotesTab from './components/MeetingNotesTab';
import TodoScheduleTab from './components/TodoScheduleTab';
import TabBar from '../../components/TabBar';
import { getMeetingDetails } from '../../apis/fakeApi';
import { meetingDetailsStyles } from './css/MeetingDetailsPage.styles';

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
    message: '', 
    severity: 'info' 
  });
  
  const navigate = useNavigate();
  // const { id } = useParams();
  const meetingId = 1; 

  useEffect(() => {
    fetchMeetingDetails(meetingId);
  }, [meetingId]);


  const fetchMeetingDetails = (id) => {
    setLoading(true);
    getMeetingDetails(id)
      .then(data => {
        setMeetingData(data);
        setLoading(false);
      })
      .catch(err => {
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
   * 뒤로 가기 핸들러
   */
  const handleBack = () => {
    navigate(-1);
  };

  /**
   * 공유 기능 핸들러
   */
  const handleShare = (action) => {
    const shareMessages = {
      docs: 'Docs 다운로드를 시작합니다.',
      email: '메일로 회의 자료를 발송합니다.',
      members: '회의 인원 설정 화면으로 이동합니다.',
      view: '공유 상태를 확인합니다.',
      default: '공유 기능을 실행합니다.'
    };
    
    const message = shareMessages[action] || shareMessages.default;
    
    setSnackbar({
      open: true,
      message,
      severity: 'info'
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
    <Container maxWidth="lg" sx={meetingDetailsStyles.container}>
      <MeetingHeader 
        title={meetingData.title}
        date={meetingData.date}
        participants={meetingData.participants}
        onBack={handleBack}
      />

      <Paper sx={meetingDetailsStyles.paper}>
        <TabBar 
          value={activeTabIndex} 
          onChange={handleTabChange}
          onShare={handleShare}
        />

        <TabPanel value={activeTabIndex} index={0}>
          <MeetingInfoTab />
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
    <Alert severity="error">
      에러: {error}
    </Alert>
  </Container>
);

/**
 * 데이터가 없을 때 표시할 컴포넌트
 */
const NoDataView = () => (
  <Container maxWidth="lg" sx={meetingDetailsStyles.container}>
    <Alert severity="info">
      데이터를 찾을 수 없습니다.
    </Alert>
  </Container>
);

/**
 * 회의 헤더 컴포넌트
 */
const MeetingHeader = ({ title, date, participants, onBack }) => (
  <Box sx={meetingDetailsStyles.header}>
    <Box sx={meetingDetailsStyles.breadcrumbs}>
      <IconButton onClick={onBack} sx={meetingDetailsStyles.backButton}>
        <ArrowBackIcon />
      </IconButton>
      <Breadcrumbs aria-label="breadcrumb">
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="inherit"
        >
          <HomeIcon sx={meetingDetailsStyles.homeIcon} fontSize="inherit" />
          홈
        </MuiLink>
        <MuiLink
          component={Link}
          to="/meetings"
          underline="hover"
          color="inherit"
        >
          회의 목록
        </MuiLink>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>
    </Box>

    <Box sx={meetingDetailsStyles.titleContainer}>
      <Typography variant="h4" component="h1" sx={meetingDetailsStyles.title}>
        {title}
      </Typography>
    </Box>

    <Typography variant="subtitle1" sx={meetingDetailsStyles.subtitle}>
      {date} | 참여자: {participants.join(', ')}
    </Typography>
  </Box>
);

/**
 * 회의 정보 탭 컴포넌트
 */
const MeetingInfoTab = () => (
  <Box sx={meetingDetailsStyles.tabContent}>
    <Typography variant="h5" component="h2" sx={meetingDetailsStyles.tabTitle}>
      회의 정보
    </Typography>
    <Divider sx={meetingDetailsStyles.divider} />
    <Typography variant="body1">
      이 탭에는 회의 정보와 녹음 내용이 표시됩니다.
    </Typography>
  </Box>
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
    {...other}
  >
    {value === index && children}
  </div>
);

export default MeetingDetailsPage;
