import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import { tabBarStyles } from './TabBar.styles';

/**
 * 공유 메뉴 아이템 데이터
 */
const SHARE_MENU_ITEMS = [
  {
    id: 'docs',
    label: 'Docs 다운로드',
    icon: <DescriptionIcon fontSize="small" />
  },
  {
    id: 'email',
    label: '메일로 발송',
    icon: <EmailIcon fontSize="small" />
  },
];

/**
 * 메뉴 아이템 컴포넌트
 */
const ShareMenuItem = ({ item, onClick }) => {
  if (item.divider) {
    return <Divider />;
  }
  
  return (
    <MenuItem onClick={() => onClick(item.id)}>
      <ListItemIcon>
        {item.icon}
      </ListItemIcon>
      <ListItemText>{item.label}</ListItemText>
    </MenuItem>
  );
};

/**
 * 회의 탭 바 컴포넌트
 * @param {Object} props
 * @param {number} props.value - 현재 선택된 탭 인덱스
 * @param {Function} props.onChange - 탭 변경 이벤트 핸들러
 * @param {Function} props.onShare - 공유 메뉴 아이템 클릭 이벤트 핸들러
 */
const TabBar = ({ value, onChange, onShare }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  
  const handleShareClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (actionId) => {
    handleCloseMenu();
    if (onShare) {
      onShare(actionId);
    }
  };
  
  return (
    <Box sx={tabBarStyles.container}>
      <NavigationTabs value={value} onChange={onChange} />
      <ShareButton onClick={handleShareClick} />
      <ShareMenu 
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        onItemClick={handleMenuItemClick}
      />
    </Box>
  );
};

/**
 * 탭 내비게이션 컴포넌트
 */
const NavigationTabs = ({ value, onChange }) => (
  <Tabs 
    value={value} 
    onChange={onChange}
    sx={tabBarStyles.tabs}
  >
    <Tab label="회의 전문" />
    <Tab label="회의록" />
    <Tab label="ToDo & 일정" />
  </Tabs>
);

/**
 * 공유 버튼 컴포넌트
 */
const ShareButton = ({ onClick }) => (
  <IconButton 
    aria-label="share"
    onClick={onClick}
    sx={tabBarStyles.shareButton}
  >
    <ShareIcon />
  </IconButton>
);

/**
 * 공유 메뉴 컴포넌트
 */
const ShareMenu = ({ anchorEl, open, onClose, onItemClick }) => (
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  >
    {SHARE_MENU_ITEMS.map((item, index) => (
      <ShareMenuItem 
        key={item.divider ? `divider-${index}` : item.id} 
        item={item} 
        onClick={onItemClick} 
      />
    ))}
  </Menu>
);

export default TabBar; 