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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getMeetingDetails, deleteTodo } from '../../../apis/fakeApi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

// 그룹웨어 멤버 더미 데이터
const GROUPWARE_MEMBERS = [
  '김범수 과장',
  '장준영 부장',
  '이지원 대리',
  '홍길동 사원',
  '최유리 팀장',
];

/**
 * 할 일 수정 모달
 */
const TodoEditModal = ({ open, value, onChange, onClose, onSave }) => {
  const getDateValue = (val) => {
    if (!val) return null;
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d) ? null : d;
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: { borderRadius: 3, p: 0, boxShadow: 6 }
    }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22, pb: 0, pt: 3, px: 4 }}>
        할 일 수정
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, px: 4, pb: 0 }}>
        <TextField
          label="할 일 내용"
          value={value.text}
          onChange={e => onChange({ ...value, text: e.target.value })}
          fullWidth
          multiline
          minRows={3}
          autoFocus
          sx={{ mt: 2, mb: 1, fontWeight: 600 }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="시작일"
            value={getDateValue(value.startDate)}
            onChange={date => onChange({ ...value, startDate: date ? format(date, 'yyyy-MM-dd') : '' })}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 1 }} />}
          />
          <DatePicker
            label="마감일"
            value={getDateValue(value.dueDate)}
            onChange={date => onChange({ ...value, dueDate: date ? format(date, 'yyyy-MM-dd') : '' })}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 1 }} />}
          />
        </LocalizationProvider>
        <FormControl fullWidth sx={{ mb: 1 }}>
          <InputLabel sx={{ fontWeight: 600 }}>담당자</InputLabel>
          <Select
            label="담당자"
            value={value.assignee || ''}
            onChange={e => onChange({ ...value, assignee: e.target.value })}
          >
            {GROUPWARE_MEMBERS.map((member) => (
              <MenuItem key={member} value={member}>{member}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 3, pt: 2 }}>
        <Button onClick={onClose} color="inherit" type="button" sx={{ minWidth: 80 }}>
          취소
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          type="button"
          sx={{
            minWidth: 100,
            fontWeight: 700,
            bgcolor: '#3E1A11',
            '&:hover': { bgcolor: '#5E2A21' }
          }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * 할 일 항목 컴포넌트
 */
const TodoItem = ({ todo, onDelete, onAddToMyTodo, isTodoSection, onUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editValue, setEditValue] = useState({ ...todo });
  const open = Boolean(anchorEl);

  useEffect(() => {
    setEditValue({ ...todo });
  }, [todo]);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleAddToMyTodo = () => {
    onAddToMyTodo(todo.text);
    setIsAdded(!isAdded);
    handleMenuClose();
  };

  const handleEdit = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleEditChange = (val) => setEditValue(val);

  const handleEditSave = () => {
    setEditModalOpen(false);
    onUpdate(todo.id, editValue);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px 0 rgba(60,60,60,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        background: isAdded ? '#fff0f0' : '#fff',
        transition: 'background 0.2s',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 48, fontWeight: 700 }}>
        {isTodoSection ? `할 일${todo.num}` : `일정${todo.num}`}
      </Typography>
      <Typography
        variant="body1"
        sx={{ flex: 2, fontWeight: 600, color: isAdded ? 'error.main' : 'text.primary', wordBreak: 'break-all' }}
      >
        {todo.text}
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>시작일</Typography>
          <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 700 }}>{formatDate(todo.startDate)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>마감일</Typography>
          <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 700 }}>{formatDate(todo.dueDate)}</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>담당자</Typography>
        <Typography variant="caption" sx={{ color: 'grey.700', fontWeight: 700 }}>{todo.assignee || '-'}</Typography>
      </Box>
      <Box>
        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }} disabled={editModalOpen}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          {isTodoSection && (
            <MenuItem onClick={handleAddToMyTodo}>{isAdded ? '내 할일에서 제거' : '내 할일에 추가'}</MenuItem>
          )}
          <MenuItem onClick={handleEdit} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            <span>수정</span>
          </MenuItem>
          <MenuItem onClick={() => { onDelete(todo.id); handleMenuClose(); }} sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main', mr: 1 }} />
            <span>삭제</span>
          </MenuItem>
        </Menu>
        <TodoEditModal
          open={editModalOpen}
          value={editValue}
          onChange={handleEditChange}
          onClose={() => setEditModalOpen(false)}
          onSave={handleEditSave}
        />
      </Box>
    </Paper>
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
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
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
const DateSection = ({ date, todos, onDeleteTodo, onAddDateToMySchedule, isTodoSection, onUpdateTodo }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => setExpanded(!expanded);

  const handleAddToMyTodo = (text) => {
    onAddDateToMySchedule(date, [{ text, type: 'todo' }], '개인');
  };

  if (isTodoSection) {
    return (
      <Box sx={{ mb: 1 }}>
        <Box sx={{ p: 2 }}>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={{ ...todo, num: index + 1 }}
              onDelete={onDeleteTodo}
              onAddToMyTodo={handleAddToMyTodo}
              isTodoSection={true}
              onUpdate={onUpdateTodo}
            />
          ))}
        </Box>
      </Box>
    );
  }

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
          onAddToSchedule={handleAddToMyTodo}
          isTodoSection={isTodoSection}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={{ ...todo, num: index + 1 }}
              onDelete={onDeleteTodo}
              onAddToMyTodo={() => {}}
              isTodoSection={false}
              onUpdate={onUpdateTodo}
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography variant="h6">
        일정({formatDate(date)})
      </Typography>
      <Tooltip title={isTodoSection ? "내 할일에 추가" : "일정에 추가"}>
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
        {isTodoSection ? (
          <MenuItem onClick={handleScheduleAdd('개인')}>내 할일에 추가</MenuItem>
        ) : (
          <>
            <MenuItem onClick={handleScheduleAdd('회사')}>회사 일정에 추가</MenuItem>
            <MenuItem onClick={handleScheduleAdd('팀')}>팀 일정에 추가</MenuItem>
            <MenuItem onClick={handleScheduleAdd('개인')}>개인 일정에 추가</MenuItem>
          </>
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
        const todosWithStartDate = (data.todos || []).map(todo => ({
          ...todo,
          startDate: todo.startDate || todo.dueDate,
          type: todo.type || 'todo'
        }));
        setTodos(todosWithStartDate);
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
        const todosWithStartDate = (data.todos || []).map(todo => ({
          ...todo,
          startDate: todo.startDate || todo.dueDate,
          type: todo.type || 'todo'
        }));
        setTodos(todosWithStartDate);
        showSnackbar('할 일이 삭제되었습니다.');
      })
      .catch(err => {
        showSnackbar(`삭제 실패: ${err.message}`, 'error');
      });
  };

  /**
   * 날짜별 할 일을 내 일정에 추가하는 핸들러
   */
  const handleAddDateToMySchedule = (date, dateTodos, type) => {
    if (type === '개인' && dateTodos[0]?.type === 'todo') {
      showSnackbar(`${date} 할 일 ${dateTodos.length}개가 내 할일에 추가되었습니다.`);
      return;
    } else if (dateTodos[0]?.type === 'task') {
      showSnackbar(`${date} 업무 ${dateTodos.length}개가 ${type} 일정에 추가되었습니다.`);
      return;
    }
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

  // 날짜별로 할 일과 업무를 그룹화
  const getTodosByDate = (type) => {
    const filtered = todos.filter(todo => 
      type === 'todo' ? todo.type === 'todo' : todo.type === 'task'
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
      .map(date => ({
        date,
        todos: grouped[date]
      }));
  };

  const groupedTodosByDate = getTodosByDate('todo');
  const groupedTasksByDate = getTodosByDate('task');

  const handleUpdateTodo = (id, updated) => {
    setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...updated } : todo));
    showSnackbar('수정되었습니다.');
  };

  if (loading) {
    return <LoadingView />;
  }
  
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Typography variant="h5" component="h2" fontWeight="bold">
        ToDo & 일정
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* 업무 목록 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#3E1A11' }}>일정</Typography>
        <Box sx={{ p: 0, bgcolor: 'grey.50', borderRadius: 1 }}>
          {groupedTasksByDate.length === 0 ? (
            <EmptyTodoMessage message="일정 항목이 없습니다. 새로운 항목을 추가해 보세요." />
          ) : (
            groupedTasksByDate.map(({ date, todos }) => (
              <DateSection 
                key={date}
                date={date}
                todos={todos}
                onDeleteTodo={handleDeleteTodo}
                onAddDateToMySchedule={handleAddDateToMySchedule}
                isTodoSection={false}
                onUpdateTodo={handleUpdateTodo}
              />
            ))
          )}
        </Box>
      </Box>
      
      {/* TODO 섹션 */}
      <Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#3E1A11' }}>
          TODO
        </Typography>
        <Box sx={{ p: 0, bgcolor: 'grey.50', borderRadius: 1 }}>
          {groupedTodosByDate.length === 0 ? (
            <EmptyTodoMessage message="ToDo 항목이 없습니다. 새로운 항목을 추가해 보세요." />
          ) : (
            groupedTodosByDate.map(({ date, todos }) => (
              <DateSection 
                key={date}
                date={date}
                todos={todos}
                onDeleteTodo={handleDeleteTodo}
                onAddDateToMySchedule={handleAddDateToMySchedule}
                isTodoSection={true}
                onUpdateTodo={handleUpdateTodo}
              />
            ))
          )}
        </Box>
      </Box>

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
 * 빈 목록 메시지 컴포넌트
 */
const EmptyTodoMessage = ({ message }) => (
  <Typography sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
    {message}
  </Typography>
);

export default TodoScheduleTab; 