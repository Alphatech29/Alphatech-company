export const formatDateTime = (date) => {
  if (!(date instanceof Date)) date = new Date(date);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const formatDate = (date) => {
  if (!(date instanceof Date)) date = new Date(date);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export const formatTime = (date) => {
  if (!(date instanceof Date)) date = new Date(date);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
