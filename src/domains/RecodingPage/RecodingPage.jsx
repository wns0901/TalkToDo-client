import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, Stack, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../../apis/baseApi";
import { useLogin } from "../../contexts/LoginContextProvider";
import { Mp3LameEncoder } from "lamejs";
import RecordRTC from "recordrtc";

const Recoder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useRecordRTC, setUseRecordRTC] = useState(false); // RecordRTC 사용 여부
  const mediaRecorderRef = useRef(null);
  const recordRTCRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null); // 스트림 참조 추가
  const navigate = useNavigate();
  const { refreshSidebar } = useLogin();

  // 지원되는 MIME 타입 확인
  const getSupportedMimeType = () => {
    const types = [
      "audio/mp3",
      "audio/mpeg",
      "audio/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/wav",
    ];

    console.log("=== 지원되는 MIME 타입 확인 ===");
    for (const type of types) {
      const isSupported = MediaRecorder.isTypeSupported(type);
      console.log(`${type}: ${isSupported ? "지원됨" : "지원안됨"}`);
      if (isSupported) {
        return type;
      }
    }
    console.log("기본값 audio/webm 사용");
    return "audio/webm"; // 기본값
  };

  // WebM을 MP3로 변환하는 함수
  const convertToMp3 = async (audioBlob) => {
    try {
      // AudioContext를 사용하여 오디오 변환
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // 오디오 데이터 추출
      const leftChannel = audioBuffer.getChannelData(0);
      const rightChannel =
        audioBuffer.numberOfChannels > 1
          ? audioBuffer.getChannelData(1)
          : leftChannel;

      // 16비트 PCM으로 변환
      const leftData = new Int16Array(leftChannel.length);
      const rightData = new Int16Array(rightChannel.length);

      for (let i = 0; i < leftChannel.length; i++) {
        leftData[i] = Math.max(-32768, Math.min(32767, leftChannel[i] * 32768));
        rightData[i] = Math.max(
          -32768,
          Math.min(32767, rightChannel[i] * 32768)
        );
      }

      // MP3 인코더 생성 (128kbps, 44.1kHz, 스테레오)
      const mp3Encoder = new Mp3LameEncoder({
        sampleRate: audioBuffer.sampleRate,
        channels: audioBuffer.numberOfChannels,
        kbps: 128,
      });

      // MP3로 인코딩
      const mp3Data = mp3Encoder.encode([leftData, rightData]);
      const mp3Blob = new Blob([mp3Data], { type: "audio/mp3" });

      return mp3Blob;
    } catch (error) {
      console.error("MP3 변환 실패:", error);
      // 변환 실패 시 원본 반환
      return audioBlob;
    }
  };

  // RecordRTC로 MP3 직접 녹음
  const startRecordRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream; // 스트림 저장

      const recordRTC = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/mp3",
        sampleRate: 44100,
        desiredSampRate: 44100,
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 2,
        timeSlice: 1000,
        ondataavailable: (blob) => {
          console.log("RecordRTC 데이터 수신:", blob);
        },
      });

      recordRTCRef.current = recordRTC;
      recordRTC.startRecording();
      setIsRecording(true);
      setIsPaused(false);
      setUseRecordRTC(true);
      console.log("RecordRTC MP3 녹음 시작");
    } catch (error) {
      console.error("RecordRTC 녹음 시작 실패:", error);
      // RecordRTC 실패 시 MediaRecorder로 폴백
      setUseRecordRTC(false);
      startMediaRecorder();
    }
  };

  // MediaRecorder로 녹음 (기존 방식)
  const startMediaRecorder = async () => {
    if (navigator.mediaDevices) {
      console.log("MediaRecorder 녹음 시작");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 2,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream; // 스트림 저장

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new window.MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000, // 128kbps
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setUseRecordRTC(false);
    }
  };

  // 스트림 정리 함수
  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      console.log("마이크 스트림 정리 완료");
    }
  };

  // 컴포넌트 언마운트 시 스트림 정리
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // 녹음 시작/정지 토글
  const handleMicClick = async () => {
    if (!isRecording) {
      // RecordRTC로 MP3 직접 녹음 시도
      await startRecordRTC();
    } else {
      // 녹음 정지
      if (useRecordRTC && recordRTCRef.current) {
        recordRTCRef.current.stopRecording(() => {
          const blob = recordRTCRef.current.getBlob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          console.log("RecordRTC 녹음 완료:", blob);
        });
      } else if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
      stopStream(); // 스트림 정리
    }
  };

  // 정지 버튼
  const handleStop = () => {
    if (useRecordRTC && recordRTCRef.current) {
      recordRTCRef.current.stopRecording(() => {
        const blob = recordRTCRef.current.getBlob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        console.log("RecordRTC 녹음 완료:", blob);
      });
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    stopStream(); // 스트림 정리
  };

  // 일시정지/재개 버튼
  const handlePause = () => {
    if (useRecordRTC && recordRTCRef.current) {
      if (!isPaused) {
        recordRTCRef.current.pauseRecording();
        setIsPaused(true);
      } else {
        recordRTCRef.current.resumeRecording();
        setIsPaused(false);
      }
    } else if (mediaRecorderRef.current) {
      if (!isPaused) {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      } else {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      }
    }
  };

  // 변환 버튼 클릭 핸들러
  const handleConvert = async () => {
    if (!audioUrl) {
      alert("녹음된 오디오가 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      // 현재 날짜를 yyyy-MM-dd 형식으로 설정
      const currentDate = format(new Date(), "yyyy-MM-dd");

      let audioFile;

      if (useRecordRTC && recordRTCRef.current) {
        // RecordRTC로 녹음된 경우 (이미 MP3)
        const mp3Blob = recordRTCRef.current.getBlob();
        audioFile = new File([mp3Blob], "recording.mp3", {
          type: "audio/mp3",
        });
        console.log("RecordRTC MP3 파일:", audioFile);
      } else {
        // MediaRecorder로 녹음된 경우 (변환 필요)
        const originalBlob = new Blob(audioChunksRef.current, {
          type: getSupportedMimeType(),
        });

        // MP3로 변환 시도
        const mp3Blob = await convertToMp3(originalBlob);

        // 파일 확장자 결정
        const fileExtension = mp3Blob.type.includes("mp3") ? "mp3" : "webm";
        const fileName = `recording.${fileExtension}`;

        audioFile = new File([mp3Blob], fileName, {
          type: mp3Blob.type,
        });
        console.log("MediaRecorder 변환 파일:", audioFile);
      }

      const formData = new FormData();
      formData.append("audioFile", audioFile);
      formData.append("date", currentDate);

      console.log("전송할 파일 정보:", {
        fileName: audioFile.name,
        fileType: audioFile.type,
        fileSize: audioFile.size,
        date: currentDate,
        recordingMethod: useRecordRTC ? "RecordRTC" : "MediaRecorder",
      });

      const response = await api.post("/api/meetings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const meetingId = response.data.id;
        refreshSidebar();
        navigate("/meetings/" + meetingId);
      } else {
        alert("회의 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("회의 등록 중 오류 발생:", error);
      alert("회의 등록에 실패했습니다.");
    } finally {
      setIsLoading(false);
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
        <>
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
          {/* 변환 버튼 추가 */}
          <Box sx={{ mt: 4 }}>
            <button
              style={{
                padding: "12px 32px",
                fontSize: "1.2rem",
                fontWeight: "bold",
                background: "#3E1A11",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.7 : 1,
                position: "relative",
                minWidth: "120px",
                minHeight: "48px",
              }}
              onClick={handleConvert}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#fff",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                  <span style={{ visibility: "hidden" }}>변환</span>
                </>
              ) : (
                "변환"
              )}
            </button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Recoder;
