import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import FileInputWithMic from "./components/FileInputWithMic";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFileName(file.name);
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

  const handleConvert = () => {
    alert("변환 성공");
    navigate("/meeting-details");
  };

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
      {fileName && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, px: 5, py: 1.5, fontWeight: 700 }}
          onClick={handleConvert}
        >
          변환
        </Button>
      )}
    </Box>
  );
};

export default MainPage;
