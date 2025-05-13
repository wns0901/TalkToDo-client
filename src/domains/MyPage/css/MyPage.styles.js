// MyPage 스타일
export const myPageStyles = {
  container: { 
    py: 4 
  },
  header: { 
    mb: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  backButton: { 
    mr: 2
  },
  title: { 
    fontWeight: 'bold'
  },
  addButton: {
    bgcolor: '#3E1A11', 
    '&:hover': { 
      bgcolor: '#2A120B' 
    }
  },
  calendarPaper: {
    mb: { xs: 2, md: 0 },
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flex: { md: 2 }
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 2
  },
  calendarTitle: {
    fontWeight: 'bold',
    mx: 2
  },
  filterContainer: {
    p: 2,
    borderBottom: '1px solid #eee'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
    my: 1
  },
  filterLabel: {
    fontWeight: 'bold',
    mr: 2
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1
  },
  filterBtn: {
    minWidth: '80px',
    borderColor: '#ccc'
  },
  activeFilterBtn: {
    minWidth: '80px',
    bgcolor: '#757575',
    '&:hover': {
      bgcolor: '#5c5c5c'
    }
  },
  typeFilterBtn: {
    minWidth: '60px',
    borderColor: '#ccc'
  },
  activeTypeFilterBtn: {
    minWidth: '60px',
    bgcolor: '#757575',
    '&:hover': {
      bgcolor: '#5c5c5c'
    }
  },
  dayCell: {
    height: '100px',
    position: 'relative',
    padding: '8px 4px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
    '&:hover': {
      backgroundColor: '#f9f9f9'
    }
  },
  dateNumber: {
    fontSize: '15px',
    fontWeight: 'normal',
    textAlign: 'left',
    mb: 1
  },
  selectedDateEvents: {
    p: 2,
    mt: 2,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  selectedDateTitle: {
    fontWeight: 'bold'
  },
  eventItem: {
    py: 1,
    borderBottom: '1px solid #f5f5f5',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  eventText: {
    mr: 2
  },
  categoryChip: {
    borderRadius: '4px',
    height: '24px'
  },
  typeChip: {
    borderRadius: '4px',
    height: '24px'
  },
  eventIndicator: {
    backgroundColor: '#f0f0f0',
    padding: '2px 4px',
    borderRadius: '4px',
    fontSize: '12px',
    marginBottom: '4px',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    minHeight: '20px',
    boxSizing: 'border-box',
  },
  moreEventsBtn: {
    textAlign: 'center', 
    fontSize: '12px', 
    color: '#555',
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  noEvents: {
    py: 3,
    display: 'flex',
    justifyContent: 'center'
  },
  
  // 포스트잇 스타일
  todoPostit: {
    p: 2,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    flex: { md: 1 },
    bgcolor: '#fffbe5',
    height: 'fit-content',
    minHeight: '300px',
    maxHeight: { md: '600px' },
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }
  },
  postitTitle: {
    fontWeight: 'bold',
    color: '#3E1A11',
    mb: 1
  },
  todoItem: {
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    py: 0.5,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  todoCheckbox: {
    color: '#3E1A11',
    '&.Mui-checked': {
      color: '#3E1A11'
    }
  },
  
  categoryModalContent: {
    py: 2
  },
  newCategoryInput: {
    display: 'flex',
    gap: 1,
    mb: 2
  },
  categoriesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
    maxHeight: '200px',
    overflowY: 'auto'
  },
  
  // 캘린더 셀 스타일
  calendarCell: {
    height: '95px',
    width: '14.28%', 
    padding: '8px 4px',
    verticalAlign: 'top',
    border: '1px solid #e0e0e0',
    boxSizing: 'border-box',
  },
};

export default myPageStyles; 