
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button
} from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
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
    </Container>
  );
};

export default MainPage;
