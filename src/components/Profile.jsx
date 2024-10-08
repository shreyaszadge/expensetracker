
import { useEffect, useState } from "react";
import { Button, Container, Paper, Typography, Box, TextField, Avatar } from "@mui/material";
import { useAuth } from "../../lib/auth"; // Your Auth context
import Swal from "sweetalert2"; // For notifications
import { auth, db, storage } from "../../lib/firebase"; // Import your firebase configuration
import { updateProfile } from "firebase/auth"; // Importing updateProfile to change user profile info
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions

export default function Page() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePhoto, setProfilePhoto] = useState(user?.photoURL || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [collegeName, setCollegeName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
      setProfilePhoto(user.photoURL || "");
      fetchUserData(); // Fetch college name from Firestore
    }
  }, [user]);

  const fetchUserData = async () => {
    const userDocRef = doc(db, "users", user.uid); // Reference to the user document
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      setCollegeName(docSnap.data().collegeName || "");
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Set preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `profilePhotos/${user.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleUpdateProfile = async () => {
    try {
      if (photoFile) {
        const uploadedPhotoURL = await uploadImage(photoFile);
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: uploadedPhotoURL,
        });
      } else {
        // Update profile without photo change
        await updateProfile(auth.currentUser, { displayName: name });
      }
  
      // Reload the user to get the latest profile data
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
  
      // Update state with the new display name
      setName(updatedUser.displayName);
  
      // Update college name in Firestore
      const userDocRef = doc(db, "users", user.uid); // Reference to user document
      await setDoc(userDocRef, { collegeName: collegeName }, { merge: true });
  
      Swal.fire("Profile Updated!", "Your profile has been updated successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
      console.error("Profile update failed:", error.message);
    }
  };
  
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default, // Background color for dark mode
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: (theme) => theme.palette.background.paper, // Paper background color
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: (theme) => theme.palette.text.primary }} // Text color
        >
          Profile
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 3 }}>
          <Avatar
            alt={name}
            src={profilePhoto}
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-profile-photo"
            type="file"
            onChange={handlePhotoChange}
          />
          <label htmlFor="upload-profile-photo">
            <Button variant="contained" component="span" sx={{ marginBottom: 2 }}>
              Change Profile Photo
            </Button>
          </label>
        </Box>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          disabled // Email field is typically not editable
          margin="normal"
        />
        <TextField
          fullWidth
          label="College Name"
          variant="outlined"
          value={collegeName}
          onChange={(e) => setCollegeName(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleUpdateProfile}
          sx={{ paddingY: 1.5, borderRadius: "8px" }}
        >
          Update Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={logout}
          sx={{ paddingY: 1.5, marginTop: 2, borderRadius: "8px" }}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
}
