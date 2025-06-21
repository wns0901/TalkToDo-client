import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../apis/baseApi";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// 수정 모달 컴포넌트
const ScheduleEditModal = ({ open, schedule, onClose, onSave }) => {
  const [editedSchedule, setEditedSchedule] = useState(schedule);

  useEffect(() => {
    setEditedSchedule(schedule);
  }, [schedule]);

  const handleChange = (field) => (event) => {
    setEditedSchedule((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (field) => (newValue) => {
    setEditedSchedule((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleSave = () => {
    onSave(editedSchedule);
    onClose();
  };

  useEffect(() => {
    console.log("editedSchedule:", editedSchedule);
  }, [editedSchedule]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>일정 수정</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="제목"
            value={editedSchedule?.title || ""}
            onChange={handleChange("title")}
            fullWidth
          />
          <TextField
            label="설명"
            value={editedSchedule?.description || ""}
            onChange={handleChange("description")}
            fullWidth
            multiline
            rows={3}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="시작일"
              value={
                editedSchedule?.startDate
                  ? new Date(editedSchedule.startDate)
                  : null
              }
              onChange={handleDateChange("startDate")}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <DateTimePicker
              label="종료일"
              value={
                editedSchedule?.endDate
                  ? new Date(editedSchedule.endDate)
                  : null
              }
              onChange={handleDateChange("endDate")}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
          <TextField
            label="장소"
            value={editedSchedule?.location || ""}
            onChange={handleChange("location")}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>범위</InputLabel>
            <Select
              value={editedSchedule?.scope || ""}
              onChange={handleChange("scope")}
              label="범위"
            >
              <MenuItem value="PERSONAL">개인</MenuItem>
              <MenuItem value="TEAM">팀</MenuItem>
              <MenuItem value="COMPANY">회사</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ScheduleTab = () => {
  const { meetingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 일정 데이터 로드
  useEffect(() => {
    if (meetingId) {
      fetchSchedules();
    }
  }, [meetingId]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/schedules/meeting/${meetingId}`);

      console.log("response:", response.data);

      // response.data가 배열이 아닌 경우 배열로 변환
      const schedulesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setSchedules(schedulesData);
      setError(null);
    } catch (err) {
      setError(err.message || "일정을 불러오는데 실패했습니다.");
      showSnackbar("일정을 불러오는데 실패했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 날짜별로 일정을 그룹화
  const getSchedulesByDate = () => {
    const grouped = schedules.reduce((acc, schedule) => {
      const date = schedule.startDate
        ? schedule.startDate.split("T")[0]
        : "no-date";
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(schedule);
      return acc;
    }, {});

    // 날짜 정렬 (no-date는 맨 앞으로)
    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === "no-date") return -1;
        if (b === "no-date") return 1;
        return a.localeCompare(b);
      })
      .map((date) => ({
        date,
        schedules: grouped[date],
      }));
  };

  const groupedSchedulesByDate = getSchedulesByDate();

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const handleUpdateSchedule = async (updatedSchedule) => {
    try {
      console.log("updatedSchedule:", updatedSchedule);

      const response = await api.patch(
        `/api/schedules/${updatedSchedule.id}`,
        updatedSchedule
      );

      console.log("response:", response.data);
      setSchedules(() =>
        schedules.map((schedule) =>
          schedule.id === updatedSchedule.id ? response.data : schedule
        )
      );
      showSnackbar("수정되었습니다.");
    } catch (err) {
      console.error("스케줄 수정 에러:", err);
      showSnackbar("수정에 실패했습니다.", "error");
    }
  };

  const handleAddToMySchedule = async (schedule) => {
    try {
      const response = await api.patch(`/api/schedules/my/${schedule.id}`);
      if (response.status === 200) {
        showSnackbar("나의 일정에 추가되었습니다.");
      }
    } catch (err) {
      showSnackbar("나의 일정 추가에 실패했습니다.", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const date = new Date(dateTimeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
      const dayOfWeek = daysOfWeek[date.getDay()];
      return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
    } catch {
      return dateTimeString;
    }
  };

  const getScopeColor = (scope) => {
    const colors = {
      PERSONAL: "#FF5733",
      TEAM: "#33FF57",
      COMPANY: "#3357FF",
    };
    return colors[scope] || "#666666";
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box sx={{ p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" component="h2" fontWeight="bold">
        일정
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Box sx={{ p: 0, bgcolor: "grey.50", borderRadius: 1 }}>
          {groupedSchedulesByDate.length === 0 ? (
            <Typography
              sx={{ textAlign: "center", color: "text.secondary", py: 4 }}
            >
              일정 항목이 없습니다.
            </Typography>
          ) : (
            groupedSchedulesByDate.map(({ date, schedules }) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
                  {date === "no-date" ? "날짜 없음" : formatDateTime(date)}
                </Typography>
                {schedules.map((schedule) => (
                  <ScheduleItem
                    key={schedule.id}
                    schedule={schedule}
                    onEdit={handleEditClick}
                    onAddToMySchedule={handleAddToMySchedule}
                    formatDateTime={formatDateTime}
                    getScopeColor={getScopeColor}
                  />
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

      <ScheduleEditModal
        open={editModalOpen}
        schedule={selectedSchedule}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateSchedule}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const ScheduleItem = ({
  schedule,
  onEdit,
  onAddToMySchedule,
  formatDateTime,
  getScopeColor,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px 0 rgba(60,60,60,0.06)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "#fff",
      }}
    >
      <Box sx={{ flex: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            wordBreak: "break-all",
            mb: 1,
          }}
        >
          {schedule.title}
        </Typography>
        {schedule.description && (
          <Typography variant="body2" color="text.secondary">
            {schedule.description}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            시작일
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "grey.700", fontWeight: 700 }}
          >
            {formatDateTime(schedule.startDate)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            종료일
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "grey.700", fontWeight: 700 }}
          >
            {formatDateTime(schedule.endDate)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            장소
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "grey.700", fontWeight: 700 }}
          >
            {schedule.location || "-"}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={schedule.scope}
          size="small"
          sx={{
            bgcolor: getScopeColor(schedule.scope),
            color: "white",
            fontWeight: 600,
          }}
        />
        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onEdit(schedule);
              handleMenuClose();
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            <span>수정</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onAddToMySchedule(schedule);
              handleMenuClose();
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} />
            <span>나의 일정에 담기</span>
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

const LoadingView = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      p: 3,
    }}
  >
    <CircularProgress />
  </Box>
);

const ErrorView = ({ error }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">{error}</Alert>
  </Box>
);

export default ScheduleTab;
