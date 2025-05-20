import React, { useEffect, useState, useRef } from "react";
import fakeApi from "../apis/fakeApi.js";
import { Box, Typography, TextField, Paper, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

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
  const [transcript, setTranscript] = useState([]);
  const [audioFile, setAudioFile] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    (async () => {
      const fetchData = await fakeApi.getTranscript();
      setTranscript(fetchData);
      const audioPath = await fakeApi.getAudioFile();
      setAudioFile(audioPath);
    })();
  }, []);

  // 초 클릭 시 오디오 재생바 위치 이동
  const handleTimeClick = (seconds) => {
    if (audioRef.current) {
      if (audioRef.current.readyState > 0) {
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
    const result = await fakeApi.updateTranscript(transcript);
    if (result) {
      setIsEdited(false);
      alert("수정 내용을 저장합니다.");
    } else {
      alert("수정 실패");
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
            style={{ width: "50%", margin: "16px auto", display: "block" }}
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
              onClick={() => handleTimeClick(item.start)}
            >
              {formatTime(item.start)}
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
          }}
          onClick={handleEditClick}
        >
          수정
        </Button>
      )}
    </Box>
  );
};

export default TotalMeetingComponent;
