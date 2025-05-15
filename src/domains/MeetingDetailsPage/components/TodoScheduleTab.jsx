import React, { useState, useEffect } from 'react';
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
  ListItemButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { getMeetingDetails, deleteTodo } from '../../../apis/fakeApi';

/**
 * 할 일 항목 컴포넌트
 */
const TodoItem = ({ num, text, assignee, onEdit, onDelete }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Box sx={{ width: '40px' }}>
        <Typography variant="body2" color="text.secondary">
          투두{num}
        </Typography>
      </Box>
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        py: 1
      }}>
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
    </Box>
  );
};

/**
 * 담당자 정보 컴포넌트
 */
const AssigneeInfo = ({ assignee, onEdit }) => (
  <Box sx={{ minWidth: 120, display: 'flex', alignItems: 'center' }}>
    {assignee ? (
      <Typography variant="body2">{assignee}</Typography>
    ) : (
      <Button 
        startIcon={<PersonAddAltIcon />}
        size="small"
        sx={{ color: '#666' }}
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
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // 요일 구하기
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    return `${year}.${month}.${day} ${dayOfWeek}`;
  } catch {
    return dateString;
  }
};

/**
 * 날짜별 할 일 섹션 컴포넌트
 */
const DateSection = ({ date, todos, onEditTodo, onDeleteTodo, onAddDateToMySchedule }) => {
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
        boxShadow: 'none',
        '&:before': {
          display: 'none',
        },
        '& .MuiAccordionSummary-root': {
          minHeight: 'auto',
          padding: '0',
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <IconButton size="small" component="span">
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{ px: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
      >
        <DateSectionHeader 
          date={date} 
          onAddToSchedule={handleAddToSchedule}
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
const DateSectionHeader = ({ date, onAddToSchedule }) => {
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="h6">
        일 하기({formatDate(date)})
      </Typography>
      <Tooltip title="내 일정에 추가">
        <IconButton 
          size="small" 
          component="span" 
          onClick={handleMenuOpen}
        >
          <NoteAddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleScheduleAdd('회사')}>회사 일정으로 추가</MenuItem>
        <MenuItem onClick={handleScheduleAdd('팀')}>팀 일정으로 추가</MenuItem>
        <MenuItem onClick={handleScheduleAdd('개인')}>개인 일정으로 추가</MenuItem>
        <Divider />
        <MenuItem onClick={handleScheduleAdd('전체')}>모든 일정으로 추가</MenuItem>
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
    message: '',
    severity: 'success'
  });

  // 회의 데이터 불러오기
  useEffect(() => {
    fetchMeetingTodos(meetingId);
  }, [meetingId]);

  const fetchMeetingTodos = (id) => {
    setLoading(true);
    getMeetingDetails(id)
      .then(data => {
        setTodos(data.todos || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  /**
   * 할 일 삭제 핸들러
   */
  const handleDeleteTodo = (id) => {
    deleteTodo(meetingId, id)
      .then(data => {
        setTodos(data.todos);
        showSnackbar('할 일이 삭제되었습니다.');
      })
      .catch(err => {
        showSnackbar(`삭제 실패: ${err.message}`, 'error');
      });
  };

  /**
   * 할 일 편집 핸들러
   */
  const handleEditTodo = () => {
    // 편집 기능이 제거되었으므로 알림만 표시
    showSnackbar('편집 기능이 비활성화되었습니다.', 'info');
  };

  /**
   * 날짜별 할 일을 내 일정에 추가하는 핸들러
   */
  const handleAddDateToMySchedule = (date, dateTodos, type) => {
    if (type === '전체') {
      // 모든 타입(회사, 팀, 개인)으로 일정 추가
      showSnackbar(`${date} 할 일 ${dateTodos.length}개가 모든 일정에 추가되었습니다.`);
      // 여기에 실제 일정 추가 로직 구현
      return;
    }
    
    // 특정 타입으로 일정 추가
    showSnackbar(`${date} 할 일 ${dateTodos.length}개가 ${type} 일정으로 추가되었습니다.`);
    // 여기에 실제 일정 추가 로직 구현
  };

  /**
   * 스낵바 표시 함수
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  /**
   * 스낵바 닫기 핸들러
   */
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };

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
      .map(date => ({
        date,
        todos: grouped[date]
      }));
  };

  const groupedTodosByDate = getTodosByDate();

  if (loading) {
    return <LoadingView />;
  }
  
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
      <TodoHeader />
      
      <Divider sx={{ mb: 3 }} />
      
      <TodoList 
        groupedTodos={groupedTodosByDate}
        onEditTodo={handleEditTodo}
        onDeleteTodo={handleDeleteTodo}
        onAddToSchedule={handleAddDateToMySchedule}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
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
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
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
 * 할 일 헤더 컴포넌트
 */
const TodoHeader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography variant="h5" component="h2" fontWeight="bold">
      ToDo & 일정
    </Typography>
  </Box>
);

/**
 * 할 일 목록 컴포넌트
 */
const TodoList = ({ groupedTodos, onEditTodo, onDeleteTodo, onAddToSchedule }) => (
  <Box sx={{ p: 0, bgcolor: 'grey.50' }}>
    {groupedTodos.length === 0 ? (
      <EmptyTodoMessage />
    ) : (
      groupedTodos.map(({ date, todos }) => (
        <DateSection 
          key={date}
          date={date}
          todos={todos}
          onEditTodo={onEditTodo}
          onDeleteTodo={onDeleteTodo}
          onAddDateToMySchedule={onAddToSchedule}
        />
      ))
    )}
  </Box>
);

/**
 * 빈 할 일 목록 메시지 컴포넌트
 */
const EmptyTodoMessage = () => (
  <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
    ToDo 항목이 없습니다. 새로운 항목을 추가해 보세요.
  </Typography>
);

export default TodoScheduleTab; 