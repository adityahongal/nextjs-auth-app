"use client";

import { useState } from "react";
import { auth, provider, signInWithPopup, signOut } from "../../firebase";
import { Button, Avatar, Typography, Container } from "@mui/material";

export default function Home() {
  const [user, setUser] = useState(null);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Container className="flex flex-col items-center mt-20">
      {user ? (
        <div className="flex flex-col items-center space-y-4">
          <Typography variant="h3" gutterBottom>
            Welcome {user.displayName}
          </Typography>
          <Avatar src={user.photoURL} sx={{ width: 100, height: 100 }} />
          <Typography variant="h6">{user.displayName}</Typography>
          <Button onClick={logout} variant="contained" color="secondary">
            Logout
          </Button>
        </div>
      ) : (
        <>
          <Typography variant="h3" gutterBottom>
            Please Sign-In with Google
          </Typography>
          <Button onClick={login} variant="contained">
            Sign in with Google
          </Button>
        </>
      )}
    </Container>
  );
}
