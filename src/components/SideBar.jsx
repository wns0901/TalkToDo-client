import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Link, useNavigate } from 'react-router-dom';

const SideBar = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 2 }}>
          Talk to Do
        </Typography>
        <Button 
          component={Link} 
          to="/my-schedule" 
          variant="contained" 
          startIcon={<EventNoteIcon />}
          sx={{ bgcolor: '#3E1A11', '&:hover': { bgcolor: '#2A120B' } }}
        >
          나의 일정 보기
        </Button>
      </Box>

      <Typography
        variant="h5"
        component={Link}
        to="/meetings/1"
        fontWeight="bold"
        sx={{ mb: 2, textDecoration: 'none', color: 'inherit', cursor: 'pointer', '&:hover': { color: '#3E1A11', textDecoration: 'underline' } }}
      >
        프로젝트 진행 상황 회의
      </Typography>
    </Container>
  );
};

export default SideBar;
