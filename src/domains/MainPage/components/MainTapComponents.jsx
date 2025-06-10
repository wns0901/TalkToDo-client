import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import FileInputWithMic from "./FileInputWithMic";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import api from "../apis/baseApi";

const MainTapComponents = () => {
  const [file, setFile] = useState(null);
  const [meetingDate, setMeetingDate] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
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

  const handleConvert = async () => {
    if (!meetingDate) {
      alert("회의 날짜를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("meetingDate", meetingDate);

    const response = await api.post("/meetings", formData);

    navigate("/meetings/1");
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
      {file && (
        <>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="회의 날짜를 선택해주세요"
              value={meetingDate}
              onChange={(newValue) => setMeetingDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: { mt: 3, mb: 1, background: "#fff", borderRadius: "8px" },
                },
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            sx={{
              mt: 1,
              px: 5,
              py: 1.5,
              fontWeight: 700,
              background: "#3E1A11",
              color: "#fff",
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                background: "#2A120B",
                color: "#fff",
                boxShadow: "none",
              },
            }}
            onClick={handleConvert}
            disabled={!meetingDate}
          >
            변환
          </Button>
        </>
      )}
    </Box>
  );
};

export default MainTapComponents;
