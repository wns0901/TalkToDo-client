import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddTaskIcon from "@mui/icons-material/AddTask";
import api from "../../../apis/baseApi";
import { useParams } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import koLocale from "date-fns/locale/ko";

const TodoTab = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const { meetingId } = useParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // 날짜 유효성 검사 함수
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  // API로 할 일 목록 가져오기
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/todos/meeting/${meetingId}`);
      console.log("response:", response.data);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError("할 일 목록을 불러오는데 실패했습니다.");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 할 일 목록 가져오기
  useEffect(() => {
    console.log("meetingId:", meetingId);
    if (meetingId) {
      fetchTodos();
    }
  }, [meetingId]);

  // 날짜별로 할 일을 그룹화
  const getTodosByDate = () => {
    const grouped = todos.reduce((acc, todo) => {
      // 날짜가 없거나 잘못된 형식인 경우 "날짜 미정"으로 처리
      const date =
        todo.dueDate && isValidDate(todo.dueDate) ? todo.dueDate : "날짜 미정";
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {});

    // 날짜 정렬 (날짜 미정은 맨 뒤로)
    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === "날짜 미정") return 1;
        if (b === "날짜 미정") return -1;
        return a.localeCompare(b);
      })
      .map((date) => ({
        date,
        todos: grouped[date],
      }));
  };

  const groupedTodosByDate = getTodosByDate();

  const handleUpdateTodo = async (id, updated) => {
    try {
      await api.put(`/api/todos/${id}`, updated);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo))
      );
      showSnackbar("수정되었습니다.");
      setEditModalOpen(false);
    } catch (err) {
      showSnackbar("수정에 실패했습니다.", "error");
      console.error("Error updating todo:", err);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleEditSubmit = () => {
    if (editingTodo) {
      handleUpdateTodo(editingTodo.id, editingTodo);
    }
  };

  const handleAddToMyTodo = async (todo) => {
    try {
      console.log(todo);

      await api.patch(`/api/todos/${todo.id}/add-to-calendar`);
      showSnackbar("나의 할 일에 추가되었습니다.");
    } catch (err) {
      showSnackbar("나의 할 일 추가에 실패했습니다.", "error");
      console.error("Error adding todo to my list:", err);
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

  const formatDate = (dateString) => {
    if (!dateString || !isValidDate(dateString)) return "날짜 미정";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
      const dayOfWeek = daysOfWeek[date.getDay()];
      return `${year}.${month}.${day} (${dayOfWeek})`;
    } catch {
      return "날짜 미정";
    }
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
        ToDo
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Box sx={{ p: 0, bgcolor: "grey.50", borderRadius: 1 }}>
          {groupedTodosByDate.length === 0 ? (
            <Typography
              sx={{ textAlign: "center", color: "text.secondary", py: 4 }}
            >
              ToDo 항목이 없습니다.
            </Typography>
          ) : (
            groupedTodosByDate.map(({ date, todos }) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
                  {formatDate(date)}
                </Typography>
                {todos.map((todo, index) => (
                  <TodoItem
                    key={todo.id}
                    todo={{ ...todo, num: index + 1 }}
                    formatDate={formatDate}
                    handleAddToMyTodo={handleAddToMyTodo}
                    handleEditClick={handleEditClick}
                  />
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Dialog
        open={editModalOpen}
        onClose={handleEditModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>할 일 수정</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="제목"
              fullWidth
              value={editingTodo?.title || ""}
              onChange={(e) =>
                setEditingTodo((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={koLocale}
            >
              <DatePicker
                label="마감일"
                value={
                  editingTodo?.dueDate ? new Date(editingTodo.dueDate) : null
                }
                onChange={(newValue) => {
                  setEditingTodo((prev) => ({
                    ...prev,
                    dueDate: newValue
                      ? newValue.toISOString().split("T")[0]
                      : null,
                  }));
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>취소</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

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

const TodoItem = ({ todo, handleEditClick, formatDate, handleAddToMyTodo }) => {
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
      <Typography
        variant="body1"
        sx={{
          flex: 2,
          fontWeight: 600,
          wordBreak: "break-all",
        }}
      >
        {todo.title}
      </Typography>
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
            마감일
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "grey.700", fontWeight: 700 }}
          >
            {formatDate(todo.dueDate)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 120,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          담당자
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "grey.700", fontWeight: 700 }}
        >
          {todo.assigneeName || "-"}
        </Typography>
      </Box>
      <Box>
        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleEditClick(todo);
              handleMenuClose();
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            <span>수정</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleAddToMyTodo(todo);
              handleMenuClose();
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AddTaskIcon fontSize="small" sx={{ mr: 1 }} />
            <span>나의 todo에 담기</span>
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

export default TodoTab;
