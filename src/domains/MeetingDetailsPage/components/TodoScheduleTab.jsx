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
  Tooltip
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
import { getMeetingDetails, updateTodo, addTodo, deleteTodo } from '../../../apis/fakeApi';

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
          <IconButton size="small">
            <ExpandMoreIcon />
          </IconButton>
        }
        sx={{ px: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}
      >
        <DateSectionHeader 
          date={date} 
          onAddToSchedule={(e) => {
            e.stopPropagation(); 
            onAddDateToMySchedule(date, todos);
          }} 
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
const DateSectionHeader = ({ date, onAddToSchedule }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
    <Typography variant="h6">
      일 하기({formatDate(date)})
    </Typography>
    <Tooltip title="내 일정에 추가">
      <IconButton size="small" onClick={onAddToSchedule}>
        <NoteAddIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

/**
 * ToDo 및 일정 탭 컴포넌트
 */
const TodoScheduleTab = ({ meetingId = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);

  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({ 
    text: '', 
    completed: false, 
    assignee: '', 
    dueDate: '' 
  });
  const [editingTodoId, setEditingTodoId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });


  const teamMembers = [
    '장준영 부장',
    '김범수 과장',
    '이지원 대리',
    '박민준 사원',
    '최서연 과장'
  ];

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
  const handleEditTodo = (todo) => {
    setCurrentTodo({ ...todo });
    setEditingTodoId(todo.id);
    setTodoDialogOpen(true);
  };

  /**
   * 새 할 일 추가 핸들러
   */
  const handleAddTodo = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setCurrentTodo({ 
      text: '', 
      completed: false, 
      assignee: '', 
      dueDate: formattedDate
    });
    setEditingTodoId(null);
    setTodoDialogOpen(true);
  };

  /**
   * 날짜별 할 일을 내 일정에 추가하는 핸들러
   */
  const handleAddDateToMySchedule = (date, dateTodos) => {

    showSnackbar(`${date} 할 일 ${dateTodos.length}개가 내 일정에 추가되었습니다.`);
  };

  /**
   * 할 일 다이얼로그 닫기 핸들러
   */
  const handleCloseTodoDialog = () => {
    setTodoDialogOpen(false);
  };

  /**
   * 할 일 저장 핸들러
   */
  const handleSaveTodo = () => {
    if (currentTodo.text.trim() === '') {
      showSnackbar('할 일을 입력해주세요.', 'error');
      return;
    }

    const savePromise = editingTodoId
      ? updateTodo(meetingId, editingTodoId, currentTodo)
      : addTodo(meetingId, currentTodo);

    savePromise
      .then(data => {
        setTodos(data.todos);
        setTodoDialogOpen(false);
        const message = editingTodoId ? '할 일이 수정되었습니다.' : '할 일이 추가되었습니다.';
        showSnackbar(message);
      })
      .catch(err => {
        const action = editingTodoId ? '수정' : '추가';
        showSnackbar(`${action} 실패: ${err.message}`, 'error');
      });
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

  /**
   * 현재 할 일 상태 업데이트 핸들러
   */
  const handleTodoChange = (field, value) => {
    setCurrentTodo(prev => ({
      ...prev,
      [field]: value
    }));
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
      <TodoHeader onAddTodo={handleAddTodo} />
      
      <Divider sx={{ mb: 3 }} />
      
      <TodoList 
        groupedTodos={groupedTodosByDate}
        onEditTodo={handleEditTodo}
        onDeleteTodo={handleDeleteTodo}
        onAddToSchedule={handleAddDateToMySchedule}
      />

      <TodoDialog
        open={todoDialogOpen}
        todo={currentTodo}
        isEditing={Boolean(editingTodoId)}
        teamMembers={teamMembers}
        onClose={handleCloseTodoDialog}
        onSave={handleSaveTodo}
        onChange={handleTodoChange}
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
const TodoHeader = ({ onAddTodo }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography variant="h5" component="h2" fontWeight="bold">
      ToDo & 일정
    </Typography>
    <Button 
      variant="contained" 
      startIcon={<AddIcon />}
      onClick={onAddTodo}
      sx={{ bgcolor: '#3E1A11', '&:hover': { bgcolor: '#2A120B' } }}
    >
      할 일 추가
    </Button>
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

/**
 * 할 일 다이얼로그 컴포넌트
 */
const TodoDialog = ({ open, todo, isEditing, teamMembers, onClose, onSave, onChange }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{isEditing ? '할 일 수정' : '할 일 추가'}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="할 일"
        fullWidth
        variant="outlined"
        value={todo.text}
        onChange={(e) => onChange('text', e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth margin="dense" variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="assignee-label">담당자</InputLabel>
        <Select
          labelId="assignee-label"
          id="assignee"
          value={todo.assignee}
          onChange={(e) => onChange('assignee', e.target.value)}
          label="담당자"
        >
          <MenuItem value="">
            <em>담당자 없음</em>
          </MenuItem>
          {teamMembers.map((member) => (
            <MenuItem key={member} value={member}>{member}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        margin="dense"
        label="마감일 (YYYY-MM-DD)"
        fullWidth
        variant="outlined"
        value={todo.dueDate}
        onChange={(e) => onChange('dueDate', e.target.value)}
        sx={{ mb: 2 }}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>취소</Button>
      <Button 
        onClick={onSave}
        variant="contained"
        sx={{ bgcolor: '#3E1A11', '&:hover': { bgcolor: '#2A120B' } }}
      >
        저장
      </Button>
    </DialogActions>
  </Dialog>
);

export default TodoScheduleTab; 