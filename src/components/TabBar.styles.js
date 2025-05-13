// TabBar 스타일
export const tabBarStyles = {
  container: { 
    width: '100%', 
    bgcolor: '#E5E5E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd'
  },
  tabs: {
    '& .MuiTab-root': { 
      minWidth: 'unset', 
      px: 3,
      py: 1.5,
      fontSize: '0.95rem',
      borderRight: '1px solid #ccc'
    },
    '& .Mui-selected': { 
      fontWeight: 'bold'
    }
  },
  shareButton: { 
    mr: 1 
  },
  menuItemIcon: {
    fontSize: 'small'
  }
};

export default tabBarStyles; 