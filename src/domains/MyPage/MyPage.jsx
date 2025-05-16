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
  const [categories] = useState(['전체', '회사', '팀', '개인', 'TODO']);
  
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
    // 현재 날짜와 달 정보 얻기
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11 (0: 1월, 11: 12월)
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    
    // 날짜 생성 헬퍼 함수
    const getDateStr = (day) => `${currentYear}-${formattedMonth}-${String(day).padStart(2, '0')}`;
    
    // 임시 데이터 생성
    const dummySchedules = [
      // 회사 일정
      { 
        id: 1, 
        date: getDateStr(5), 
        startDate: getDateStr(5), 
        endDate: getDateStr(5), 
        title: '월간 팀 회의', 
        category: '회사', 
        type: '회사',
        displayInCalendar: true
      },
      { 
        id: 2, 
        date: getDateStr(12), 
        startDate: getDateStr(12), 
        endDate: getDateStr(12), 
        title: '분기별 실적 보고 미팅', 
        category: '회사', 
        type: '회사',
        displayInCalendar: true
      },
      { 
        id: 3, 
        date: getDateStr(20), 
        startDate: getDateStr(20), 
        endDate: getDateStr(22), 
        title: '신규 프로젝트 기획', 
        category: '회사', 
        type: '회사',
        displayInCalendar: true
      },
      { 
        id: 4, 
        date: getDateStr(25), 
        startDate: getDateStr(25), 
        endDate: getDateStr(25), 
        title: '경영진 미팅', 
        category: '회사', 
        type: '회사',
        displayInCalendar: true
      },
      
      // 팀 일정
      { 
        id: 5, 
        date: getDateStr(7), 
        startDate: getDateStr(7), 
        endDate: getDateStr(7), 
        title: '팀 주간 스크럼', 
        category: '팀', 
        type: '팀',
        displayInCalendar: true
      },
      { 
        id: 6, 
        date: getDateStr(14), 
        startDate: getDateStr(14), 
        endDate: getDateStr(14), 
        title: '팀 주간 스크럼', 
        category: '팀', 
        type: '팀',
        displayInCalendar: true
      },
      { 
        id: 7, 
        date: getDateStr(21), 
        startDate: getDateStr(21), 
        endDate: getDateStr(21), 
        title: '팀 주간 스크럼', 
        category: '팀', 
        type: '팀',
        displayInCalendar: true
      },
      { 
        id: 8, 
        date: getDateStr(28), 
        startDate: getDateStr(28), 
        endDate: getDateStr(28), 
        title: '팀 프로젝트 리뷰', 
        category: '팀', 
        type: '팀',
        displayInCalendar: true
      },
      
      // 개인 일정 (할일) - 캘린더에 표시 안됨
      { 
        id: 101, 
        date: getDateStr(4), 
        startDate: getDateStr(4), 
        endDate: getDateStr(4), 
        title: '주간 업무 계획 작성', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 102, 
        date: getDateStr(6), 
        startDate: getDateStr(6), 
        endDate: getDateStr(7), 
        title: '프로젝트 문서 정리', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 103, 
        date: getDateStr(10), 
        startDate: getDateStr(10), 
        endDate: getDateStr(10), 
        title: '이메일 정리하기', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 104, 
        date: getDateStr(13), 
        startDate: getDateStr(13), 
        endDate: getDateStr(15), 
        title: '웹 개발 강의 수강', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 105, 
        date: getDateStr(18), 
        startDate: getDateStr(18), 
        endDate: getDateStr(18), 
        title: '월간 개인 목표 점검', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 106, 
        date: format(today, 'yyyy-MM-dd'),
        startDate: format(today, 'yyyy-MM-dd'),
        endDate: format(today, 'yyyy-MM-dd'),
        title: '오늘의 할일 작성', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      { 
        id: 107, 
        date: format(addDays(today, 1), 'yyyy-MM-dd'),
        startDate: format(addDays(today, 1), 'yyyy-MM-dd'),
        endDate: format(addDays(today, 2), 'yyyy-MM-dd'),
        title: '프로젝트 자료 조사', 
        category: '개인', 
        type: '개인',
        isTodo: true,
        displayInCalendar: false
      },
      
      // 개인 일정 (일반 일정)
      { 
        id: 201, 
        date: getDateStr(8), 
        startDate: getDateStr(8), 
        endDate: getDateStr(8), 
        title: '영어 스터디', 
        category: '개인', 
        type: '개인',
        isTodo: false,
        displayInCalendar: true
      },
      { 
        id: 202, 
        date: getDateStr(15), 
        startDate: getDateStr(15), 
        endDate: getDateStr(15), 
        title: '영어 스터디', 
        category: '개인', 
        type: '개인',
        isTodo: false,
        displayInCalendar: true
      },
      { 
        id: 203, 
        date: getDateStr(22), 
        startDate: getDateStr(22), 
        endDate: getDateStr(22), 
        title: '영어 스터디', 
        category: '개인', 
        type: '개인',
        isTodo: false,
        displayInCalendar: true
      },
      { 
        id: 204, 
        date: getDateStr(29), 
        startDate: getDateStr(29), 
        endDate: getDateStr(29), 
        title: '영어 스터디', 
        category: '개인', 
        type: '개인',
        isTodo: false,
        displayInCalendar: true
      },
      { 
        id: 205, 
        date: getDateStr(16), 
        startDate: getDateStr(16), 
        endDate: getDateStr(16), 
        title: '건강검진 예약', 
        category: '개인', 
        type: '개인',
        isTodo: false,
        displayInCalendar: true
      },
      
      // 할일에서 캘린더에 추가된 일정 (TODO 카테고리)
      { 
        id: 301, 
        date: getDateStr(10), 
        startDate: getDateStr(10), 
        endDate: getDateStr(10), 
        title: '이메일 정리하기', 
        category: 'TODO', 
        type: 'TODO',
        isTodo: true,
        originalTodoId: 103,
        displayInCalendar: true
      },
      { 
        id: 302, 
        date: getDateStr(18), 
        startDate: getDateStr(18), 
        endDate: getDateStr(18), 
        title: '월간 개인 목표 점검', 
        category: 'TODO', 
        type: 'TODO',
        isTodo: true,
        originalTodoId: 105,
        displayInCalendar: true
      }
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
    
    setSchedules(prev => {
      // 캘린더에 추가된 관련 TODO 항목 찾기 (originalTodoId가 현재 삭제하려는 id와 일치하는 항목)
      const hasRelatedCalendarItem = prev.some(item => item.originalTodoId === id && item.type === 'TODO');
      
      // 관련 캘린더 항목이 있으면 알림
      if (hasRelatedCalendarItem) {
        alert('내 할일과 관련된 캘린더 항목도 함께 삭제됩니다.');
      } else {
        alert('일정이 삭제되었습니다(ID: ' + id + ')');
      }
      
      // 삭제할 할일과 관련된 캘린더 항목도 함께 삭제
      const updated = prev.filter(schedule => 
        schedule.id !== id && !(schedule.originalTodoId === id && schedule.type === 'TODO')
      );
      
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });
  };

  // 할일을 일정표에 추가하는 핸들러
  const handleAddTodoToCalendar = (todo) => {
    if (!todo) return;
    
    // 이미 일정에 있는지 확인
    const todoInCalendar = schedules.find(
      event => event.originalTodoId === todo.id && event.type === 'TODO'
    );
    
    if (todoInCalendar) {
      alert('이미 일정에 추가된 할일입니다.');
      return;
    }
    
    // 할일을 새로운 TODO 타입 일정으로 복제하여 추가
    const todoForCalendar = {
      ...todo,
      id: Date.now(), // 새로운 ID 부여
      originalTodoId: todo.id, // 원본 할일 ID 저장
      isTodo: true,
      category: 'TODO', 
      type: 'TODO',
      displayInCalendar: true
    };
    
    // 일정 목록에 새 TODO 추가
    setSchedules(prev => {
      const updated = [...prev, todoForCalendar];
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });
    
    alert('내 할일이 일정표에 추가되었습니다.');
  };

  // 할일을 일정표에서 제거하는 핸들러
  const handleRemoveTodoFromCalendar = (originalTodoId) => {
    if (!originalTodoId) return;
    
    // 삭제 전 확인
    if (!window.confirm('이 할일을 일정표에서 제거하시겠습니까?')) {
      return;
    }
    
    // 해당 원본 할일 ID를 가진 TODO 타입 항목 제거
    setSchedules(prev => {
      const updated = prev.filter(
        item => !(item.originalTodoId === originalTodoId && item.type === 'TODO')
      );
      // localStorage에 저장
      localStorage.setItem('schedules', JSON.stringify(updated));
      return updated;
    });
    
    alert('할일이 일정표에서 제거되었습니다.');
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
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
        <Paper sx={{ ...myPageStyles.calendarPaper, flex: 2 }}>
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

        <Box sx={{ flex: 1 }}>
          <TodoList 
            schedules={schedules}
            onEditEvent={handleOpenEditModal}
            onDeleteEvent={handleDeletePersonalTodo}
            onDateClick={onDateClick}
            onAddToCalendar={handleAddTodoToCalendar}
            onRemoveFromCalendar={handleRemoveTodoFromCalendar}
          />
        </Box>
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
