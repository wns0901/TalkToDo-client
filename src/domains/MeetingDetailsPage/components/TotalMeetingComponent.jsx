import React, { useEffect, useState, useRef } from "react";
import fakeApi from "../apis/fakeApi.js";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../../apis/baseApi.js";
import { useLocation } from "react-router-dom";

// 초를 mm:ss 형태로 변환하는 함수
function formatTime(seconds) {
  const sec = Math.floor(seconds);
  const min = Math.floor(sec / 60);
  const remainSec = sec % 60;
  return `${min.toString().padStart(2, "0")}:${remainSec
    .toString()
    .padStart(2, "0")}`;
}

const TotalMeetingComponent = () => {
  const location = useLocation();
  const meetingId = location.pathname.split("/").pop();

  const [transcript, setTranscript] = useState([]);
  const [audioFile, setAudioFile] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const audioRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const fetchData = await api.get(`/api/transcript-lines/${meetingId}`);
        const audioData = await api.get(`/api/meetings/${meetingId}/audio`);
        setTranscript(fetchData.data);
        setAudioFile(audioData.data);
      } catch (error) {
        console.error("트랜스크립트를 가져오는데 실패했습니다:", error);
      }
    })();
  }, [meetingId]);

  // 초 클릭 시 오디오 재생바 위치 이동
  const handleTimeClick = (seconds) => {
    if (audioRef.current) {
      if (audioRef.current.readyState > 0) {
        console.log(seconds);

        audioRef.current.currentTime = seconds;
        audioRef.current.play();
      } else {
        audioRef.current.addEventListener(
          "canplay",
          () => {
            audioRef.current.currentTime = seconds;
            audioRef.current.play();
          },
          { once: true }
        );
      }
    }
  };

  // 텍스트 수정 핸들러
  const handleTextChange = (e, index) => {
    const newTranscript = [...transcript];
    newTranscript[index] = { ...newTranscript[index], text: e.target.value };
    setTranscript(newTranscript);
    setIsEdited(true);
  };

  // 수정 버튼 클릭 시 동작
  const handleEditClick = async () => {
    const result = await api.put("/api/transcript-lines", {
      transcriptLineList: transcript,
    });
    if (result) {
      setIsEdited(false);
      setSnackbar({
        open: true,
        message: "수정 내용을 저장합니다.",
        severity: "success",
      });
    } else {
      setSnackbar({ open: true, message: "수정 실패", severity: "error" });
    }
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4 }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* 오디오 재생바 */}
        {audioFile && (
          <audio
            ref={audioRef}
            src={audioFile}
            controls
            preload="metadata"
            style={{
              width: "80%",
              margin: "16px auto",
              display: "block",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          width: "80%",
          maxWidth: 800,
          margin: "32px auto 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {transcript.map((item, index) => (
          <Paper
            key={index}
            sx={{
              p: 0.5,
              mb: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              boxShadow: "none",
              border: "none",
              backgroundColor: "#fff",
            }}
            elevation={0}
          >
            <Typography
              variant="body2"
              sx={{ color: "primary.main", cursor: "pointer", minWidth: 60 }}
              onClick={() => handleTimeClick(item.startTime)}
            >
              {formatTime(item.startTime)}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, mr: 1, minWidth: 50 }}
            >
              화자1:
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              value={item.text}
              sx={{ flex: 1, bgcolor: "white" }}
              onChange={(e) => handleTextChange(e, index)}
              multiline
              minRows={1}
              maxRows={6}
            />
          </Paper>
        ))}
      </Box>

      {isEdited && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 9999,
            borderRadius: 1,
            px: 3,
            py: 1.2,
            fontWeight: 700,
            bgcolor: "#3E1A11",
            "&:hover": { bgcolor: "#5E2A21" },
          }}
          onClick={handleEditClick}
        >
          수정
        </Button>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TotalMeetingComponent;
