export const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateShort = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export const getMonthName = month => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
};

export const getMonthShortName = month => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month - 1];
};

export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const isCurrentMonth = (month, year) => {
  const now = new Date();
  return now.getMonth() + 1 === month && now.getFullYear() === year;
};
