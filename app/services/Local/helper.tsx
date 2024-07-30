"use client";

const numericToString = (value: number | null | undefined | string): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }
  return value === 0
    ? "0"
    : parseFloat(value.toString()).toLocaleString("en-IN");
};

const convertToDecimal = (
  value: number | null | undefined | string,
): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  let num = parseFloat(value.toString());
  if (isNaN(num)) {
    return "0";
  }

  const suffixes: string[] = ["", "k", "L", "Cr", "T", "P", "E"];
  let magnitude = 0;

  if (num >= 1e7) {
    num = num / 1e7;
    magnitude = 3;
  } else if (num >= 1e5) {
    num = num / 1e5;
    magnitude = 2;
  } else if (num >= 1e3) {
    num = num / 1e3;
    magnitude = 1;
  }

  return `${Math.floor(num * 100) / 100} ${suffixes[magnitude]}`;
};

const getPreviousMonths = (count: number): string[] => {
  const months: string[] = [];
  const now = new Date();
  const monthNames: string[] = [
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

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    months.push(`${month}-${year}`);
  }
  return months;
};

const convertToDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export { numericToString, convertToDecimal, getPreviousMonths, convertToDate };
