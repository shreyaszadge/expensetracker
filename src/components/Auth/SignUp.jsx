import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Card, CardContent } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import auth functions
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { auth } from '../../config/firebase'; // Import auth from Firebase config
import Swal from 'sweetalert2'; // Import SweetAlert2

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Create user using Firebase auth
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Display success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'Your account has been created successfully!',
        showConfirmButton: false,
        timer: 1500,
      });

      navigate('/login'); // Redirect to login page after successful sign-up
    } catch (error) {
      // Display error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Sign Up Failed',
        text: error.message,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 5 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Sign Up
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
            onClick={handleSignUp} 
            sx={{ mt: 2, width: '100%' }}
          >
          Create Account
          </Button>
          <Typography sx={{ mt: 2 }} align="center">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>
              Login here
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignUp;
