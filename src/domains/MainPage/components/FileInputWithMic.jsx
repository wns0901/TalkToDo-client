import React, { useRef } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import { useNavigate } from "react-router-dom";

const FileInputWithMic = ({ fileName, onFileClick, onFileChange }) => {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleInputClick = () => {
    if (onFileClick) onFileClick();
    else fileInputRef.current.click();
  };

  const startRecoding = () => {
    navigate("/recoding");
  };
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        width: "100%",
        maxWidth: "60%",
      }}
    >
      <TextField
        value={fileName}
        placeholder="음성파일을 등록해주세요"
        fullWidth
        InputProps={{ readOnly: true }}
        onClick={handleInputClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <IconButton sx={{ ml: 3, color: "black" }} onClick={startRecoding}>
        <MicIcon />
      </IconButton>
    </Box>
  );
};

export default FileInputWithMic;
