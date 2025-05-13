import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { myPageStyles } from '../css/MyPage.styles';

// 페이지 헤더 컴포넌트
export const PageHeader = ({ onBack }) => (
  <Box sx={myPageStyles.header}>
    <Box sx={myPageStyles.headerLeft}>
      <IconButton onClick={onBack} sx={myPageStyles.backButton}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={myPageStyles.title}>
        회원님
      </Typography>
    </Box>
  </Box>
);

// 로딩 화면 컴포넌트
export const LoadingView = () => (
  <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <CircularProgress />
  </Container>
);

// 에러 화면 컴포넌트
export const ErrorView = ({ error }) => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Alert severity="error">
      에러: {error}
    </Alert>
  </Container>
); 