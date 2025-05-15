import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SetToListModal from "./SetToListModal";

const EmailForm = () => {
  const [subject, setSubject] = useState("");
  const [toList, setToList] = useState([]);
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    alert("이메일이 전송되었습니다!");
    // 실제 전송 로직은 여기에 추가
  };

  return (
    <Box
      sx={{
        width: 600,
        bgcolor: "#fff",
        p: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        placeholder="제목"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        fullWidth
        size="small"
        sx={{ bgcolor: "#fff" }}
      />
      <TextField
        placeholder="받는 사람"
        value={toList.map((p) => p.name).join(", ")}
        fullWidth
        size="small"
        sx={{ bgcolor: "#fff" }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setOpen(true)}>
                <PersonAddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        minRows={5}
        sx={{ bgcolor: "#fff" }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          sx={{ minWidth: 80 }}
        >
          전송
        </Button>
      </Box>
      {/* 받는 사람 선택 모달 */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <SetToListModal
          setToList={(list) => {
            setToList(list);
            setOpen(false);
          }}
        />
      </Dialog>
    </Box>
  );
};

const EmailSendingModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>메일로 발송</DialogTitle>
      <EmailForm />
    </Dialog>
  );
};

export default EmailSendingModal;
