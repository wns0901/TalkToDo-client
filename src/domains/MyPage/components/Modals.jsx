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
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { getCategoryColor, formatDateRange } from '../js/utils';

// 이벤트 모달 (선택된 날짜의 일정들)
export const EventModal = ({ 
  isOpen, 
  onClose, 
  events, 
  onEditEvent,
  onDateClick
}) => {
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
                    onEditEvent(event);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
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
            autoFocus
            fullWidth
            margin="dense"
            label="일정 제목"
            name="title"
            value={newEvent.title}
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
                label="전체"
                onClick={() => onChange({ target: { name: 'type', value: '전체' } })}
                variant={newEvent.type === '전체' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === '전체' ? getCategoryColor('전체') : undefined }}
              />
              <Chip
                label="개인"
                onClick={() => onChange({ target: { name: 'type', value: '개인' } })}
                variant={newEvent.type === '개인' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === '개인' ? getCategoryColor('개인') : undefined }}
              />
              <Chip
                label="회사"
                onClick={() => onChange({ target: { name: 'type', value: '회사' } })}
                variant={newEvent.type === '회사' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === '회사' ? getCategoryColor('회사') : undefined }}
              />
              <Chip
                label="팀"
                onClick={() => onChange({ target: { name: 'type', value: '팀' } })}
                variant={newEvent.type === '팀' ? "filled" : "outlined"}
                sx={{ bgcolor: newEvent.type === '팀' ? getCategoryColor('팀') : undefined }}
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
            label="종료 날짜"
            type="date"
            name="endDate"
            value={editEvent.endDate}
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
                label="전체"
                onClick={() => onChange({ target: { name: 'type', value: '전체' } })}
                variant={editEvent.type === '전체' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === '전체' ? getCategoryColor('전체') : undefined }}
              />
              <Chip
                label="개인"
                onClick={() => onChange({ target: { name: 'type', value: '개인' } })}
                variant={editEvent.type === '개인' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === '개인' ? getCategoryColor('개인') : undefined }}
              />
              <Chip
                label="회사"
                onClick={() => onChange({ target: { name: 'type', value: '회사' } })}
                variant={editEvent.type === '회사' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === '회사' ? getCategoryColor('회사') : undefined }}
              />
              <Chip
                label="팀"
                onClick={() => onChange({ target: { name: 'type', value: '팀' } })}
                variant={editEvent.type === '팀' ? "filled" : "outlined"}
                sx={{ bgcolor: editEvent.type === '팀' ? getCategoryColor('팀') : undefined }}
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