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
  Chip,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { myPageStyles } from '../css/MyPage.styles';
import { getCategoryColor, formatDateRange } from '../js/utils';

const DailyEvents = ({ 
  selectedDate, 
  filteredEvents, 
  onAddEvent, 
  onEditEvent 
}) => {
  // 일정 추가 버튼 클릭 핸들러
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

  return (
    <Paper sx={{ ...myPageStyles.selectedDateEvents, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={myPageStyles.selectedDateTitle}>
          {format(selectedDate, 'yyyy년 MM월 dd일')}의 일정
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
      <Divider sx={{ my: 1 }} />
      {filteredEvents.length > 0 ? (
        <List>
          {filteredEvents.map(event => (
            <ListItem key={event.id} sx={myPageStyles.eventItem}>
              <ListItemText 
                primary={event.title}
                secondary={formatDateRange(event.startDate, event.endDate)}
                sx={{
                  ...myPageStyles.eventText,
                  '& .MuiTypography-root': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={event.category} 
                  size="small" 
                  sx={{
                    borderRadius: '4px',
                    backgroundColor: getCategoryColor(event.category)
                  }}
                />
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEvent(event);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box sx={myPageStyles.noEvents}>
          <Typography color="text.secondary">
            선택한 날짜에 일정이 없습니다.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default DailyEvents; 