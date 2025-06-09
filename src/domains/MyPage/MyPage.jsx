import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { LoginContext } from "../../contexts/LoginContextProvider";
import Calendar from "./components/Calendar";
import TodoList from "./components/TodoList";
import api from "../../apis/api";

const MyPage = () => {
  const { userInfo } = React.useContext(LoginContext);
  const [schedules, setSchedules] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 일정 데이터 가져오기
        const schedulesResponse = await api.get(`/api/schedules/user/${userInfo.id}`);
        setSchedules(schedulesResponse.data);

        // 할 일 데이터 가져오기
        const todosResponse = await api.get(`/api/todos/user/${userInfo.id}`);
        setTodos(todosResponse.data);

        setError(null);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("데이터 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchData();
    }
  }, [userInfo?.id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 600,
            }}
          >
            <Calendar schedules={schedules} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 600,
            }}
          >
            <TodoList schedules={schedules} todos={todos} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyPage;
