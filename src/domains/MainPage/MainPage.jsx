import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FileInputWithMic from "./components/FileInputWithMic";

const MainPage = () => {
  const [fileName, setFileName] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handleWindowDrop = (event) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const fileList = event.dataTransfer.files;
        const syntheticEvent = { target: { files: fileList } };
        handleFileChange(syntheticEvent);
      }
    };
    
    const preventDefault = (event) => event.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ mb: 10 }}>
        음성을 등록해주세요
      </Typography>
      <FileInputWithMic fileName={fileName} onFileChange={handleFileChange} />
      {audioUrl && (
        <Box sx={{ mt: 4, width: "100%", maxWidth: 600 }}>
          <audio src={audioUrl} controls style={{ width: "100%" }} />
        </Box>
      )}
    </Box>
  );
};

export default MainPage;
