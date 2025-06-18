export const getHeatmapData = (data, days) => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - days);

  // Initialize empty heatmap data structure
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const heatmapData = [];
  const monthLabels = [];

  // Group data by date
  const submissionsByDate = {};
  data.forEach(item => {
    const dateStr = new Date(item.date).toISOString().split('T')[0];
    submissionsByDate[dateStr] = (submissionsByDate[dateStr] || 0) + 1;
  });

  // Generate heatmap data
  let currentDate = new Date(startDate);
  let currentWeek = [];
  let currentMonth = null;

  while (currentDate <= now) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const count = submissionsByDate[dateStr] || 0;
    
    // Start a new week
    if (currentDate.getDay() === 0 && currentWeek.length > 0) {
      heatmapData.push(currentWeek);
      currentWeek = [];
    }

    // Add day to current week
    currentWeek.push({
      date: new Date(currentDate),
      count
    });

    // Track month labels
    const month = currentDate.toLocaleString('default', { month: 'short' });
    if (month !== currentMonth) {
      if (currentDate.getDate() < 15) { // Only label at the start of the month
        monthLabels.push({
          month,
          position: heatmapData.length
        });
      }
      currentMonth = month;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add the last week if not empty
  if (currentWeek.length > 0) {
    heatmapData.push(currentWeek);
  }

  return {
    heatmapData,
    weekdays,
    monthLabels: monthLabels.map(m => m.month)
  };
};

export const formatRating = (rating) => {
  if (!rating) return '-';
  return rating.toLocaleString();
};