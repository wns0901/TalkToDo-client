import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Chip,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip,
  Menu,
  ListItemButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { getMeetingDetails, deleteTodo } from "../../../apis/fakeApi";

/**
 * 할 일 항목 컴포넌트
 */
const TodoItem = ({
  num,
  text,
  assignee,
  startDate,
  dueDate,
  onEdit,
  onDelete,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
      <Box sx={{ width: "40px", mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          투두{num}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderBottom: "1px solid #ccc",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField
            variant="standard"
            value={text}
            fullWidth
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
            sx={{ mr: 2 }}
          />
          <AssigneeInfo assignee={assignee} onEdit={onEdit} />
          <TodoActions onEdit={onEdit} onDelete={onDelete} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, ml: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", mr: 1 }}
            >
              시작일:
            </Typography>
            <Typography variant="body2">{formatDate(startDate)}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", mr: 1 }}
            >
              마감일:
            </Typography>
            <Typography variant="body2">{formatDate(dueDate)}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * 담당자 정보 컴포넌트
 */
const AssigneeInfo = ({ assignee, onEdit }) => (
  <Box sx={{ minWidth: 120, display: "flex", alignItems: "center" }}>
    {assignee ? (
      <Typography variant="body2">{assignee}</Typography>
    ) : (
      <Button
        startIcon={<PersonAddAltIcon />}
        size="small"
        sx={{ color: "#666" }}
        onClick={onEdit}
      >
        담당자 지정
      </Button>
    )}
  </Box>
);

/**
 * 할 일 액션 버튼 컴포넌트
 */
const TodoActions = ({ onEdit, onDelete }) => (
  <>
    <IconButton size="small" onClick={onEdit} sx={{ ml: 1 }}>
      <EditIcon fontSize="small" />
    </IconButton>
    <IconButton size="small" onClick={onDelete} sx={{ ml: 0.5 }}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </>
);

/**
 * 날짜 포맷 유틸리티 함수
 */
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    // 요일 구하기
    const daysOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${year}.${month}.${day} ${dayOfWeek}`;
  } catch {
    return dateString;
  }
};

/**
 * 날짜별 할 일 섹션 컴포넌트
 */
const DateSection = ({
  date,
  todos,
  onEditTodo,
  onDeleteTodo,
  onAddDateToMySchedule,
  isTodoSection,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddToSchedule = (date, type) => {
    onAddDateToMySchedule(date, todos, type);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleToggleExpand}
      sx={{
        mb: 1,
        boxShadow: "none",
        "&:before": {
          display: "none",
        },
        "& .MuiAccordionSummary-root": {
          minHeight: "auto",
          padding: "0",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small" component="span">
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{ px: 1, borderBottom: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <DateSectionHeader
          date={date}
          onAddToSchedule={handleAddToSchedule}
          isTodoSection={isTodoSection}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              num={index + 1}
              text={todo.text}
              assignee={todo.assignee}
              startDate={todo.startDate || todo.dueDate}
              dueDate={todo.dueDate}
              onEdit={() => onEditTodo(todo)}
              onDelete={() => onDeleteTodo(todo.id)}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

/**
 * 날짜 섹션 헤더 컴포넌트
 */
const DateSectionHeader = ({ date, onAddToSchedule, isTodoSection }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
  };

  const handleScheduleAdd = (type) => (event) => {
    event.stopPropagation();
    onAddToSchedule(date, type);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography variant="h6">
        {isTodoSection ? "할 일" : "업무 목록"}({formatDate(date)})
      </Typography>
      <Tooltip title={isTodoSection ? "내 할일에 추가" : "일정에 추가"}>
        <IconButton size="small" component="span" onClick={handleMenuOpen}>
          <NoteAddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        {isTodoSection ? (
          <MenuItem onClick={handleScheduleAdd("개인")}>
            내 할일에 추가
          </MenuItem>
        ) : (
          [
            <MenuItem key="company" onClick={handleScheduleAdd("회사")}>
              회사 일정에 추가
            </MenuItem>,
            <MenuItem key="team" onClick={handleScheduleAdd("팀")}>
              팀 일정에 추가
            </MenuItem>,
            <MenuItem key="personal" onClick={handleScheduleAdd("개인")}>
              개인 일정에 추가
            </MenuItem>,
          ]
        )}
      </Menu>
    </Box>
  );
};

/**
 * ToDo 및 일정 탭 컴포넌트
 */
const TodoScheduleTab = ({ meetingId = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 회의 데이터 불러오기
  useEffect(() => {
    fetchMeetingTodos(meetingId);
  }, [meetingId]);

  const fetchMeetingTodos = (id) => {
    setLoading(true);
    getMeetingDetails(id)
      .then((data) => {
        // 시작일 추가: 기존 데이터에 시작일이 없는 경우 마감일과 동일하게 설정
        const todosWithStartDate = (data.todos || []).map((todo) => ({
          ...todo,
          startDate: todo.startDate || todo.dueDate, // 시작일이 없으면 마감일과 동일하게 설정
          type: todo.type || "todo", // 타입 정보 추가
        }));
        setTodos(todosWithStartDate);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  /**
   * 할 일 삭제 핸들러
   */
  const handleDeleteTodo = (id) => {
    deleteTodo(meetingId, id)
      .then((data) => {
        // 시작일 추가: 기존 데이터에 시작일이 없는 경우 마감일과 동일하게 설정
        const todosWithStartDate = (data.todos || []).map((todo) => ({
          ...todo,
          startDate: todo.startDate || todo.dueDate,
          type: todo.type || "todo",
        }));
        setTodos(todosWithStartDate);
        showSnackbar("할 일이 삭제되었습니다.");
      })
      .catch((err) => {
        showSnackbar(`삭제 실패: ${err.message}`, "error");
      });
  };

  /**
   * 할 일 편집 핸들러
   */
  const handleEditTodo = () => {
    // 편집 기능이 제거되었으므로 알림만 표시
    showSnackbar("편집 기능이 비활성화되었습니다.", "info");
  };

  /**
   * 날짜별 할 일을 내 일정에 추가하는 핸들러
   */
  const handleAddDateToMySchedule = (date, dateTodos, type) => {
    if (type === "개인" && dateTodos[0]?.type === "todo") {
      // TODO 항목을 내 할일에 추가
      showSnackbar(
        `${date} 할 일 ${dateTodos.length}개가 내 할일에 추가되었습니다.`
      );
      // 여기에 실제 일정 추가 로직 구현
      return;
    } else if (dateTodos[0]?.type === "task") {
      // 업무 항목을 일정에 추가
      showSnackbar(
        `${date} 업무 ${dateTodos.length}개가 ${type} 일정에 추가되었습니다.`
      );
      // 여기에 실제 일정 추가 로직 구현
      return;
    }
  };

  /**
   * 스낵바 표시 함수
   */
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  /**
   * 스낵바 닫기 핸들러
   */
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 날짜별로 할 일과 업무를 그룹화
  const getTodosByDate = (type) => {
    const filtered = todos.filter((todo) =>
      type === "todo" ? todo.type === "todo" : todo.type === "task"
    );

    const grouped = filtered.reduce((acc, todo) => {
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

  const groupedTodosByDate = getTodosByDate("todo");
  const groupedTasksByDate = getTodosByDate("task");

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box sx={{ p: 3, bgcolor: "background.paper" }}>
      <Typography variant="h5" component="h2" fontWeight="bold">
        ToDo & 일정
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* 업무 목록 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#3E1A11" }}
        >
          업무 목록
        </Typography>
        <Box sx={{ p: 0, bgcolor: "grey.50", borderRadius: 1 }}>
          {groupedTasksByDate.length === 0 ? (
            <EmptyTodoMessage message="업무 항목이 없습니다. 새로운 항목을 추가해 보세요." />
          ) : (
            groupedTasksByDate.map(({ date, todos }) => (
              <DateSection
                key={date}
                date={date}
                todos={todos}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onAddDateToMySchedule={handleAddDateToMySchedule}
                isTodoSection={false}
              />
            ))
          )}
        </Box>
      </Box>

      {/* TODO 섹션 */}
      <Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: "#3E1A11" }}
        >
          TODO
        </Typography>
        <Box sx={{ p: 0, bgcolor: "grey.50", borderRadius: 1 }}>
          {groupedTodosByDate.length === 0 ? (
            <EmptyTodoMessage message="ToDo 항목이 없습니다. 새로운 항목을 추가해 보세요." />
          ) : (
            groupedTodosByDate.map(({ date, todos }) => (
              <DateSection
                key={date}
                date={date}
                todos={todos}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
                onAddDateToMySchedule={handleAddDateToMySchedule}
                isTodoSection={true}
              />
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

/**
 * 로딩 화면 컴포넌트
 */
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

/**
 * 에러 화면 컴포넌트
 */
const ErrorView = ({ error }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">{error}</Alert>
  </Box>
);

/**
 * 빈 목록 메시지 컴포넌트
 */
const EmptyTodoMessage = ({ message }) => (
  <Typography sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>
    {message}
  </Typography>
);

export default TodoScheduleTab;
