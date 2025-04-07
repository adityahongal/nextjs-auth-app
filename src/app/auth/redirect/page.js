// src/app/auth/redirect/page.js
"use client";

import { useEffect, useState } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../../../../firebase';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const handleRedirect = async () => {
        try {
          const result = await getRedirectResult(auth);
          if (result && result.user) {
            console.log("Redirect login successful:", result.user);
          } else {
            console.log("Redirect result has no user.");
          }
          router.push('/');
        } catch (error) {
          console.error("Redirect error:", error);
          setError(error.message);
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }
      };
      

    handleRedirect();
  }, [router]);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Authentication Error: {error}
        </Alert>
      ) : (
        <>
          <CircularProgress size={60} sx={{ mb: 4 }} />
          <Typography variant="h6">
            Processing your sign-in...
          </Typography>
        </>
      )}
    </Box>
  );
}