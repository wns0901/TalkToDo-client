import { Box, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginForm from './components/LoginForm';
import './css/LoginPage.css';

const LoginPage = () => {
  
  return (
    <Box className="login-container">
      <Box className="login-box">
        <Avatar className="login-avatar">
          <AccountCircleIcon sx={{ width: '80%', height: '80%' }} />
        </Avatar>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
