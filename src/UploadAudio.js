import React, { useState, useCallback } from "react";
import {
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Fade,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  // Handle drag & drop
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPrediction("");
      setAudioUrl(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/*": [] },
    multiple: false,
  });

  // Upload to backend
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use Hugging Face Space in production, fallback to local FastAPI in dev
      const API_URL =
        process.env.REACT_APP_API_URL ||
        "http://127.0.0.1:8000"; // local dev fallback

      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction || "No prediction returned");
    } catch (err) {
      console.error("Error uploading file:", err);
      setPrediction("Error: could not classify");
    } finally {
      setLoading(false);
    }
  };

  // Clear state
  const handleClear = () => {
    setFile(null);
    setPrediction("");
    setAudioUrl(null);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        borderRadius: 4,
        background: "linear-gradient(180deg, #f3f4fd, #e8eaf6)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Upload an Audio File
      </Typography>

      {/* Drag & Drop Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #5c6bc0",
          borderRadius: 3,
          p: 5,
          mb: 3,
          cursor: "pointer",
          backgroundColor: isDragActive ? "#dbe2ff" : "#f5f6fa",
          transition: "0.3s",
          "&:hover": { backgroundColor: "#dbe2ff" },
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            <AudiotrackIcon color="primary" sx={{ mr: 1 }} />
            {file.name}
          </Typography>
        ) : (
          <Typography color="textSecondary">
            <UploadFileIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Drag & drop or click to select an audio file
          </Typography>
        )}
      </Box>

      {/* Audio Preview */}
      {audioUrl && (
        <Box sx={{ mb: 3 }}>
          <audio controls src={audioUrl} style={{ width: "100%" }} />
        </Box>
      )}

      {/* Upload & Clear Buttons */}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || loading}
          sx={{ px: 4, textTransform: "none", fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Classify"}
        </Button>

        {file && (
          <IconButton
            onClick={handleClear}
            sx={{
              color: "error.main",
              border: "1px solid #ef9a9a",
              "&:hover": { bgcolor: "#ffcdd2" },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>

      {/* Prediction Result */}
      <Fade in={!!prediction}>
        <Box>
          <Divider sx={{ my: 3 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 1, color: "#283593" }}
          >
            Prediction Result
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "1.2rem",
              fontWeight: 500,
              background: "#e8eaf6",
              p: 2,
              borderRadius: 2,
              display: "inline-block",
              color: "#1a237e",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {prediction}
          </Typography>
        </Box>
      </Fade>
    </Paper>
  );
}