// 카테고리별 색상 매핑
export const CATEGORY_COLORS = {
  '미팅': '#ae7ddd',  
  '작업': '#ffdd95',  
  '면접': '#ff9e9e',  
  '교육': '#a1e6bc',  
  '개인': '#87ceeb',
  '회사': '#ff9e6b',
  '팀': '#70b15c',  // 팀 색상을 초록색 계열로 변경
  'default': '#cccccc' 
};

// 카테고리 색상 반환 유틸리티 함수
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};

// 날짜 표시 형식 유틸리티 함수
export const formatDateRange = (startDate, endDate) => {
  return startDate === endDate ? startDate : `${startDate} ~ ${endDate}`;
};

// 날짜 범위 내 일정 필터링 유틸리티 함수
export const filterEventsByDate = (events, dateStr, categoryFilter) => {
  // 날짜가 startDate와 endDate 사이에 있는 일정 필터링
  const targetDate = new Date(dateStr);
  let filtered = events.filter(event => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return targetDate >= startDate && targetDate <= endDate;
  });
  
  // 카테고리 필터 적용
  if (categoryFilter !== '전체') {
    filtered = filtered.filter(event => event.category === categoryFilter || event.type === categoryFilter);
  }
  
  return filtered;
}; 