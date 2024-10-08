import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Auth

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

export default function Navbar({ children }) {
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User logged out");
      // Optionally, redirect to login page or show a success message
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error (optional)
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <IconButton
            color="inherit"
            aria-label="logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main>
        <Toolbar />
        {children}
      </Main>
    </Box>
  );
}
