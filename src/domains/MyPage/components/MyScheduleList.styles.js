// MyScheduleList 스타일
export const myScheduleListStyles = {
  emptyMessage: {
    textAlign: 'center',
    color: 'text.secondary',
    py: 4
  },
  dateGroup: {
    mb: 3,
    overflow: 'hidden'
  },
  dateHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
    bgcolor: '#f5f5f5'
  },
  dateTitle: {
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  countChip: {
    bgcolor: '#e0e0e0',
    fontWeight: 'bold'
  },
  item: {
    borderBottom: '1px solid #f0f0f0',
    py: 1
  },
  checkboxContainer: {
    minWidth: '42px'
  },
  checkbox: {
    color: '#3E1A11',
    '&.Mui-checked': {
      color: '#3E1A11'
    }
  },
  itemText: {
    '& .MuiTypography-root': {
      fontWeight: 500
    }
  },
  completedItemText: {
    '& .MuiTypography-root': {
      textDecoration: 'line-through',
      color: 'text.secondary'
    }
  },
  meetingChip: {
    bgcolor: '#e8f4fd',
    color: '#1976d2',
    fontSize: '0.7rem'
  }
};

export default myScheduleListStyles; 