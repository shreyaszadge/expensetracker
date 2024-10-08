import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent } from '@mui/material';
import { auth } from '../../config/firebase'; // Import auth from Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase sign-in method

import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate, Link } from 'react-router-dom'; 
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Use signInWithEmailAndPassword to log in the user
      await signInWithEmailAndPassword(auth, email, password);
      
      // Display success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        showConfirmButton: false,
        timer: 1500,
      });
      
      navigate('/'); // Redirect to home after login
    } catch (error) {
      // Display error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Login
          </Typography>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button 
            variant="contained" 
            onClick={handleLogin} 
            sx={{ mt: 2, width: '100%' }}
          >
            Login
          </Button>
          <Typography sx={{ mt: 2 }} align="center">
            create new Account {' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: 'blue' }}>
              Create Account 
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
