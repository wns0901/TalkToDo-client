import React, { useState, useEffect } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, addDays } from 'date-fns';
import { myPageStyles } from './css/MyPage.styles';

// 분리된 컴포넌트들 가져오기
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import DailyEvents from './components/DailyEvents';
import { EventModal, CategoryModal, AddEventModal, EditEventModal } from './components/Modals';
import { PageHeader, LoadingView, ErrorView } from './components/Common';
import { filterEventsByDate } from './js/utils';

/**
 * 나의 일정 페이지 컴포넌트
 */
const MyPage = () => {
  // 초기 날짜 설정
  const today = new Date();
  const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // 상태 관리
  const [currentMonth, setCurrentMonth] = useState(currentMonthDate);
  const [selectedDate, setSelectedDate] = useState(today);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [schedules, setSchedules] = useState([]);
  
  // 필터 상태
  const [categoryFilter, setCategoryFilter] = useState('전체');
  
  // 카테고리 관리
  const [categories] = useState(['전체', '회사', '팀', '개인']);
  
  // 모달 상태
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  
  // 일정 추가 모달 상태
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(today, 'yyyy-MM-dd'),
    startDate: format(today, 'yyyy-MM-dd'),
    endDate: format(today, 'yyyy-MM-dd'),
    category: '개인',
    type: '개인'
  });
  
  // 일정 수정 모달 상태
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  
  // 선택된 날짜의 일정
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  const navigate = useNavigate();

  // 일정 데이터 로드
  useEffect(() => {
    // 저장된 일정 데이터 확인
    const savedSchedules = localStorage.getItem('schedules');
    
    if (savedSchedules) {
      // 저장된 데이터가 있으면 불러오기
      try {
        const parsedSchedules = JSON.parse(savedSchedules);
        setSchedules(parsedSchedules);
        setLoading(false);
      } catch (error) {
        console.error('저장된 일정 데이터를 불러오는데 실패했습니다:', error);
        loadDummyData();
      }
    } else {
      // 저장된 데이터가 없으면 더미 데이터 로드
      loadDummyData();
    }
  }, [today]);
  
  // 더미 데이터 로드 함수
  const loadDummyData = () => {
    // 임시 데이터 생성
    const dummySchedules = [
      { id: 1, date: '2025-01-02', startDate: '2025-01-02', endDate: '2025-01-02', title: '회사 미팅 10:00', category: '회사', type: '회사' },
      { id: 2, date: '2025-01-06', startDate: '2025-01-06', endDate: '2025-01-06', title: '회사 미팅 10:00', category: '회사', type: '회사' },
      { id: 3, date: '2025-01-06', startDate: '2025-01-06', endDate: '2025-01-06', title: '1차 면접', category: '개인', type: '개인' },
      { id: 4, date: '2025-01-07', startDate: '2025-01-07', endDate: '2025-01-07', title: '팀 미팅 2:30', category: '팀', type: '팀' },
      { id: 5, date: '2025-01-08', startDate: '2025-01-08', endDate: '2025-01-10', title: '서류작성 기간', category: '회사', type: '회사' },
      { id: 6, date: '2025-01-09', startDate: '2025-01-08', endDate: '2025-01-10', title: '서류작성 기간', category: '회사', type: '회사' },
      { id: 7, date: '2025-01-11', startDate: '2025-01-11', endDate: '2025-01-11', title: '팀 미팅 11:00', category: '팀', type: '팀' },
      { id: 8, date: '2025-01-12', startDate: '2025-01-12', endDate: '2025-01-14', title: '가계부 정리', category: '개인', type: '개인' },
      { id: 9, date: '2025-01-14', startDate: '2025-01-14', endDate: '2025-01-14', title: '마케팅 회의', category: '회사', type: '회사' },
      { id: 10, date: '2025-01-17', startDate: '2025-01-17', endDate: '2025-01-17', title: '2차 면접', category: '개인', type: '개인' },
      { id: 11, date: '2025-01-18', startDate: '2025-01-18', endDate: '2025-01-18', title: '팀 미팅 13:30', category: '팀', type: '팀' },
      { id: 12, date: '2025-01-19', startDate: '2025-01-19', endDate: '2025-01-19', title: '2차 면접', category: '개인', type: '개인' },
      { id: 13, date: '2025-01-22', startDate: '2025-01-22', endDate: '2025-01-22', title: '강의', category: '개인', type: '개인' },
      { id: 14, date: '2025-01-24', startDate: '2025-01-24', endDate: '2025-01-24', title: '회사 미팅 14:00', category: '회사', type: '회사' },
      { id: 15, date: '2025-01-28', startDate: '2025-01-28', endDate: '2025-01-28', title: '회사 미팅 15:00', category: '회사', type: '회사' },
      { id: 16, date: format(today, 'yyyy-MM-dd'), startDate: format(today, 'yyyy-MM-dd'), endDate: format(today, 'yyyy-MM-dd'), title: '할 일 작성하기', category: '개인', type: '개인' },
      { id: 17, date: format(addDays(today, 1), 'yyyy-MM-dd'), startDate: format(addDays(today, 1), 'yyyy-MM-dd'), endDate: format(addDays(today, 1), 'yyyy-MM-dd'), title: '이메일 확인', category: '개인', type: '개인' },
      { id: 18, date: format(addDays(today, 2), 'yyyy-MM-dd'), startDate: format(addDays(today, 2), 'yyyy-MM-dd'), endDate: format(addDays(today, 4), 'yyyy-MM-dd'), title: '보고서 제출', category: '개인', type: '개인' },
      { id: 19, date: format(addDays(today, -1), 'yyyy-MM-dd'), startDate: format(addDays(today, -1), 'yyyy-MM-dd'), endDate: format(addDays(today, -1), 'yyyy-MM-dd'), title: '가계부 정리', category: '개인', type: '개인' }
    ];
    
    // 데이터 로딩 시뮬레이션
    setTimeout(() => {
      setSchedules(dummySchedules);
      localStorage.setItem('schedules', JSON.stringify(dummySchedules));
      setLoading(false);
    }, 500);
  };

  // 날짜 또는 필터가 변경될 때 일정 필터링
  useEffect(() => {
    if (!selectedDate || schedules.length === 0) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = filterEventsByDate(schedules, dateStr, categoryFilter);
    
    setFilteredEvents(filtered);
    setSelectedDateEvents(filtered);
  }, [selectedDate, categoryFilter, schedules]);

  // 이전달 이동 핸들러
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 다음달 이동 핸들러
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 뒤로 가기 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 일정 추가 모달 닫기 핸들러
  const handleCloseAddEventModal = () => {
    setAddEventModalOpen(false);
  };

  // 새 일정의 값 변경 핸들러
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // 타입이 변경되면 카테고리도 동일한 값으로 설정
      if (name === 'type') {
        updated.category = value;
      }
      
      return updated;
    });
  };

  // 새 일정 저장 핸들러
  const handleSaveNewEvent = () => {
    if (!newEvent.title.trim()) return;
    
    // 저장 알림
    alert('일정이 저장되었습니다: ' + newEvent.title);
    
    // 새 일정 생성
    const newSchedule = {
      id: Date.now(),
      ...newEvent,
      date: newEvent.startDate // date 필드는 startDate 값으로 설정
    };
    
    // 일정 목록에 추가
    setSchedules(prev => {
      const updated = [...prev, newSchedule];
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });
    
    // 모달 닫기
    setAddEventModalOpen(false);
  };

  // 모달 닫기 핸들러
  const handleCloseEventModal = () => {
    setEventModalOpen(false);
  };

  // 개인 일정 삭제 핸들러
  const handleDeletePersonalTodo = (id) => {
    // 삭제 전 확인
    if (!window.confirm('일정을 삭제하시겠습니까?')) {
      return; // 취소하면 함수 종료
    }
    
    alert('일정이 삭제되었습니다(ID: ' + id + ')');
    setSchedules(prev => {
      const updated = prev.filter(schedule => schedule.id !== id);
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });
  };

  // 일정 수정 모달 열기
  const handleOpenEditModal = (event) => {
    setEditEvent(event);
    setEditEventModalOpen(true);
  };

  // 일정 수정 모달 닫기
  const handleCloseEditModal = () => {
    setEditEventModalOpen(false);
    setEditEvent(null);
  };

  // 수정 중인 일정 값 변경 핸들러
  const handleEditEventChange = (e) => {
    const { name, value } = e.target;
    setEditEvent(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // 타입이 변경되면 카테고리도 동일한 값으로 설정
      if (name === 'type') {
        updated.category = value;
      }
      
      return updated;
    });
  };

  // 일정 수정 저장 핸들러
  const handleSaveEditEvent = () => {
    if (!editEvent || !editEvent.title.trim()) return;

    alert('일정이 수정되었습니다: ' + editEvent.title);

    // 수정된 일정으로 업데이트
    setSchedules(prev => {
      const updated = prev.map(item => 
        item.id === editEvent.id ? { ...editEvent, date: editEvent.startDate } : item
      );
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });

    // 모달 닫기
    setEditEventModalOpen(false);
  };

  // 셀 클릭 핸들러
  const onDateClick = (clickedDay) => {
    const dateStr = format(clickedDay, 'yyyy-MM-dd');
    
    // 선택한 날짜 업데이트
    setSelectedDate(clickedDay);
    
    // 현재 월을 선택한 날짜의 월로 변경
    const firstDayOfMonth = new Date(clickedDay.getFullYear(), clickedDay.getMonth(), 1);
    setCurrentMonth(firstDayOfMonth);
    
    // 필터링된 일정 업데이트
    const dayEvents = filterEventsByDate(schedules, dateStr, categoryFilter);
    setFilteredEvents(dayEvents);
    setSelectedDateEvents(dayEvents);
  };

  // 더 많은 이벤트 모달 표시
  const showMoreEvents = (events) => {
    setSelectedDateEvents(events);
    setEventModalOpen(true);
  };

  // 일정 추가 모달 열기
  const handleOpenAddEventModal = (defaultEvent) => {
    setNewEvent(defaultEvent);
    setAddEventModalOpen(true);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Container maxWidth="lg" sx={myPageStyles.container}>
      <PageHeader onBack={handleBack} />
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Paper sx={myPageStyles.calendarPaper}>
          <Calendar 
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            schedules={schedules}
            categoryFilter={categoryFilter}
            categories={categories}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onDateClick={onDateClick}
            showMoreEvents={showMoreEvents}
            onCategoryFilterChange={setCategoryFilter}
            onAddEvent={handleOpenAddEventModal}
          />
        </Paper>

        <TodoList 
          schedules={schedules}
          onEditEvent={handleOpenEditModal}
          onDeleteEvent={handleDeletePersonalTodo}
          onDateClick={onDateClick}
        />
      </Box>

      <DailyEvents 
        selectedDate={selectedDate}
        filteredEvents={filteredEvents}
        onAddEvent={handleOpenAddEventModal}
        onEditEvent={handleOpenEditModal}
        onDateClick={onDateClick}
      />

      {/* 모달 컴포넌트들 */}
      <EventModal 
        isOpen={eventModalOpen}
        onClose={handleCloseEventModal}
        events={selectedDateEvents}
        onEditEvent={handleOpenEditModal}
        onDateClick={onDateClick}
      />

      <AddEventModal 
        isOpen={addEventModalOpen}
        onClose={handleCloseAddEventModal}
        newEvent={newEvent}
        onChange={handleNewEventChange}
        onSave={handleSaveNewEvent}
        categories={categories}
      />

      <EditEventModal 
        isOpen={editEventModalOpen}
        onClose={handleCloseEditModal}
        editEvent={editEvent}
        onChange={handleEditEventChange}
        onSave={handleSaveEditEvent}
        categories={categories}
      />
    </Container>
  );
};

export default MyPage;
