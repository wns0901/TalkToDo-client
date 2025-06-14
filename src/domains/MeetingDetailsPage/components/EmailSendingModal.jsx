import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useContext, useState } from "react";
import api from "../../../apis/baseApi";
import { LoginContext } from "../../../contexts/LoginContextProvider";
import SetToListModal from "./SetToListModal";
import { useParams } from "react-router-dom";

const EmailForm = ({ onClose }) => {
  const [subject, setSubject] = useState("");
  const [toList, setToList] = useState([]);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { userInfo } = useContext(LoginContext);
  const { meetingId } = useParams();

  const handleSend = async () => {
    if (!subject || !text || toList.length === 0) {
      setSnackbar({
        open: true,
        message: "제목, 내용, 받는 사람을 모두 입력해주세요.",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const userEmail = userInfo.email;
      const body = {
        toList: toList.map((p) => p.email),
        subject,
        text,
        from: userEmail,
        meetingId,
      };
      const res = await api.post("api/emails/send", body);
      setSnackbar({
        open: true,
        message: "이메일이 전송되었습니다.",
        severity: "success",
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("이메일 전송 중 오류 발생:", error);
      setSnackbar({
        open: true,
        message: "이메일 전송에 실패했습니다.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        value={text}
        onChange={(e) => setText(e.target.value)}
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
          disabled={isLoading}
          sx={{ minWidth: 80, position: "relative" }}
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
              <span style={{ visibility: "hidden" }}>전송</span>
            </>
          ) : (
            "전송"
          )}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const EmailSendingModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>메일로 발송</DialogTitle>
      <EmailForm onClose={onClose} />
    </Dialog>
  );
};

export default EmailSendingModal;
