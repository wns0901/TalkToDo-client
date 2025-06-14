import React, { useState } from "react";
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
  Tooltip,
  Menu,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { myPageStyles } from "../css/MyPage.styles";
import { format } from "date-fns";
import * as todoApi from "../../../apis/todo";
import Cookies from "js-cookie";
import { addTodoToCalendar, removeTodoFromCalendar } from '../../../apis/schedule';

/**
 * 개인 할일 목록을 표시하는 컴포넌트
 */
const TodoList = ({
  todos,
  onEditEvent,
  onDeleteEvent,
  onDateClick,
  onAddToCalendar,
  onRemoveFromCalendar,
  onDataChanged,
  userInfo,
  onEditTodo,
  setTodos,
}) => {
  const [activeTodoModalOpen, setActiveTodoModalOpen] = useState(false);
  const [completedTodoModalOpen, setCompletedTodoModalOpen] = useState(false);

  // 할일 추가 모달 상태
  const [addTodoModalOpen, setAddTodoModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
    type: "TODO",
    isTodo: false,
    addedToMyTodo: false,
    status: "PENDING",
  });

  // 더보기 메뉴 상태
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [menuTodoId, setMenuTodoId] = useState(null);

  // 할일 수정 모달 상태
  const [editTodoModalOpen, setEditTodoModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

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
  const handleToggleComplete = async (todo, e) => {
    e.stopPropagation();
    console.log('체크박스 클릭됨:', todo);
    try {
      console.log('API 호출 전 상태:', todo.status);
      await todoApi.toggleTodoComplete(todo.id);
      console.log('API 호출 성공');
      setTodos && setTodos((prev) => {
        console.log('이전 todos:', prev);
        const next = prev.map(item =>
          item.id === todo.id ? { ...item, status: "COMPLETED" } : item
        );
        console.log('업데이트된 todos:', next);
        return next;
      });
      if (onDataChanged) onDataChanged();
    } catch (e) {
      console.error('완료 상태 변경 실패:', e);
      alert("완료 상태 변경에 실패했습니다.");
    }
  };

  /**
   * 완료된 할일 복구 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleRestoreTodo = async (todo, e) => {
    e.stopPropagation();
    try {
      await todoApi.restoreTodo(todo.id);
      setTodos && setTodos((prev) =>
        prev.map(item =>
          item.id === todo.id ? { ...item, status: "PENDING" } : item
        )
      );
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert("할일 복구에 실패했습니다.");
    }
  };

  /**
   * 일정에 추가 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleAddToCalendar = async (todo, e) => {
    e.stopPropagation();
    try {
      const token = Cookies.get('accessToken');
      const data = {
        startDate: todo.startDate,
        endDate: todo.dueDate,
        startTime: todo.startTime || '09:00:00',
        endTime: todo.endTime || '10:00:00',
        location: todo.location || '',
        description: todo.description || '',
        displayInCalendar: true
      };
      await addTodoToCalendar(todo.id, data, token);
      setTodos && setTodos((prev) =>
        prev.map(item =>
          item.id === todo.id ? { ...item, schedule: true } : item
        )
      );
      if (typeof onDataChanged === 'function') {
        onDataChanged();
      }
    } catch (e) {
      alert("일정에 추가 실패");
    }
  };

  /**
   * 할일이 이미 일정표에 추가되었는지 확인하는 함수
   * @param {number|string} todoId - 확인할 할일 ID
   * @returns {boolean} - 일정표에 추가된 경우 true, 아니면 false
   */
  const isTodoAddedToCalendar = (todo) => !!todo.schedule;

  /**
   * 일정에서 제거 핸들러
   * @param {Object} todo - 할일 객체
   */
  const handleRemoveFromCalendar = async (todo, e) => {
    e.stopPropagation();
    const targetId = todo.originalTodoId || todo.id;
    try {
      const token = Cookies.get('accessToken');
      await removeTodoFromCalendar(targetId, token);
      setTodos && setTodos((prev) =>
        prev.map(item =>
          item.id === todo.id ? { ...item, schedule: false } : item
        )
      );
      if (typeof onDataChanged === "function") {
        onDataChanged();
      }
    } catch (e) {
      alert("일정에서 제거 실패");
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
      title: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      type: "TODO",
      isTodo: false,
      addedToMyTodo: false,
      status: "PENDING",
    });
  };

  /**
   * 새 할일 입력값 변경 핸들러
   */
  const handleNewTodoChange = (e) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * 새 할일 저장 핸들러 (API 연동)
   */
  const handleSaveTodo = async () => {
    if (!newTodo.title.trim()) return;
    try {
      const todoData = {
        title: newTodo.title,
        meeting: newTodo.meeting ? { id: newTodo.meeting.id } : undefined,
        type: newTodo.type || 'TODO',
        startDate: newTodo.startDate,
        dueDate: newTodo.endDate,
        assigneeId: userInfo.id,
        status: newTodo.status || 'PENDING',
        addedToMyTodo: true,
        isSchedule: newTodo.isSchedule || false
      };
      const createdTodo = await todoApi.createTodo(todoData);
      console.log('createdTodo:', createdTodo);
      setTodos && setTodos((prev) => {
        const next = [...prev, createdTodo.data || createdTodo];
        console.log('next todos:', next);
        return next;
      });
      alert("할일이 추가되었습니다: " + newTodo.title);
      handleCloseAddTodoModal();
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert("할일 추가에 실패했습니다.");
    }
  };

  /**
   * 할일 삭제 핸들러 (API 연동)
   * @param {Object} todo - 할일 객체
   */
  const handleDeleteTodo = async (todo) => {
    try {
      await todoApi.deleteTodo(todo.id);
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert("할일 삭제에 실패했습니다.");
    }
  };

  /**
   * 할일 수정 핸들러 (API 연동)
   * @param {Object} todo - 할일 객체
   */
  const handleEditTodo = async (todo) => {
    try {
      await todoApi.updateTodo(todo.id, todo);
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert("할일 수정에 실패했습니다.");
    }
  };

  // TODO만 필터링해서 날짜순으로 정렬 (중복 허용)
  const personalTodos = todos
    .filter((event) => event.type === "TODO")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  console.log('전체 할일 목록:', personalTodos);

  // 완료된 할일 목록
  const completedTodos = personalTodos.filter(todo => todo.status === "COMPLETED");
  console.log('완료된 할일 목록:', completedTodos);

  // 완료되지 않은 할일 목록
  const activeTodos = personalTodos.filter(todo => todo.status !== "COMPLETED");
  console.log('진행중인 할일 목록:', activeTodos);

  /**
   * 날짜 포맷팅 함수
   */
  const formatDateDisplay = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy.MM.dd");
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
        cursor: "pointer",
        flexDirection: "column",
        alignItems: "stretch",
        mb: 1,
        ...(isCompleted && { opacity: 0.7 }),
      }}
      onClick={() => handleTodoClick(todo)}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Checkbox
          checked={isCompleted}
          sx={myPageStyles.todoCheckbox}
          onClick={(e) => handleToggleComplete(todo, e)}
        />
        <ListItemText
          primary={
            <Box
              component="span"
              sx={isCompleted ? { textDecoration: "line-through" } : {}}
            >
              {todo.title}
            </Box>
          }
          sx={{
            "& .MuiTypography-root": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {!isCompleted && (
            <>
              {!isTodoAddedToCalendar(todo) ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    if (!todo.schedule) {
                      e.stopPropagation();
                      handleAddToCalendar(todo, e);
                    }
                  }}
                  sx={{ color: "#666" }}
                  aria-label="일정에 추가"
                >
                  <CalendarMonthIcon fontSize="small" />
                </IconButton>
              ) : (
                <Tooltip title="일정에서 제거">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      if (todo.schedule) {
                        e.stopPropagation();
                        handleRemoveFromCalendar(todo, e);
                      }
                    }}
                    sx={{ color: "#f44336" }}
                    aria-label="일정에서 제거"
                  >
                    <CalendarMonthIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                size="small"
                onClick={(e) => handleMenuOpen(e, todo.id)}
                sx={{ color: "#666" }}
                aria-label="더보기"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl) && menuTodoId === todo.id}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditMenuClick(todo);
                  }}
                >
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> 수정
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo);
                    handleMenuClose();
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> 삭제
                </MenuItem>
              </Menu>
            </>
          )}
          {isCompleted ? (
            <IconButton
              size="small"
              onClick={(e) => handleRestoreTodo(todo, e)}
              sx={{ color: "#666" }}
              aria-label="할일 복구"
            >
              <RestoreIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>
      </Box>
      <Box sx={{ pl: 4, mt: 1, fontSize: "0.8rem", color: "#666" }}>
        <Box component="span" sx={{ mr: 2 }}>
          시작일: {formatDateDisplay(todo.startDate)}
        </Box>
        <Box component="span">마감일: {formatDateDisplay(todo.dueDate)}</Box>
      </Box>
    </ListItem>
  );

  const handleMenuOpen = (event, todoId) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuTodoId(todoId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuTodoId(null);
  };

  // 더보기 메뉴에서 '수정' 클릭 시
  const handleEditMenuClick = (todo) => {
    setEditTodo(todo);
    setEditTodoModalOpen(true);
    handleMenuClose();
  };

  // 수정 모달에서 값 변경
  const handleEditTodoChange = (e) => {
    const { name, value } = e.target;
    setEditTodo((prev) => ({ ...prev, [name]: value }));
  };

  // 수정 저장
  const handleSaveEditTodo = async () => {
    if (!editTodo.title.trim()) return;
    try {
      const updateData = {
        title: editTodo.title,
        meeting: editTodo.meeting ? { id: editTodo.meeting.id } : undefined,
        assigneeId: userInfo.id,
        dueDate: editTodo.dueDate,
        status: editTodo.status || 'PENDING',
        addedToMyTodo: editTodo.addedToMyTodo || false,
        isSchedule: editTodo.isSchedule || false
      };
      await onEditTodo(editTodo.id, updateData);
      setTodos && setTodos((prev) =>
        prev.map(item =>
          item.id === editTodo.id ? { ...item, ...updateData } : item
        )
      );
      setEditTodoModalOpen(false);
      setEditTodo(null);
      if (onDataChanged) onDataChanged();
    } catch (e) {
      alert('할일 수정에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 내 할일 포스트잇 */}
      <Paper
        sx={{
          ...myPageStyles.todoPostit,
          maxHeight: "400px",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={myPageStyles.postitTitle}>
            내 할 일
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={handleOpenActiveTodoModal}
              sx={{
                color: "#3E1A11",
                bgcolor: "#f0f0f0",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
              aria-label="내 할일 확대해서 보기"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleOpenAddTodoModal}
              sx={{
                color: "#fff",
                bgcolor: "#3E1A11",
                "&:hover": { bgcolor: "#5E2A21" },
                boxShadow: 1,
              }}
              aria-label="할일 추가"
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List>
          {activeTodos.map((todo) => renderTodoItem(todo))}
          {activeTodos.length === 0 && (
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography color="text.secondary">할일이 없습니다.</Typography>
            </Box>
          )}
        </List>
      </Paper>

      {/* 완료된 할일 포스트잇 */}
      <Paper
        sx={{
          ...myPageStyles.todoPostit,
          maxHeight: "400px",
          overflow: "auto",
          backgroundColor: "#f8f8f8", // 약간 다른 색상으로 구분
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={myPageStyles.postitTitle}>
              완료된 할일
            </Typography>
            <Box
              component="span"
              sx={{
                ml: 1,
                backgroundColor: "#757575",
                color: "white",
                px: 1,
                py: 0.2,
                borderRadius: "12px",
                fontSize: "0.8rem",
              }}
            >
              {completedTodos.length}
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={handleOpenCompletedTodoModal}
            sx={{
              color: "#3E1A11",
              bgcolor: "#f0f0f0",
              "&:hover": { bgcolor: "#e0e0e0" },
            }}
            aria-label="완료된 할일 확대해서 보기"
          >
            <SearchIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List>
          {completedTodos.map((todo) => renderTodoItem(todo, true))}
          {completedTodos.length === 0 && (
            <Box sx={{ textAlign: "center", p: 2 }}>
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
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">내 할일 목록</Typography>
          <IconButton onClick={handleCloseActiveTodoModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {activeTodos.length > 0 ? (
            <Grid container spacing={2}>
              {activeTodos.map((todo) => (
                <Grid item xs={12} sm={6} key={todo.id}>
                  <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", minWidth: "80px" }}
                          >
                            시작일:
                          </Typography>
                          <Typography>
                            {formatDateDisplay(todo.startDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", minWidth: "80px" }}
                          >
                            마감일:
                          </Typography>
                          <Typography>
                            {formatDateDisplay(todo.endDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        {!isTodoAddedToCalendar(todo) ? (
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
                            handleEditTodo(todo);
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
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", p: 2 }}
            >
              진행 중인 할일이 없습니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleOpenAddTodoModal}
            variant="contained"
            sx={{ bgcolor: "#3E1A11", "&:hover": { bgcolor: "#5E2A21" } }}
          >
            새 할일 추가
          </Button>
          <Button
            onClick={handleCloseActiveTodoModal}
            sx={{ color: "#757575" }}
          >
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
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">완료된 할일 목록</Typography>
          <IconButton onClick={handleCloseCompletedTodoModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {completedTodos.length > 0 ? (
            <Grid container spacing={2}>
              {completedTodos.map((todo) => (
                <Grid item xs={12} sm={6} key={todo.id}>
                  <Paper
                    elevation={2}
                    sx={{ p: 2, opacity: 0.7, height: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            textDecoration: "line-through",
                          }}
                        >
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
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", minWidth: "80px" }}
                          >
                            시작일:
                          </Typography>
                          <Typography>
                            {formatDateDisplay(todo.startDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", mb: 1 }}>
                          <Typography
                            sx={{ fontWeight: "bold", minWidth: "80px" }}
                          >
                            마감일:
                          </Typography>
                          <Typography>
                            {formatDateDisplay(todo.endDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
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
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", p: 2 }}
            >
              완료된 할일이 없습니다.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseCompletedTodoModal}
            sx={{ color: "#757575" }}
          >
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
        <DialogTitle
          sx={{
            bgcolor: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              helperText={
                !newTodo.title && addTodoModalOpen ? "제목을 입력해주세요" : ""
              }
            />

            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
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
          <Button onClick={handleCloseAddTodoModal} sx={{ color: "#757575" }}>
            취소
          </Button>
          <Button
            onClick={handleSaveTodo}
            variant="contained"
            sx={{ bgcolor: "#3E1A11", "&:hover": { bgcolor: "#5E2A21" } }}
            disabled={
              !newTodo.title ||
              new Date(newTodo.endDate) < new Date(newTodo.startDate)
            }
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 할일 수정 모달 */}
      <Dialog
        open={editTodoModalOpen}
        onClose={() => setEditTodoModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>할일 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="할일 제목"
            name="title"
            value={editTodo?.title || ''}
            onChange={handleEditTodoChange}
            fullWidth
            required
            margin="normal"
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
            <TextField
              label="시작일"
              name="startDate"
              type="date"
              value={editTodo?.startDate || ''}
              onChange={handleEditTodoChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="마감일"
              name="dueDate"
              type="date"
              value={editTodo?.dueDate || ''}
              onChange={handleEditTodoChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditTodoModalOpen(false)} color="inherit">취소</Button>
          <Button onClick={handleSaveEditTodo} variant="contained" color="primary">저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList;
