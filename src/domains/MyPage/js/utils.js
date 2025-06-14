// 카테고리별 색상 매핑
export const CATEGORY_COLORS = {
  'COMPANY': '#ff9e6b',  // 회사
  'TEAM': '#70b15c',    // 팀
  'PERSONAL': '#87ceeb', // 개인
  'TODO': '#ffd54f',    // TODO
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
    if (!event.startDate || !event.endDate) {
      return false;
    }
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    if (isNaN(startDate) || isNaN(endDate)) {
      console.warn('Invalid Date:', event);
      return false;
    }
    // displayInCalendar가 false인 일정은 제외
    if (event.displayInCalendar === false) {
      return false;
    }
    return targetDate >= startDate && targetDate <= endDate;
  });
  
  // 카테고리 필터 적용
  if (categoryFilter === 'TODO') {
    filtered = filtered.filter(event => event.type === 'TODO');
  } else if (categoryFilter !== '전체') {
    filtered = filtered.filter(event => event.category === categoryFilter || event.type === categoryFilter);
  }
  
  return filtered;
}; 