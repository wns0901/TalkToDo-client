import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  TableContainer, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell,
  Button,
  Tooltip
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { format, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { myPageStyles } from '../css/MyPage.styles';
import { getCategoryColor, filterEventsByDate } from '../js/utils';

/**
 * 캘린더 컴포넌트
 * 월별 일정을 표시하고 일정 관리 기능을 제공
 */
const Calendar = ({ 
  currentMonth, 
  selectedDate, 
  schedules, 
  categoryFilter, 
  onPrevMonth, 
  onNextMonth, 
  onDateClick, 
  showMoreEvents,
  onCategoryFilterChange,
  onAddEvent
}) => {
  /**
   * 일정 추가 버튼 클릭 핸들러
   * 현재 선택된 필터를 기반으로 일정 타입을 설정
   */
  const handleAddEventClick = () => {
    const defaultEvent = {
      title: '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(selectedDate, 'yyyy-MM-dd'),
      category: categoryFilter !== '전체' ? categoryFilter : '개인',
      type: categoryFilter !== '전체' ? categoryFilter : '개인'
    };
    
    onAddEvent(defaultEvent);
  };

  /**
   * 달력 헤더 렌더링
   * 월 이동 버튼과 일정 추가 버튼을 포함
   */
  const renderHeader = () => {
    const dateFormat = "yyyy.MM";
    return (
      <Box sx={{ 
        ...myPageStyles.calendarHeader,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={onPrevMonth} aria-label="이전 달">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h5" sx={myPageStyles.calendarTitle}>
            {format(currentMonth, dateFormat)}
          </Typography>
          <IconButton onClick={onNextMonth} aria-label="다음 달">
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddEventClick}
          sx={{ minHeight: 0, py: 0.5 }}
          aria-label="일정 추가"
        >
          일정 추가
        </Button>
      </Box>
    );
  };

  /**
   * 날짜 셀 내의 이벤트 렌더링
   * @param {Array} events - 표시할 이벤트 배열
   */
  const renderDayEvents = (events) => {
    if (events.length === 0) return null;

    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5,
        maxHeight: '75px',
        overflow: 'hidden'
      }}>
        {/* 최대 2개의 이벤트만 표시 */}
        {events.slice(0, 2).map((event) => (
          <Box 
            key={event.id} 
            sx={{ 
              backgroundColor: getCategoryColor(event.category),
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '12px',
              color: 'black',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: '20px',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            {event.title}
          </Box>
        ))}
        {/* 2개 이상의 이벤트가 있는 경우 더보기 표시 */}
        {events.length > 2 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              fontSize: '12px', 
              color: '#555',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              showMoreEvents(events);
            }}
          >
            +{events.length - 2} 더 보기
          </Box>
        )}
      </Box>
    );
  };

  /**
   * 달력 그리드 렌더링
   */
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let day = startDate;

    // 요일 헤더
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

    // 카테고리 필터
    const categories = ['전체', '회사', '팀', '개인'];

    // 카테고리 필터 행
    const categoryFilters = (
      <TableRow>
        <TableCell colSpan={7} align="center" sx={myPageStyles.filterContainer}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 'bold' }}>
              필터
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={categoryFilter === category ? 'contained' : 'outlined'}
                  onClick={() => onCategoryFilterChange(category)}
                  sx={{ 
                    minWidth: '80px',
                    bgcolor: categoryFilter === category ? '#757575' : 'white',
                    color: categoryFilter === category ? 'white' : 'black',
                    border: '1px solid #ccc'
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
        </TableCell>
      </TableRow>
    );

    // 요일 헤더 행
    const dayHeaders = (
      <TableRow>
        {daysOfWeek.map((day, index) => (
          <TableCell 
            key={index} 
            align="center" 
            sx={{ 
              py: 1, 
              color: index === 0 ? 'red' : index === 6 ? 'blue' : 'inherit',
              fontWeight: 'bold',
              borderBottom: '1px solid #e0e0e0',
              borderTop: '1px solid #e0e0e0'
            }}
          >
            {day}
          </TableCell>
        ))}
      </TableRow>
    );

    rows.push(categoryFilters);
    rows.push(dayHeaders);

    // 날짜 그리드 생성
    let weekIndex = 0;
    while (day <= endDate) {
      let weekRow = [];
      for (let i = 0; i < 7; i++) {
        // 해당 날짜에 표시될 이벤트 필터링
        const formattedDate = format(day, 'yyyy-MM-dd');
        let dayEvents = filterEventsByDate(schedules, formattedDate, categoryFilter);
        
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = isSameDay(day, selectedDate);
        const isOtherMonth = !isCurrentMonth;
        
        // 현재 날짜 객체 복제 
        const currentDay = new Date(day);

        weekRow.push(
          <TableCell 
            key={`cell-${format(currentDay, 'yyyy-MM-dd')}`}
            align="center" 
            onClick={() => onDateClick(currentDay)}
            onDoubleClick={() => {
              onDateClick(currentDay);
              
              if (dayEvents.length > 0) {
                showMoreEvents(dayEvents);
              }
            }}
            sx={{ 
              ...myPageStyles.calendarCell,
              cursor: 'pointer',
              ...(isSelected ? { 
                bgcolor: '#f0f0f0',
                boxShadow: 'inset 0 0 0 2px #3E1A11',
                fontWeight: 'bold'
              } : {}),
              ...(!isCurrentMonth && { color: '#ccc' }),
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#f9f9f9'
              }
            }}
          >
            <Typography 
              sx={{ 
                fontSize: '15px',
                fontWeight: isSelected ? 'bold' : 'normal',
                color: isOtherMonth 
                  ? '#ccc' 
                  : i === 0 
                    ? 'red' 
                    : i === 6 
                      ? 'blue' 
                      : 'inherit',
                textAlign: 'left',
                mb: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {format(day, dateFormat)}
              {dayEvents.length > 0 && (
                <Box
                  sx={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#757575',
                    color: 'white',
                    fontSize: '11px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {dayEvents.length}
                </Box>
              )}
            </Typography>
            {renderDayEvents(dayEvents)}
          </TableCell>
        );
        day = addDays(day, 1);
      }
      rows.push(<TableRow key={`week-${weekIndex}`}>{weekRow}</TableRow>);
      weekIndex++;
    }

    return (
      <TableContainer>
        <Table 
          sx={{ 
            minWidth: 650, 
            tableLayout: 'fixed' 
          }}
        >
          <TableBody>
            {rows}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {renderHeader()}
      {renderCalendar()}
    </Box>
  );
};

export default Calendar; 