import React, { useRef, useState } from "react";
import { Box, IconButton, Stack } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Recoder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 녹음 시작/정지 토글
  const handleMicClick = async () => {
    if (!isRecording) {
      // 녹음 시작
      if (navigator.mediaDevices) {
        console.log("녹음 시작");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new window.MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        };
        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);
      }
    } else {
      // 녹음 정지
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  // 정지 버튼
  const handleStop = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setIsPaused(false);
  };

  // 일시정지/재개 버튼
  const handlePause = () => {
    if (!mediaRecorderRef.current) return;
    if (!isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 12,
        minHeight: "80vh",
      }}
    >
      {/* 마이크 원형 버튼 */}
      <IconButton
        onClick={handleMicClick}
        sx={{
          width: 120,
          height: 120,
          background: "#ddd",
          mb: 6,
          "&:hover": { background: "#ccc" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MicIcon sx={{ fontSize: 64 }} />
      </IconButton>

      {/* 하단 컨트롤 버튼 */}
      <Stack
        direction="row"
        spacing={8}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <IconButton
          onClick={handleStop}
          disabled={!isRecording}
          sx={{ width: 72, height: 72 }}
        >
          <StopIcon sx={{ fontSize: 48 }} />
        </IconButton>
        <IconButton
          onClick={handlePause}
          disabled={!isRecording}
          sx={{ width: 72, height: 72 }}
        >
          {isPaused ? (
            <PlayArrowIcon sx={{ fontSize: 48 }} />
          ) : (
            <PauseIcon sx={{ fontSize: 48 }} />
          )}
        </IconButton>
      </Stack>

      {/* 녹음이 끝나면 오디오 재생바 */}
      {audioUrl && (
        <Box
          sx={{
            mt: 5,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <audio src={audioUrl} controls style={{ width: 400 }} />
        </Box>
      )}
    </Box>
  );
};

export default Recoder;
