// 카테고리별 색상 매핑
export const CATEGORY_COLORS = {
  COMPANY: "#ff9e6b", // 회사
  TEAM: "#70b15c", // 팀
  PERSONAL: "#87ceeb", // 개인
  TODO: "#ffd54f", // TODO
  default: "#cccccc",
};

// 카테고리 색상 반환 유틸리티 함수
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};

// 날짜 표시 형식 유틸리티 함수
export const formatDateRange = (startDate, endDate) => {
  // LocalDate 형식의 날짜를 YYYY-MM-DD 형식으로 변환
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return start === end ? start : `${start} ~ ${end}`;
};

// 날짜 범위 내 일정 필터링 유틸리티 함수
export const filterEventsByDate = (events, dateStr, categoryFilter) => {
  // 날짜가 startDate와 endDate 사이에 있는 일정 필터링
  const targetDate = new Date(dateStr);
  let filtered = events.filter((event) => {
    if (!event.startDate || !event.dueDate) {
      return false;
    }

    // LocalDate 형식의 날짜를 Date 객체로 변환
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.dueDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      console.warn("Invalid Date:", event);
      return false;
    }
    // displayInCalendar가 false인 일정은 제외
    if (event.displayInCalendar === false) {
      return false;
    }
    return targetDate >= startDate && targetDate <= endDate;
  });

  // 카테고리 필터 적용
  if (categoryFilter === "TODO") {
    filtered = filtered.filter((event) => event.type === "TODO");
  } else if (categoryFilter !== "전체") {
    filtered = filtered.filter(
      (event) =>
        event.category === categoryFilter || event.type === categoryFilter
    );
  }

  return filtered;
};
