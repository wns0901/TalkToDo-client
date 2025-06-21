import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Checkbox,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../../apis/baseApi";

const SetToListModal = ({ setToList, onClose }) => {
  const [peopleList, setPeopleList] = useState([]);
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [search, setSearch] = useState("");
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get("api/users");
      const data = res.data;
      setPeopleList(data);
      setCheckedList(data.map((p) => !!p.checked));
    })();
  }, []);

  // 체크박스 토글
  const handleToggle = (idx) => {
    const newChecked = [...checkedList];
    newChecked[idx] = !newChecked[idx];
    setCheckedList(newChecked);
    // setToList와 onClose는 아래 버튼에서 호출
  };

  // 검색/필터링
  const filteredPeople = peopleList.filter(
    (p) =>
      (!company || p.company === company) &&
      (!department || p.department === department) &&
      (!search || p.name.includes(search))
  );

  return (
    <Box sx={{ width: 350, bgcolor: "#fff", p: 2 }}>
      {/* 상단 필터/검색 */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 90 }}>
          <InputLabel>회사명</InputLabel>
          <Select
            value={company}
            label="회사명"
            onChange={(e) => setCompany(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {[...new Set(peopleList.map((p) => p.company))].map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 90 }}>
          <InputLabel>부서명</InputLabel>
          <Select
            value={department}
            label="부서명"
            onChange={(e) => setDepartment(e.target.value)}
          >
            <MenuItem value="">전체</MenuItem>
            {[...new Set(peopleList.map((p) => p.department))].map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 60 }}
        />
        <IconButton>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* 체크박스 리스트 */}
      <List>
        {filteredPeople.map((person) => (
          <ListItem key={person.id} disablePadding>
            <ListItemText
              primary={
                person.position
                  ? `${person.name} ${person.position}`
                  : person.name
              }
            />
            <ListItemSecondaryAction>
              <Checkbox
                checked={checkedList[person.id - 1] || false}
                onChange={() => handleToggle(person.id - 1)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => {
          setToList(peopleList.filter((_, i) => checkedList[i]));
          if (onClose) onClose();
        }}
      >
        선택 완료
      </Button>
    </Box>
  );
};

export default SetToListModal;
