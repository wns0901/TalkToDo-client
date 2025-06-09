import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 캘린더 컴포넌트
 * 월별 일정을 표시하고 일정 관리 기능을 제공
 */
const Calendar = ({ schedules = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const renderDayEvents = (day) => {
    const dayEvents = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate);
      return format(scheduleDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });

    return dayEvents.map(event => (
      <Box
        key={event.id}
        sx={{
          backgroundColor: event.category === 'TODO' ? '#e3f2fd' : '#f5f5f5',
          borderRadius: 1,
          p: 0.5,
          mb: 0.5,
          fontSize: '0.75rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {event.title}
      </Box>
    ));
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {format(currentDate, 'yyyy년 MM월', { locale: ko })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                <TableCell key={day} align="center" sx={{ 
                  backgroundColor: day === '일' ? '#ffebee' : day === '토' ? '#e3f2fd' : 'inherit',
                  color: day === '일' ? '#d32f2f' : day === '토' ? '#1976d2' : 'inherit'
                }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
              <TableRow key={weekIndex}>
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = days[weekIndex * 7 + dayIndex];
                  if (!day) return <TableCell key={dayIndex} />;

                  return (
                    <TableCell
                      key={`cell-${format(day, 'yyyy-MM-dd')}`}
                      sx={{
                        height: '100px',
                        backgroundColor: isToday(day) ? '#f5f5f5' : 'inherit',
                        opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography
                          sx={{
                            color: format(day, 'E') === 'Sun' ? '#d32f2f' : 
                                   format(day, 'E') === 'Sat' ? '#1976d2' : 'inherit',
                            mb: 1
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        <Box sx={{ flex: 1, overflow: 'auto' }}>
                          {renderDayEvents(day)}
                        </Box>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Calendar; 