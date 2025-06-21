import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../apis/baseApi";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { LoginContext } from "../contexts/LoginContextProvider";
import { useLogin } from "../contexts/LoginContextProvider";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
  const [meetings, setMeetings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const { userInfo, isTokenSet, logout } = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarKey } = useLogin();

  // 현재 URL에서 meetingId 추출
  const currentMeetingId = (() => {
    const match = location.pathname.match(/\/meetings\/(\d+)/);
    return match ? Number(match[1]) : null;
  })();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!isTokenSet || !userInfo) {
        console.log(
          "토큰이 아직 설정되지 않았거나 사용자 정보가 없습니다. 잠시만 기다려주세요..."
        );
        return;
      }

      try {
        const userId = userInfo.id;
        const response = await api.get("/api/meetings/user/" + userId);
        // 응답 데이터가 배열인지 확인하고 설정
        const meetingsData = Array.isArray(response.data) ? response.data : [];
        setMeetings(meetingsData);
      } catch (error) {
        console.error("미팅 목록을 가져오는데 실패했습니다:", error);
        setMeetings([]); // 에러 시 빈 배열로 설정
      }
    };

    fetchMeetings();
  }, [userInfo, isTokenSet, sidebarKey]);

  const handleMoreClick = (event, meetingId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMeetingId(meetingId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMeetingId(null);
  };

  const handleEditTitle = () => {
    const selectedMeeting = meetings.find(
      (meeting) => meeting.id === selectedMeetingId
    );
    if (selectedMeeting) {
      setEditingMeetingId(selectedMeetingId);
      setEditingTitle(selectedMeeting.title);
    }
    handleClose();
  };

  const handleSaveTitle = async () => {
    try {
      await api.patch(`/api/meetings/${editingMeetingId}/title`, editingTitle);

      // 로컬 상태 업데이트
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting.id === editingMeetingId
            ? { ...meeting, title: editingTitle }
            : meeting
        )
      );

      setEditingMeetingId(null);
      setEditingTitle("");
    } catch (error) {
      console.error("미팅 제목 수정에 실패했습니다:", error);
      alert("제목 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditingMeetingId(null);
    setEditingTitle("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSaveTitle();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDeleteMeeting = async () => {
    try {
      await api.delete(`/api/meetings/${selectedMeetingId}`);
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== selectedMeetingId)
      );
      handleClose();
      navigate("/");
    } catch (error) {
      console.error("미팅 삭제에 실패했습니다:", error);
      alert("미팅 삭제에 실패했습니다.");
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        width: "300px",
        height: "100vh",
        overflowY: "auto",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component={Link}
          to="/"
          fontWeight="bold"
          sx={{
            cursor: "pointer",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Talk to Do
        </Typography>
        <Button
          variant="text"
          color="inherit"
          onClick={() => {
            logout();
          }}
          startIcon={<LogoutIcon />}
          sx={{ color: "black" }}
        >
          {/* 로그아웃 텍스트 제거 */}
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Button
          component={Link}
          to="/my-schedule"
          variant="contained"
          startIcon={<EventNoteIcon />}
          sx={{ bgcolor: "#3E1A11", "&:hover": { bgcolor: "#2A120B" } }}
        >
          나의 일정 보기
        </Button>
      </Box>

      <List>
        {Array.isArray(meetings) &&
          meetings.map((meeting) => {
          const isCurrent = currentMeetingId === meeting.id;
            const isEditing = editingMeetingId === meeting.id;

          return (
            <ListItem
              key={meeting.id}
              selected={isCurrent}
              secondaryAction={
                  !isEditing && (
                <IconButton
                  edge="end"
                  onClick={(e) => handleMoreClick(e, meeting.id)}
                >
                  <MoreVertIcon />
                </IconButton>
                  )
              }
                component={!isEditing ? Link : "div"}
                to={!isEditing ? `/meetings/${meeting.id}` : undefined}
              sx={{
                color: isCurrent ? "#3E1A11" : "black",
                fontWeight: isCurrent ? "bold" : "normal",
                backgroundColor: isCurrent ? "#f0e9e2" : "inherit",
                  "&:hover": {
                    color: isEditing ? "inherit" : "black",
                    backgroundColor: isEditing ? "inherit" : "#f0e9e2",
                  },
                textDecoration: "none",
              }}
            >
                {isCurrent && !isEditing && (
                <ArrowRightIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "#3E1A11" }}
                />
              )}

                {isEditing ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <TextField
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyPress={handleKeyPress}
                      size="small"
                      sx={{
                        flexGrow: 1,
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                      autoFocus
                    />
                    <IconButton
                      size="small"
                      onClick={handleSaveTitle}
                      sx={{ ml: 1, color: "green" }}
                    >
                      ✓
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleCancelEdit}
                      sx={{ color: "red" }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                ) : (
              <ListItemText
                primary={meeting.title}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "180px",
                  },
                }}
              />
                )}
            </ListItem>
          );
        })}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEditTitle}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          수정
        </MenuItem>
        <MenuItem onClick={handleDeleteMeeting} sx={{ color: "red" }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "red" }} />
          삭제
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default SideBar;
