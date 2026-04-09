/**
 * 상대 시간 포맷: "방금 전", "N분 전", "N시간 전", "N일 전", 그 외 "YYYY.MM.DD"
 */
export const formatRelativeDate = (input: string | Date): string => {
  const date = typeof input === 'string' ? new Date(input) : input;
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return '방금 전';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  if (day < 7) return `${day}일 전`;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
};

/**
 * D-Day 계산: 마감일까지 남은 일수. 음수면 마감.
 */
export const calculateDDay = (deadline: string | Date): number => {
  const target = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetMid = new Date(target);
  targetMid.setHours(0, 0, 0, 0);
  return Math.round((targetMid.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * D-Day 라벨: D-3, D-DAY, 마감
 */
export const formatDDay = (deadline: string | Date): string => {
  const dday = calculateDDay(deadline);
  if (dday < 0) return '마감';
  if (dday === 0) return 'D-DAY';
  return `D-${dday}`;
};
