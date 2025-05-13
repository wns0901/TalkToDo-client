import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { myPageStyles } from '../css/MyPage.styles';
import { formatDateRange } from '../js/utils';

const TodoList = ({ 
  schedules, 
  selectedDate, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  // 할일 추가 버튼 클릭 핸들러
  const handleAddClick = () => {
    onAddEvent({
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(selectedDate, 'yyyy-MM-dd'),
      category: '개인',
      type: '개인'
    });
  };

  // 할일 목록 필터링 (개인 카테고리만)
  const personalEvents = schedules
    .filter(event => event.category === '개인')
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <Paper sx={myPageStyles.todoPostit}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={myPageStyles.postitTitle}>
          내 할 일
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          sx={{ minHeight: 0, py: 0.5 }}
        >
          일정 추가
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      <List>
        {personalEvents.map((todo) => (
          <ListItem
            key={todo.id}
            sx={myPageStyles.todoItem}
          >
            <Checkbox
              sx={myPageStyles.todoCheckbox}
            />
            <ListItemText
              primary={
                <Box component="span">
                  {todo.title} <Typography component="span" color="text.secondary" sx={{ fontSize: '0.85em' }}>
                    ({formatDateRange(todo.startDate, todo.endDate)})
                  </Typography>
                </Box>
              }
              sx={{
                '& .MuiTypography-root': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }}
              onClick={() => onEditEvent(todo)}
            />
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton 
                size="small" 
                onClick={() => onEditEvent(todo)}
                sx={{ color: '#666' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={() => onDeleteEvent(todo.id)}
                sx={{ color: '#666' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
        {personalEvents.length === 0 && (
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