import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { myPageStyles } from '../css/MyPage.styles';

/**
 * 개인 할일 목록을 표시하는 컴포넌트
 */
const TodoList = ({ 
  schedules, 
  onEditEvent, 
  onDeleteEvent,
  onDateClick
}) => {
  /**
   * 할일 항목 클릭 시 해당 날짜로 이동하는 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleTodoClick = (todo) => {
    const todoDate = new Date(todo.startDate);
    onDateClick(todoDate);
  };

  // 개인 카테고리 일정만 필터링하고 날짜순으로 정렬
  const personalTodos = schedules
    .filter(event => event.type === '개인')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <Paper sx={myPageStyles.todoPostit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={myPageStyles.postitTitle}>
          내 할 일
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {personalTodos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              ...myPageStyles.todoItem,
              cursor: 'pointer'
            }}
            onClick={() => handleTodoClick(todo)}
          >
            <Checkbox
              sx={myPageStyles.todoCheckbox}
              onClick={(e) => e.stopPropagation()}
            />
            <ListItemText
              primary={
                <Box component="span">
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
            </Box>
          </ListItem>
        ))}
        {personalTodos.length === 0 && (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography color="text.secondary">
              개인 일정이 없습니다.
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
};

export default TodoList; 