import React, { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// 임시 데이터
const MOCK_TODOS = [
  {
    id: 1,
    text: "프로젝트 기획서 작성",
    startDate: "2024-03-20",
    dueDate: "2024-03-25",
    assignee: "김범수 과장",
    type: "todo",
  },
  {
    id: 2,
    text: "디자인 시안 검토",
    startDate: "2024-03-21",
    dueDate: "2024-03-22",
    assignee: "이지원 대리",
    type: "todo",
  },
  {
    id: 3,
    text: "개발 일정 수립",
    startDate: "2024-03-22",
    dueDate: "2024-03-23",
    assignee: "홍길동 사원",
    type: "todo",
  },
];

const TodoTab = ({ meetingId = 1 }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState(MOCK_TODOS);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 날짜별로 할 일을 그룹화
  const getTodosByDate = () => {
    const grouped = todos.reduce((acc, todo) => {
      if (!acc[todo.dueDate]) {
        acc[todo.dueDate] = [];
      }
      acc[todo.dueDate].push(todo);
      return acc;
    }, {});

    // 날짜 정렬
    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        todos: grouped[date],
      }));
  };

  const groupedTodosByDate = getTodosByDate();

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    showSnackbar("할 일이 삭제되었습니다.");
  };

  const handleAddDateToMySchedule = (date, dateTodos) => {
    showSnackbar(
      `${date} 할 일 ${dateTodos.length}개가 내 할일에 추가되었습니다.`
    );
  };

  const handleUpdateTodo = (id, updated) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updated } : todo))
    );
    showSnackbar("수정되었습니다.");
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
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
      const dayOfWeek = daysOfWeek[date.getDay()];
      return `${year}.${month}.${day} (${dayOfWeek})`;
    } catch {
      return dateString;
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
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#3E1A11" }}
        >
          ToDo
        </Typography>
        <Box sx={{ p: 0, bgcolor: "grey.50", borderRadius: 1 }}>
          {groupedTodosByDate.length === 0 ? (
            <Typography
              sx={{ textAlign: "center", color: "text.secondary", py: 4 }}
            >
              ToDo 항목이 없습니다. 새로운 항목을 추가해 보세요.
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
                    onDelete={handleDeleteTodo}
                    onUpdate={handleUpdateTodo}
                    formatDate={formatDate}
                  />
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

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

const TodoItem = ({ todo, onDelete, onUpdate, formatDate }) => {
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
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 48, fontWeight: 700 }}
      >
        할 일{todo.num}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          flex: 2,
          fontWeight: 600,
          wordBreak: "break-all",
        }}
      >
        {todo.text}
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
            시작일
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "grey.700", fontWeight: 700 }}
          >
            {formatDate(todo.startDate)}
          </Typography>
        </Box>
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
          {todo.assignee || "-"}
        </Typography>
      </Box>
      <Box>
        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              onUpdate(todo.id, todo);
              handleMenuClose();
            }}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            <span>수정</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(todo.id);
              handleMenuClose();
            }}
            sx={{
              color: "error.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DeleteIcon fontSize="small" sx={{ color: "error.main", mr: 1 }} />
            <span>삭제</span>
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
