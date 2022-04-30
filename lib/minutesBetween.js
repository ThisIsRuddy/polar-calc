const minutesBetween = (startDate, endDate) => {
  let diff = (endDate.getTime() - startDate.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export default minutesBetween;
