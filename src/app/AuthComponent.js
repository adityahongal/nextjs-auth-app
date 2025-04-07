// src/app/AuthComponent.js
"use client";

import { useState, useEffect } from "react";
import { 
  auth, 
  provider, 
  signInWithRedirect, 
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "../../firebase";
import { 
  Button, 
  Avatar, 
  Typography, 
  Container, 
  CircularProgress,
  Box,
  Paper,
  Alert,
  Divider
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';

export default function AuthComponent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingAuth, setProcessingAuth] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);

  // Helper function to add debug information
  const addDebug = (message) => {
    console.log(message);
    setDebugInfo(prev => [...prev, { time: new Date().toISOString().substring(11, 19), message }]);
  };

  // Second effect to set up auth state listener
  useEffect(() => {
    if (!auth) {
      addDebug("Cannot set up auth listener - auth not initialized");
      setLoading(false);
      return () => {};
    }

    addDebug("Setting up auth state listener");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        addDebug(`Auth state detected user: ${currentUser.displayName}`);
        setUser(currentUser);
      } else {
        addDebug("Auth state: No user detected");
      }
      setLoading(false);
    });

    return () => {
      addDebug("Cleaning up auth state listener");
      unsubscribe();
    };
  }, []);

  const login = async () => {
    setError(null);
    setProcessingAuth(true);
    
    try {
      addDebug("Starting Google sign-in redirect flow");
      
      if (!auth || !provider) {
        addDebug("Auth or provider not initialized!");
        setError("Firebase Auth is not properly initialized");
        setProcessingAuth(false);
        return;
      }
      
      // Set custom parameters for consistent experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      addDebug("Calling signInWithRedirect...");
      await signInWithRedirect(auth, provider);
      // Code after this won't execute until after redirect back
      addDebug("After redirect call - this should not appear until return");
    } catch (err) {
      addDebug(`Sign-in error: ${err.message}`);
      console.error("Full sign-in error:", err);
      setError(`Sign-in error: ${err.message}`);
      setProcessingAuth(false);
    }
  };

  const logout = async () => {
    try {
      addDebug("Attempting to sign out...");
      
      if (!auth) {
        addDebug("Cannot sign out - auth not initialized");
        setError("Firebase Auth is not properly initialized");
        return;
      }
      
      await signOut(auth);
      addDebug("User signed out successfully");
      setUser(null);
    } catch (err) {
      addDebug(`Sign-out error: ${err.message}`);
      console.error("Full sign-out error:", err);
      setError(`Sign-out error: ${err.message}`);
    }
  };

  // Show loading state while initializing or processing auth
  if (loading || processingAuth) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
        <CircularProgress size={50} />
        <Typography variant="body1" sx={{ mt: 3 }}>
          {processingAuth ? "Processing authentication..." : "Loading..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4, width: '100%', maxWidth: 500 }}>
          {error}
        </Alert>
      )}
      
      {user ? (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Welcome {user.displayName}
          </Typography>
          <Avatar 
            src={user.photoURL} 
            sx={{ width: 100, height: 100, my: 2 }} 
            alt={user.displayName || "User"}
          />
          <Typography variant="h6">{user.displayName}</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{user.email}</Typography>
          
          <Button 
            onClick={logout} 
            variant="contained" 
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Please Sign In
          </Typography>
          <Button 
            onClick={login} 
            variant="contained"
            startIcon={<GoogleIcon />}
            size="large"
            sx={{ mt: 2 }}
            disabled={processingAuth}
          >
            Sign in with Google
          </Button>
        </Paper>
      )}
      
      {/* Debug Panel (can be removed in production) */}
      <Paper elevation={1} sx={{ p: 2, mt: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Auth Debug Info
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {debugInfo.length > 0 ? (
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            {debugInfo.map((item, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                <strong>{item.time}:</strong> {item.message}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No debug information available</Typography>
        )}
      </Paper>
    </Container>
  );
}