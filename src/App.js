import './App.css';
import React from "react";
import { AppBar, Toolbar, Typography, Container, CssBaseline } from "@mui/material";
import UploadAudio from "./UploadAudio";

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #1a237e, #3949ab, #5c6bc0)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            🎵 ResNet18 Audio Classifier
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <UploadAudio />
      </Container>
    </>
  );
}

export default App;