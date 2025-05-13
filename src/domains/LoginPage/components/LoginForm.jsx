import { useState, useContext } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Checkbox,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import '../css/LoginPage.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(LoginContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password, rememberMe);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      className="login-form"
    >
      <TextField
        variant="outlined"
        required
        fullWidth
        id="username"
        placeholder="Email ID"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="login-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        variant="outlined"
        required
        fullWidth
        name="password"
        placeholder="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />
      
      <Box className="remember-me-container">
        <FormControlLabel
          control={
            <Checkbox 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="remember-me-checkbox"
            />
          }
          label={<Typography className="remember-me-label">Remember me</Typography>}
        />
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        disableElevation
        className="login-button"
      >
        LOGIN
      </Button>
    </Box>
  );
};

export default LoginForm; 