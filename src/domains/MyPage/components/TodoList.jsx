import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import { myPageStyles } from '../css/MyPage.styles';
import { format } from 'date-fns';

/**
 * 개인 할일 목록을 표시하는 컴포넌트
 */
const TodoList = ({ 
  schedules, 
  onEditEvent, 
  onDeleteEvent,
  onDateClick,
  onAddToCalendar,
  onRemoveFromCalendar
}) => {
  const [completedTodos, setCompletedTodos] = useState([]);
  const [activeTodoModalOpen, setActiveTodoModalOpen] = useState(false);
  const [completedTodoModalOpen, setCompletedTodoModalOpen] = useState(false);
  
  // 할일 추가 모달 상태
  const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    category: '개인',
    type: '개인',
    isTodo: true,
    displayInCalendar: false
  });

  /**
   * 할일 항목 클릭 시 해당 날짜로 이동하는 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleTodoClick = (todo) => {
    const todoDate = new Date(todo.startDate);
    onDateClick(todoDate);
  };

  /**
   * 할일 완료 상태 토글 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleToggleComplete = (todo, e) => {
    e.stopPropagation();
    if (completedTodos.find(item => item.id === todo.id)) {
      // 완료 목록에서 제거
      setCompletedTodos(prev => prev.filter(item => item.id !== todo.id));
    } else {
      // 완료 목록에 추가
      setCompletedTodos(prev => [...prev, todo]);
    }
  };

  /**
   * 완료된 할일 복구 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleRestoreTodo = (todo, e) => {
    e.stopPropagation();
    setCompletedTodos(prev => prev.filter(item => item.id !== todo.id));
  };

  /**
   * 일정에 추가 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleAddToCalendar = (todo, e) => {
    e.stopPropagation();
    if (onAddToCalendar) {
      onAddToCalendar(todo);
    }
  };
  
  /**
   * 일정에서 제거 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleRemoveFromCalendar = (todo, e) => {
    e.stopPropagation();
    if (onRemoveFromCalendar) {
      onRemoveFromCalendar(todo.id);
    }
  };
  
  /**
   * 진행 중인 할일 모달 열기
   */
  const handleOpenActiveTodoModal = () => {
    setActiveTodoModalOpen(true);
  };
  
  /**
   * 진행 중인 할일 모달 닫기
   */
  const handleCloseActiveTodoModal = () => {
    setActiveTodoModalOpen(false);
  };
  
  /**
   * 완료된 할일 모달 열기
   */
  const handleOpenCompletedTodoModal = () => {
    setCompletedTodoModalOpen(true);
  };
  
  /**
   * 완료된 할일 모달 닫기
   */
  const handleCloseCompletedTodoModal = () => {
    setCompletedTodoModalOpen(false);
  };
  
  /**
   * 할일 추가 모달 열기
   */
  const handleOpenAddTodoModal = () => {
    setAddTodoModalOpen(true);
  };
  
  /**
   * 할일 추가 모달 닫기
   */
  const handleCloseAddTodoModal = () => {
    setAddTodoModalOpen(false);
    setNewTodo({
      title: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      category: '개인',
      type: '개인',
      isTodo: true,
      displayInCalendar: false
    });
  };
  
  /**
   * 새 할일 입력값 변경 핸들러
   */
  const handleNewTodoChange = (e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  /**
   * 새 할일 저장 핸들러
   */
  const handleSaveTodo = () => {
    if (!newTodo.title.trim()) {
      alert('할일 제목을 입력해주세요.');
      return;
    }
    
    // 새 할일 객체 생성
    const todoToAdd = {
      ...newTodo,
      id: Date.now(),
      date: newTodo.startDate
    };
    
    // 기존 일정에 추가
    const updatedSchedules = [...schedules, todoToAdd];
    
    // 로컬 스토리지에 저장
    localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
    
    // 모달 닫기
    handleCloseAddTodoModal();
    
    // 페이지 리로드하여 새 할일 표시
    window.location.reload();
  };

  // 개인 카테고리 일정만 필터링하고 날짜순으로 정렬
  const personalTodos = schedules
    .filter(event => event.type === '개인' && (event.isTodo === true || event.isTodo === undefined))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // 완료되지 않은 할일 목록
  const activeTodos = personalTodos.filter(
    todo => !completedTodos.find(item => item.id === todo.id)
  );

  /**
   * 할일이 이미 일정표에 추가되었는지 확인하는 함수
   * @param {number|string} todoId - 확인할 할일 ID
   * @returns {boolean} - 일정표에 추가된 경우 true, 아니면 false
   */
  const isTodoAddedToCalendar = (todoId) => {
    return schedules.some(event => event.originalTodoId === todoId && event.type === 'TODO');
  };

  /**
   * 날짜 포맷팅 함수
   */
  const formatDateDisplay = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd');
    } catch {
      return dateString;
    }
  };

  /**
   * 할일 항목을 렌더링하는 함수 (코드 재사용을 위해)
   */
  const renderTodoItem = (todo, isCompleted = false) => (
    <ListItem
      key={todo.id}
      sx={{
        ...myPageStyles.todoItem,
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'stretch',
        mb: 1,
        ...(isCompleted && { opacity: 0.7 })
      }}
      onClick={() => handleTodoClick(todo)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Checkbox
          checked={isCompleted}
          sx={myPageStyles.todoCheckbox}
          onClick={(e) => handleToggleComplete(todo, e)}
        />
        <ListItemText
          primary={
            <Box component="span" sx={isCompleted ? { textDecoration: 'line-through' } : {}}>
              {todo.title}
            </Box>
          }
          sx={{
            '& .MuiTypography-root': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }
          }}
        />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!isCompleted && (
            <>
              {!isTodoAddedToCalendar(todo.id) ? (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCalendar(todo, e);
                  }}
                  sx={{ color: '#666' }}
                  aria-label="일정에 추가"
                >
                  <CalendarMonthIcon fontSize="small" />
                </IconButton>
              ) : (
                <Tooltip title="일정에서 제거">
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCalendar(todo, e);
                    }}
                    sx={{ color: '#f44336' }}
                    aria-label="일정에서 제거"
                  >
                    <CalendarMonthIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditEvent(todo);
                }}
                sx={{ color: '#666' }}
                aria-label="할일 수정"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </>
          )}
          {isCompleted ? (
            <IconButton 
              size="small" 
              onClick={(e) => handleRestoreTodo(todo, e)}
              sx={{ color: '#666' }}
              aria-label="할일 복구"
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEvent(todo.id);
              }}
              sx={{ color: '#666' }}
              aria-label="할일 삭제"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      <Box sx={{ pl: 4, mt: 1, fontSize: '0.8rem', color: '#666' }}>
        <Box component="span" sx={{ mr: 2 }}>
          시작일: {formatDateDisplay(todo.startDate)}
        </Box>
        <Box component="span">
          마감일: {formatDateDisplay(todo.endDate)}
        </Box>
      </Box>
    </ListItem>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* 내 할일 포스트잇 */}
      <Paper sx={{ ...myPageStyles.todoPostit, maxHeight: '400px', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={myPageStyles.postitTitle}>
            내 할 일
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              size="small" 
              onClick={handleOpenActiveTodoModal}
              sx={{ 
                color: '#3E1A11', 
                bgcolor: '#f0f0f0',
                '&:hover': { bgcolor: '#e0e0e0' }
              }}
              aria-label="내 할일 확대해서 보기"
            >
              <SearchIcon />
            </IconButton>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenAddTodoModal}
              sx={{ 
                bgcolor: '#3E1A11', 
                '&:hover': { 
                  bgcolor: '#5E2A21' 
                },
                py: 0.5
              }}
            >
              할일 추가
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {activeTodos.map(todo => renderTodoItem(todo))}
          {activeTodos.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography color="text.secondary">
                할일이 없습니다.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* 완료된 할일 포스트잇 */}
      <Paper sx={{ 
        ...myPageStyles.todoPostit, 
        maxHeight: '400px', 
        overflow: 'auto',
        backgroundColor: '#f8f8f8'  // 약간 다른 색상으로 구분
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={myPageStyles.postitTitle}>
              완료된 할일
            </Typography>
            <Box 
              component="span" 
              sx={{ 
                ml: 1, 
                backgroundColor: '#757575', 
                color: 'white', 
                px: 1, 
                py: 0.2, 
                borderRadius: '12px',
                fontSize: '0.8rem'
              }}
            >
              {completedTodos.length}
            </Box>
          </Box>
          <IconButton 
            size="small" 
            onClick={handleOpenCompletedTodoModal}
            sx={{ 
              color: '#3E1A11', 
              bgcolor: '#f0f0f0',
              '&:hover': { bgcolor: '#e0e0e0' }
            }}
            aria-label="완료된 할일 확대해서 보기"
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {completedTodos.map(todo => renderTodoItem(todo, true))}
          {completedTodos.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography color="text.secondary">
                완료된 할일이 없습니다.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
      
      {/* 진행 중인 할일 모달 */}
      <Dialog
        open={activeTodoModalOpen}
        onClose={handleCloseActiveTodoModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">내 할일 목록</Typography>
          <IconButton onClick={handleCloseActiveTodoModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {activeTodos.length > 0 ? (
            <Grid container spacing={2}>
              {activeTodos.map(todo => (
                <Grid item xs={12} sm={6} key={todo.id}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {todo.title}
                        </Typography>
                        <Checkbox
                          checked={false}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(todo, e);
                          }}
                        />
                      </Box>
                      
                      <Divider sx={{ mb: 1 }} />
                      
                      <Box sx={{ mb: 2, flex: 1 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', minWidth: '80px' }}>시작일:</Typography>
                          <Typography>{formatDateDisplay(todo.startDate)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', minWidth: '80px' }}>마감일:</Typography>
                          <Typography>{formatDateDisplay(todo.endDate)}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {!isTodoAddedToCalendar(todo.id) ? (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<CalendarMonthIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCalendar(todo, e);
                            }}
                          >
                            일정에 추가
                          </Button>
                        ) : (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="error"
                            startIcon={<CalendarMonthIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromCalendar(todo, e);
                            }}
                          >
                            일정에서 제거
                          </Button>
                        )}
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent(todo);
                            handleCloseActiveTodoModal();
                          }}
                        >
                          수정
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
              진행 중인 할일이 없습니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleOpenAddTodoModal} variant="contained" sx={{ bgcolor: '#3E1A11', '&:hover': { bgcolor: '#5E2A21' } }}>
            새 할일 추가
          </Button>
          <Button onClick={handleCloseActiveTodoModal} sx={{ color: '#757575' }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 완료된 할일 모달 */}
      <Dialog
        open={completedTodoModalOpen}
        onClose={handleCloseCompletedTodoModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">완료된 할일 목록</Typography>
          <IconButton onClick={handleCloseCompletedTodoModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {completedTodos.length > 0 ? (
            <Grid container spacing={2}>
              {completedTodos.map(todo => (
                <Grid item xs={12} sm={6} key={todo.id}>
                  <Paper elevation={2} sx={{ p: 2, opacity: 0.7, height: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'line-through' }}>
                          {todo.title}
                        </Typography>
                        <Checkbox
                          checked={true}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(todo, e);
                          }}
                        />
                      </Box>
                      
                      <Divider sx={{ mb: 1 }} />
                      
                      <Box sx={{ mb: 2, flex: 1 }}>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', minWidth: '80px' }}>시작일:</Typography>
                          <Typography>{formatDateDisplay(todo.startDate)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mb: 1 }}>
                          <Typography sx={{ fontWeight: 'bold', minWidth: '80px' }}>마감일:</Typography>
                          <Typography>{formatDateDisplay(todo.endDate)}</Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<RestoreIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreTodo(todo, e);
                          }}
                        >
                          복구하기
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
              완료된 할일이 없습니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCompletedTodoModal} sx={{ color: '#757575' }}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 할일 추가 모달 */}
      <Dialog 
        open={addTodoModalOpen} 
        onClose={handleCloseAddTodoModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">새 할일 추가</Typography>
          <IconButton onClick={handleCloseAddTodoModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ p: 2 }}>
            <TextField
              label="할일 제목"
              name="title"
              value={newTodo.title}
              onChange={handleNewTodoChange}
              fullWidth
              required
              margin="normal"
              error={!newTodo.title && addTodoModalOpen}
              helperText={!newTodo.title && addTodoModalOpen ? "제목을 입력해주세요" : ""}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
              <TextField
                label="시작일"
                name="startDate"
                type="date"
                value={newTodo.startDate}
                onChange={handleNewTodoChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              
              <TextField
                label="마감일"
                name="endDate"
                type="date"
                value={newTodo.endDate}
                onChange={handleNewTodoChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={new Date(newTodo.endDate) < new Date(newTodo.startDate)}
                helperText={
                  new Date(newTodo.endDate) < new Date(newTodo.startDate) 
                    ? "마감일은 시작일 이후로 설정해야 합니다" 
                    : ""
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAddTodoModal} sx={{ color: '#757575' }}>
            취소
          </Button>
          <Button 
            onClick={handleSaveTodo} 
            variant="contained" 
            sx={{ bgcolor: '#3E1A11', '&:hover': { bgcolor: '#5E2A21' } }}
            disabled={!newTodo.title || new Date(newTodo.endDate) < new Date(newTodo.startDate)}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList; 