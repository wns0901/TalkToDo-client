import React, { useState, useEffect } from "react";
import { Box, Container, Paper } from "@mui/material";
import { format, addMonths, subMonths, addDays } from "date-fns";
import { myPageStyles } from "./css/MyPage.styles";
import api from "../../apis/baseApi";
import { useLogin } from "../../contexts/LoginContextProvider";
import Cookies from "js-cookie";
import * as todoApi from "../../apis/todo";
import * as scheduleApi from "../../apis/schedule";
import * as categoryApi from "../../apis/category";
import { useNavigate } from "react-router-dom";

// 분리된 컴포넌트들 가져오기
import Calendar from "./components/Calendar";
import TodoList from "./components/TodoList";
import DailyEvents from "./components/DailyEvents";
import {
  EventModal,
  AddEventModal,
  EditEventModal,
  CategoryModal,
} from "./components/Modals";
import { PageHeader, LoadingView, ErrorView } from "./components/Common";
import { filterEventsByDate } from "./js/utils";

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
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);

  // 필터 상태
  const [categoryFilter, setCategoryFilter] = useState("전체");

  // 카테고리 관리
  const [categories, setCategories] = useState([]);

  // 모달 상태
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);

  // 일정 추가 모달 상태
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(today, "yyyy-MM-dd"),
    startDate: format(today, "yyyy-MM-dd"),
    endDate: format(today, "yyyy-MM-dd"),
    category: "PERSONAL",
    type: "PERSONAL",
    startTime: "09:00",  // 기본 시작 시간
    endTime: "10:00"     // 기본 종료 시간
  });

  // 일정 수정 모달 상태
  const [editEventModalOpen, setEditEventModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // 카테고리 모달 상태 추가
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // 선택된 날짜의 일정
  const [filteredEvents, setFilteredEvents] = useState([]);

  const { userInfo, loginCheck } = useLogin();
  const navigate = useNavigate();

  // 한글-영어 카테고리 매핑
  const CATEGORY_KO_TO_EN = {
    "회사": "COMPANY",
    "팀": "TEAM",
    "개인": "PERSONAL",
    "할일": "TODO",
    "전체": "전체"
  };
  const CATEGORY_EN_TO_KO = {
    "COMPANY": "회사",
    "TEAM": "팀",
    "PERSONAL": "개인",
    "TODO": "할일",
    "전체": "전체"
  };

  // 일정/할일 데이터 모두 불러오기
  const fetchAllData = async () => {
    if (!userInfo?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [schedulesRes, todosRes, categoriesRes] = await Promise.all([
        scheduleApi.getSchedulesByUser(userInfo.id),
        todoApi.getTodosByUser(userInfo.id),
        categoryApi.getCategories(userInfo.id)
      ]);
      const merged = [...schedulesRes.data, ...todosRes.data];
      const uniqueSchedules = merged.filter(
        (item, idx, arr) => arr.findIndex(e => e.id === item.id) === idx
      );
      setSchedules(uniqueSchedules);
      setCategories(["전체", ...categoriesRes.data]);
      setLoading(false);
    } catch (err) {
      setError("데이터를 불러오지 못했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (userInfo === undefined || userInfo === null) {
      setLoading(true);
      return;
    }
    if (!userInfo.id || !accessToken) {
      setError("로그인 정보 또는 토큰이 올바르지 않습니다.");
      setLoading(false);
      return;
    }
    fetchAllData();
  }, [userInfo]);

  // 컴포넌트 마운트 시 한 번만 실행되는 useEffect 추가
  useEffect(() => {
    loginCheck();
  }, []); // 빈 의존성 배열

  // 날짜 또는 필터가 변경될 때 일정 필터링
  useEffect(() => {
    if (!selectedDate || schedules.length === 0) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
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

  // 일정 추가 모달 닫기 핸들러
  const handleCloseAddEventModal = () => {
    setAddEventModalOpen(false);
  };

  // 새 일정의 값 변경 핸들러
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // 타입이 변경되면 카테고리도 동일한 값으로 설정
      if (name === "type") {
        updated.category = value;
      }

      return updated;
    });
  };

  // 새 일정 저장 핸들러
  const handleSaveNewEvent = async () => {
    if (!newEvent.title.trim()) return;
    
    const accessToken = Cookies.get("accessToken");
    
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      // 백엔드 요구사항에 맞는 형식으로 데이터 구성
      const scheduleData = {
        title: newEvent.title,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
        category: newEvent.type,  // type을 category로 사용
        type: newEvent.type,      // Chip 표시를 위해 type 필드도 추가
        startTime: (newEvent.startTime || "09:00") + ":00",  // 기본값 설정
        endTime: (newEvent.endTime || "10:00") + ":00",      // 기본값 설정
        location: newEvent.location,
        displayInCalendar: true // 캘린더에 바로 표시
      };
      console.log('[일정 추가] 서버로 보내는 데이터:', scheduleData);
      // 백엔드 API 호출
      const response = await scheduleApi.createSchedule(scheduleData);
      
      alert("일정이 추가되었습니다: " + newEvent.title);
      setAddEventModalOpen(false);
      fetchAllData();
    } catch (e) {
      if (e.response?.status === 403) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("일정 추가에 실패했습니다.");
      }
    }
  };

  // 모달 닫기 핸들러
  const handleCloseEventModal = () => {
    setEventModalOpen(false);
  };

  // 개인 일정 삭제 핸들러
  const handleDeletePersonalTodo = (id) => {
    if (!window.confirm("할일을 삭제하시겠습니까?")) {
      return;
    }
    setSchedules((prev) => {
      // id와 type이 모두 일치하는 TODO만 삭제
      const updated = prev.filter(
        (schedule) => !(schedule.id === id && (schedule.type === "TODO" || schedule.category === "TODO"))
      );
      localStorage.setItem("schedules", JSON.stringify(updated));
      return updated;
    });
  };

  // 할일을 일정표에 추가하는 핸들러
  const handleAddTodoToCalendar = (todo) => {
    if (!todo) return;

    // 이미 일정에 있는지 확인
    const todoInCalendar = schedules.find(
      (event) => event.originalTodoId === todo.id && event.type === "TODO"
    );

    if (todoInCalendar) {
      alert("이미 일정에 추가된 할일입니다.");
      return;
    }

    // 할일을 새로운 TODO 타입 일정으로 복제하여 추가
    const todoForCalendar = {
      ...todo,
      id: Date.now(), // 새로운 ID 부여
      originalTodoId: todo.id, // 원본 할일 ID 저장
      isTodo: true,
      category: "TODO",
      type: "TODO",
      displayInCalendar: true,
    };

    // 일정 목록에 새 TODO 추가
    setSchedules((prev) => {
      const updated = [...prev, todoForCalendar];
      // localStorage에 저장
      localStorage.setItem("schedules", JSON.stringify(updated));
      return updated;
    });

    alert("내 할일이 일정표에 추가되었습니다.");
  };

  // 할일을 일정표에서 제거하는 핸들러
  const handleRemoveTodoFromCalendar = (originalTodoId) => {
    if (!originalTodoId) return;

    // 삭제 전 확인
    if (!window.confirm("이 할일을 일정표에서 제거하시겠습니까?")) {
      return;
    }

    // 해당 원본 할일 ID를 가진 TODO 타입 항목 제거
    setSchedules((prev) => {
      const updated = prev.filter(
        (item) =>
          !(item.originalTodoId === originalTodoId && item.type === "TODO")
      );
      // localStorage에 저장
      localStorage.setItem("schedules", JSON.stringify(updated));
      return updated;
    });

    alert("할일이 일정표에서 제거되었습니다.");
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
    setEditEvent((prev) => {
      let newValue = value;
      if (name === "category" || name === "type") {
        // 한글로 들어오면 영어로 변환
        newValue = CATEGORY_KO_TO_EN[value] || value;
      }
      const updated = {
        ...prev,
        [name]: newValue,
      };
      // 타입이 변경되면 카테고리도 동일하게 맞춤
      if (name === "type") {
        updated.category = newValue;
      }
      return updated;
    });
  };

  // 일정 수정 저장 핸들러
  const handleSaveEditEvent = async () => {
    if (!editEvent || !editEvent.title.trim()) return;
    try {
      const updateData = {
        title: editEvent.title,
        startDate: editEvent.startDate,
        endDate: editEvent.endDate,
        category: editEvent.category,
        type: editEvent.type,
        startTime: editEvent.startTime,
        endTime: editEvent.endTime,
        location: editEvent.location,
        displayInCalendar: true,
      };
      console.log('[일정 수정] 서버로 보내는 데이터:', updateData);
      await scheduleApi.updateSchedule(editEvent.id, updateData);
      setEditEventModalOpen(false);
      fetchAllData();
    } catch (e) {
      alert('일정 수정에 실패했습니다.');
    }
  };

  // 셀 클릭 핸들러
  const onDateClick = (clickedDay) => {
    const dateStr = format(clickedDay, "yyyy-MM-dd");

    // 선택한 날짜 업데이트
    setSelectedDate(clickedDay);

    // 현재 월을 선택한 날짜의 월로 변경
    const firstDayOfMonth = new Date(
      clickedDay.getFullYear(),
      clickedDay.getMonth(),
      1
    );
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

  // 카테고리 추가 핸들러
  const handleAddCategory = async (newCategory) => {
    if (!userInfo?.id) return;
    try {
      await categoryApi.addCategory(userInfo.id, newCategory);
      fetchAllData();
    } catch (err) {
      alert("카테고리 추가에 실패했습니다.");
    }
  };

  // 카테고리 삭제 핸들러
  const handleDeleteCategory = async (category) => {
    if (!userInfo?.id) return;
    try {
      await categoryApi.deleteCategory(userInfo.id, category);
      fetchAllData();
    } catch (err) {
      alert("카테고리 삭제에 실패했습니다.");
    }
  };

  // 카테고리 모달 닫기 핸들러
  const handleCloseCategoryModal = () => {
    setCategoryModalOpen(false);
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Container maxWidth="lg" sx={myPageStyles.container}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 2,
        }}
      >
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
            onDataChanged={fetchAllData}
            userInfo={userInfo}
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

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={handleCloseCategoryModal}
        categories={categories}
        newCategory={newCategory}
        onCategoryChange={setNewCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onCategoryFilterChange={setCategoryFilter}
      />
    </Container>
  );
};

export default MyPage;
