import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { getMeetingDetails, updateMeetingNotes } from '../../../apis/fakeApi';

/**
 * 회의록 섹션 타입
 */
const SECTION_TYPES = {
  TITLE: 'title',
  SUMMARY: 'summary',
  TASKS: 'tasks'
};

/**
 * 회의록 탭 컴포넌트
 */
const MeetingNotesTab = ({ meetingId = 1 }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({
    title: '',
    summary: '',
    tasks: ''
  });
  
  const [isEditing, setIsEditing] = useState({
    title: false,
    summary: false,
    tasks: false
  });
  
  const [editedNotes, setEditedNotes] = useState({
    title: '',
    summary: '',
    tasks: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  useEffect(() => {
    fetchMeetingNotes(meetingId);
  }, [meetingId]);
  

  const fetchMeetingNotes = (id) => {
    setLoading(true);
    getMeetingDetails(id)
      .then(data => {
        setNotes(data.notes);
        setEditedNotes(data.notes);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };
  
  /**
   * 편집 모드로 전환합니다.
   */
  const handleEdit = (section) => {
    setIsEditing(prev => ({...prev, [section]: true}));
  };
  

  const handleSave = (section) => {
    updateMeetingNotes(meetingId, { [section]: editedNotes[section] })
      .then(data => {
        setNotes(data.notes);
        setIsEditing(prev => ({...prev, [section]: false}));
        
        showSnackbar('저장되었습니다.', 'success');
      })
      .catch(err => {
        showSnackbar(`저장 실패: ${err.message}`, 'error');
      });
  };


  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({...prev, open: false}));
  };


  const handleNoteChange = (section, value) => {
    setEditedNotes(prev => ({...prev, [section]: value}));
  };
  
  if (loading) {
    return <LoadingView />;
  }
  
  if (error) {
    return <ErrorView error={error} />;
  }
  
  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

      <NotesSection 
        title="업무 목록"
        type={SECTION_TYPES.TASKS}
        content={notes.tasks}
        editedContent={editedNotes.tasks}
        isEditing={isEditing.tasks}
        onEdit={handleEdit}
        onSave={handleSave}
        onChange={handleNoteChange}
        multiline={true}
        minRows={6}
        isPreformattedText={true}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};


const LoadingView = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 3 }}>
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
  minRows = 4,
  isPreformattedText = false
}) => (
  <Paper elevation={0} sx={{ bgcolor: 'grey.50', mb: 3, maxHeight: '400px', overflow: 'auto' }}>
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight="bold">{title}</Typography>
      <SectionActionButton 
        isEditing={isEditing} 
        onEdit={() => onEdit(type)} 
        onSave={() => onSave(type)} 
      />
    </Box>
    <Divider />
    <Box sx={{ p: 2 }}>
      {!isEditing ? (
        <DisplayContent 
          content={content} 
          isPreformattedText={isPreformattedText} 
        />
      ) : (
        <EditableContent 
          content={editedContent}
          onChange={(e) => onChange(type, e.target.value)}
          multiline={multiline}
          minRows={minRows}
        />
      )}
    </Box>
  </Paper>
);

/**
 * 섹션 액션 버튼 컴포넌트
 */
const SectionActionButton = ({ isEditing, onEdit, onSave }) => (
  isEditing ? (
    <IconButton color="success" onClick={onSave} size="small">
      <SaveIcon />
    </IconButton>
  ) : (
    <IconButton color="primary" onClick={onEdit} size="small">
      <EditIcon />
    </IconButton>
  )
);

/**
 * 콘텐츠 표시용 컴포넌트
 */
const DisplayContent = ({ content, isPreformattedText }) => (
  isPreformattedText ? (
    <Typography
      component="pre"
      sx={{ 
        whiteSpace: 'pre-wrap',
        fontFamily: 'inherit',
        fontSize: '1rem',
        lineHeight: 1.8
      }}
    >
      {content}
    </Typography>
  ) : (
    <Typography
      variant="body1"
      sx={{ 
        whiteSpace: 'pre-wrap',
        lineHeight: 1.8
      }}
    >
      {content}
    </Typography>
  )
);

/**
 * 편집 가능한 콘텐츠 컴포넌트
 */
const EditableContent = ({ content, onChange, multiline, minRows }) => (
  <TextField
    fullWidth
    multiline={multiline}
    variant="outlined"
    value={content}
    onChange={onChange}
    minRows={multiline ? minRows : 1}
    sx={{ 
      '& .MuiOutlinedInput-root': {
        bgcolor: 'white',
      }
    }}
  />
);

export default MeetingNotesTab; 