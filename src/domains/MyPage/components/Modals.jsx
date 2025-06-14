import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  IconButton, 
  TextField, 
  FormControl, 
  Divider,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';
import { getCategoryColor, formatDateRange } from '../js/utils';

// 이벤트 모달 (선택된 날짜의 일정들)
export const EventModal = ({ 
  isOpen, 
  onClose, 
  events, 
  onEditEvent,
  onDeleteEvent,
  onDateClick
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuEventId, setMenuEventId] = React.useState(null);

  const handleMenuOpen = (event, eventId) => {
    setAnchorEl(event.currentTarget);
    setMenuEventId(eventId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEventId(null);
  };
  const handleEdit = () => {
    const event = events.find(e => e.id === menuEventId);
    if (event) onEditEvent(event);
    handleMenuClose();
  };
  const handleDelete = () => {
    const event = events.find(e => e.id === menuEventId);
    if (event && window.confirm('정말 삭제하시겠습니까?')) {
      onDeleteEvent(event.id);
    }
    handleMenuClose();
  };

  // 일정 날짜로 이동 핸들러
  const handleDateClick = (event) => {
    // 날짜 객체 생성
    const eventDate = new Date(event.startDate);
    
    // 날짜 클릭 이벤트 실행
    onDateClick(eventDate);
    
    // 모달 닫기
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
        {events.length > 0 && events[0].date 
          ? format(new Date(events[0].date), 'yyyy년 MM월 dd일') 
          : ''} 일정 목록
      </DialogTitle>
      <DialogContent dividers>
        <List sx={{ p: 0 }}>
          {events.map(event => (
            <ListItem 
              key={event.id} 
              sx={{ 
                py: 1,
                borderBottom: '1px solid #f5f5f5',
                '&:last-child': { borderBottom: 'none' },
                cursor: 'pointer'
              }}
              onClick={() => handleDateClick(event)}
            >
              <ListItemText 
                primary={event.title} 
                secondary={formatDateRange(event.startDate, event.endDate)}
                sx={{ 
                  mr: 2,
                  '& .MuiTypography-root': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={event.category} 
                  size="small" 
                  sx={{
                    borderRadius: '4px',
                    backgroundColor: getCategoryColor(event.category)
                  }}
                  onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                />
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, event.id);
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>수정</MenuItem>
          <MenuItem onClick={handleDelete}>삭제</MenuItem>
        </Menu>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

// 카테고리 관리 모달
export const CategoryModal = ({ 
  isOpen, 
  onClose, 
  categories, 
  newCategory, 
  onCategoryChange, 
  onAddCategory, 
  onCategoryFilterChange 
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>카테고리 관리</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            카테고리 추가
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <TextField
              size="small"
              value={newCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="새 카테고리"
              fullWidth
            />
            <Button 
              variant="contained" 
              disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
              onClick={onAddCategory}
              sx={{ bgcolor: '#757575' }}
            >
              추가
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          모든 카테고리
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: '200px', overflowY: 'auto' }}>
          {categories.filter(c => c !== '전체').map(category => (
            <Chip
              key={category}
              label={category}
              sx={{
                bgcolor: getCategoryColor(category),
                m: 0.5
              }}
              onClick={() => onCategoryFilterChange(category)}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

// 일정 추가 모달
export const AddEventModal = ({ 
  isOpen, 
  onClose, 
  newEvent, 
  onChange, 
  onSave, 
  categories 
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>새 일정 추가</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, pb: 2 }}>
          <TextField
            fullWidth
            label="제목"
            name="title"
            value={newEvent.title}
            onChange={onChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="장소"
            name="location"
            value={newEvent.location}
            onChange={onChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="시작 날짜"
            type="date"
            name="startDate"
            value={newEvent.startDate}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="시작 시간"
            type="time"
            name="startTime"
            value={newEvent.startTime || "09:00"}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="종료 날짜"
            type="date"
            name="endDate"
            value={newEvent.endDate}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="종료 시간"
            type="time"
            name="endTime"
            value={newEvent.endTime || "10:00"}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              타입
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="회사"
                onClick={() => onChange({ target: { name: 'type', value: 'COMPANY' } })}
                variant={newEvent.type === 'COMPANY' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === 'COMPANY' ? getCategoryColor('COMPANY') : undefined }}
              />
              <Chip
                label="팀"
                onClick={() => onChange({ target: { name: 'type', value: 'TEAM' } })}
                variant={newEvent.type === 'TEAM' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === 'TEAM' ? getCategoryColor('TEAM') : undefined }}
              />
              <Chip
                label="개인"
                onClick={() => onChange({ target: { name: 'type', value: 'PERSONAL' } })}
                variant={newEvent.type === 'PERSONAL' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === 'PERSONAL' ? getCategoryColor('PERSONAL') : undefined }}
              />
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={() => onSave()}
          disabled={!newEvent.title.trim()}
          variant="contained"
          sx={{ bgcolor: '#757575' }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 일정 수정 모달
export const EditEventModal = ({ 
  isOpen, 
  onClose, 
  editEvent, 
  onChange, 
  onSave, 
  categories 
}) => {
  if (!editEvent) return null;
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>일정 수정</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1, pb: 2 }}>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="일정 제목"
            name="title"
            value={editEvent.title}
            onChange={onChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="장소"
            name="location"
            value={editEvent.location}
            onChange={onChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="시작 날짜"
            type="date"
            name="startDate"
            value={editEvent.startDate}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="시작 시간"
            type="time"
            name="startTime"
            value={editEvent.startTime || ""}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="종료 날짜"
            type="date"
            name="endDate"
            value={editEvent.endDate}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="종료 시간"
            type="time"
            name="endTime"
            value={editEvent.endTime || ""}
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              타입
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label="회사"
                onClick={() => onChange({ target: { name: 'type', value: 'COMPANY' } })}
                variant={editEvent.type === 'COMPANY' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === 'COMPANY' ? getCategoryColor('COMPANY') : undefined }}
              />
              <Chip
                label="팀"
                onClick={() => onChange({ target: { name: 'type', value: 'TEAM' } })}
                variant={editEvent.type === 'TEAM' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === 'TEAM' ? getCategoryColor('TEAM') : undefined }}
              />
              <Chip
                label="개인"
                onClick={() => onChange({ target: { name: 'type', value: 'PERSONAL' } })}
                variant={editEvent.type === 'PERSONAL' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === 'PERSONAL' ? getCategoryColor('PERSONAL') : undefined }}
              />
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={() => onSave()}
          disabled={!editEvent.title.trim()}
          variant="contained"
          sx={{ bgcolor: '#757575' }}
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 일정 상세 모달
export const EventDetailModal = ({ 
  isOpen, 
  onClose, 
  selectedEvent 
}) => {
  if (!selectedEvent) return null;
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>일정 상세</DialogTitle>
      <DialogContent>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {selectedEvent.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {selectedEvent.startDate} {selectedEvent.startTime} - {selectedEvent.endTime}
          </Typography>
          {selectedEvent.location && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              장소: {selectedEvent.location}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            담당자: {selectedEvent.assignee}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            상태: {selectedEvent.status}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            타입: {selectedEvent.type}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}; 