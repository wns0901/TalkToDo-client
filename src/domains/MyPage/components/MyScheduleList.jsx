import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Chip
} from '@mui/material';
import { myScheduleListStyles } from './MyScheduleList.styles';

/**
 * 나의 일정 목록 컴포넌트
 */
const MyScheduleList = ({ schedules, onToggleComplete }) => {
  if (!schedules || schedules.length === 0) {
    return <EmptyScheduleMessage />;
  }

  return (
    <Box>
      {schedules.map((dateGroup) => (
        <ScheduleDateGroup 
          key={dateGroup.id} 
          dateGroup={dateGroup} 
          onToggleComplete={onToggleComplete} 
        />
      ))}
    </Box>
  );
};

/**
 * 일정이 없을 때 표시할 메시지 컴포넌트
 */
const EmptyScheduleMessage = () => (
  <Typography sx={myScheduleListStyles.emptyMessage}>
    해당하는 일정이 없습니다.
  </Typography>
);

/**
 * 날짜별 일정 그룹 컴포넌트
 */
const ScheduleDateGroup = ({ dateGroup, onToggleComplete }) => (
  <Paper sx={myScheduleListStyles.dateGroup} elevation={1}>
    <Box sx={myScheduleListStyles.dateHeader}>
      <Typography variant="h6" sx={myScheduleListStyles.dateTitle}>
        {formatDate(dateGroup.date)}
      </Typography>
      <Chip 
        label={`${dateGroup.items.length}개의 일정`} 
        size="small" 
        sx={myScheduleListStyles.countChip}
      />
    </Box>
    
    <Divider />
    
    <List>
      {dateGroup.items.map((item) => (
        <ScheduleItem 
          key={item.id} 
          item={item} 
          dateId={dateGroup.id}
          onToggleComplete={onToggleComplete} 
        />
      ))}
    </List>
  </Paper>
);

/**
 * 개별 일정 항목 컴포넌트
 */
const ScheduleItem = ({ item, dateId, onToggleComplete }) => (
  <ListItem 
    sx={myScheduleListStyles.item}
    secondaryAction={
      item.fromMeeting && (
        <Chip 
          label={item.fromMeeting} 
          size="small" 
          sx={myScheduleListStyles.meetingChip}
        />
      )
    }
  >
    <ListItemIcon sx={myScheduleListStyles.checkboxContainer}>
      <Checkbox
        edge="start"
        checked={item.isCompleted}
        onChange={() => onToggleComplete(dateId, item.id)}
        sx={myScheduleListStyles.checkbox}
      />
    </ListItemIcon>
    <ListItemText
      primary={item.text}
      sx={{
        ...myScheduleListStyles.itemText,
        ...(item.isCompleted && myScheduleListStyles.completedItemText)
      }}
    />
  </ListItem>
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

export default MyScheduleList; 