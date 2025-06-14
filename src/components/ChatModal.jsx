import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { LoginContext } from "../contexts/LoginContextProvider";
import api from "../apis/baseApi";

const ChatModal = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useContext(LoginContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/api/chats");
        const chatList = response.data;
        setMessages(chatList);
      } catch (error) {
        console.error("메시지 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      // 사용자 메시지 추가
      const newMessage = {
        message,
        userId: userInfo.id,
        isAi: false,
        createdAt: new Date(),
      };

      setMessages([...messages, newMessage]);
      setMessage("");

      const response = await api.post("/api/chats", newMessage);
      const chat = response.data;
      setMessages((prev) => [...prev, chat]);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          height: "70%",
          maxHeight: "700px",
          width: "30%",
          position: "fixed",
          bottom: "100px",
          right: "40px",
          margin: 0,
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "transparent",
        },
      }}
      hideBackdrop
    >
      <DialogTitle
        sx={{
          bgcolor: "#3E1A11",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Typography variant="h6">채팅</Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            bgcolor: "#f5f5f5",
            position: "relative",
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "rgba(255, 255, 255, 0.7)",
                zIndex: 1,
              }}
            >
              <CircularProgress sx={{ color: "#3E1A11" }} />
            </Box>
          )}
          <List>
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <ListItem
                  sx={{
                    justifyContent: msg.isAi ? "flex-start" : "flex-end",
                    mb: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      bgcolor: msg.isAi ? "white" : "#3E1A11",
                      color: msg.isAi ? "inherit" : "white",
                      borderRadius: 2,
                    }}
                  >
                    <ListItemText
                      primary={msg.message}
                      secondary={new Date(msg.createdAt).toLocaleTimeString()}
                      secondaryTypographyProps={{
                        color: msg.isAi
                          ? "text.secondary"
                          : "rgba(255,255,255,0.7)",
                      }}
                    />
                  </Paper>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: "white",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: 1,
            borderRadius: "0 0 12px 12px",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={isLoading}
            sx={{
              bgcolor: "#3E1A11",
              "&:hover": {
                bgcolor: "#2A120B",
              },
              minWidth: "48px",
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              <SendIcon />
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
