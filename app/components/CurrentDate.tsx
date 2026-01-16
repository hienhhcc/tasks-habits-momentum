"use client";

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CurrentDate() {
  const currentDate = getFormattedDate();
  return <span>{currentDate}</span>;
}
