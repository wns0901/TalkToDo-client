import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { getMeetingNotes, updateMeetingNotes } from "../apis/api";

/**
 * 회의록 섹션 타입
 */
const SECTION_TYPES = {
  TITLE: "title",
  SUMMARY: "summary",
};

/**
 * 회의록 탭 컴포넌트
 */
const MeetingNotesTab = ({ meetingId = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({
    title: "",
    summary: "",
    id: "",
  });

  const [isEditing, setIsEditing] = useState({
    title: false,
    summary: false,
  });

  const [editedNotes, setEditedNotes] = useState({
    title: "",
    summary: "",
    id: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchMeetingNotes(meetingId);
  }, [meetingId]);

  const fetchMeetingNotes = (id) => {
    setLoading(true);
    getMeetingNotes(id)
      .then((data) => {
        // API 응답 데이터 구조에 맞게 수정
        const notesData = data || {
          title: "",
          summary: "",
          id: "",
        };
        setNotes(notesData);
        setEditedNotes(notesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notes:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  /**
   * 편집 모드로 전환합니다.
   */
  const handleEdit = (section) => {
    setIsEditing((prev) => ({ ...prev, [section]: true }));
  };

  const handleSave = (section) => {
    updateMeetingNotes(notes.id, { [section]: editedNotes[section] })
      .then((data) => {

        const notesData = {
          title: data.title,
          summary: data.content,
          id: data.id,
        };

        setNotes(notesData);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
        showSnackbar("저장되었습니다.", "success");
      })
      .catch((err) => {
        showSnackbar(`저장 실패: ${err.message}`, "error");
      });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleNoteChange = (section, value) => {
    setEditedNotes((prev) => ({ ...prev, [section]: value }));
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <Box sx={{ p: 3, bgcolor: "background.paper" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          회의록
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <NotesSection
        title="회의 주제"
        type={SECTION_TYPES.TITLE}
        content={notes.title}
        editedContent={editedNotes.title}
        isEditing={isEditing.title}
        onEdit={handleEdit}
        onSave={handleSave}
        onChange={handleNoteChange}
      />

      <NotesSection
        title="내용 요약"
        type={SECTION_TYPES.SUMMARY}
        content={notes.summary}
        editedContent={editedNotes.summary}
        isEditing={isEditing.summary}
        onEdit={handleEdit}
        onSave={handleSave}
        onChange={handleNoteChange}
        multiline={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const LoadingView = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      p: 3,
    }}
  >
    <CircularProgress />
  </Box>
);

/**
 * 에러가 있을 때 표시할 컴포넌트
 */
const ErrorView = ({ error }) => (
  <Box sx={{ p: 3 }}>
    <Alert severity="error">{error}</Alert>
  </Box>
);

/**
 * 회의록 섹션 컴포넌트
 */
const NotesSection = ({
  title,
  type,
  content,
  editedContent,
  isEditing,
  onEdit,
  onSave,
  onChange,
  multiline = false,
}) => (
  <Paper
    elevation={0}
    sx={{ bgcolor: "grey.50", mb: 3, maxHeight: "400px", overflow: "auto" }}
  >
    <Box
      sx={{
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <SectionActionButton
        isEditing={isEditing}
        onEdit={() => onEdit(type)}
        onSave={() => onSave(type)}
      />
    </Box>
    <Divider />
    <Box sx={{ p: 2 }}>
      {!isEditing ? (
        <DisplayContent content={content} />
      ) : (
        <EditableContent
          content={editedContent}
          onChange={(value) => onChange(type, value)}
          multiline={multiline}
        />
      )}
    </Box>
  </Paper>
);

/**
 * 섹션 액션 버튼 컴포넌트
 */
const SectionActionButton = ({ isEditing, onEdit, onSave }) =>
  isEditing ? (
    <IconButton color="success" onClick={onSave} size="small">
      <SaveIcon />
    </IconButton>
  ) : (
    <IconButton color="primary" onClick={onEdit} size="small">
      <EditIcon />
    </IconButton>
  );

/**
 * 콘텐츠 표시용 컴포넌트
 */
const DisplayContent = ({ content }) => (
  <Typography
    variant="body1"
    sx={{
      whiteSpace: "pre-wrap",
      lineHeight: 1.8,
    }}
  >
    {content}
  </Typography>
);

/**
 * 편집 가능한 콘텐츠 컴포넌트
 */
const EditableContent = ({ content, onChange, multiline }) => (
  <TextField
    fullWidth
    multiline={multiline}
    variant="outlined"
    value={content}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      "& .MuiOutlinedInput-root": {
        bgcolor: "white",
      },
    }}
  />
);

export default MeetingNotesTab;
