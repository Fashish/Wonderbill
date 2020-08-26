
/*
This function will count the number of months paid and 
remaining according to today's date ('date' parameter) 
*/
export const monthsCount = (date) => {
  let todaysDate = new Date();
  let lastPaidDate = new Date(date);
  if (lastPaidDate < todaysDate) {
    return lastPaidDate.getMonth() + 1;
  }
  return lastPaidDate.getMonth();
};

