export const truncateString = (description: string, max: number) => {
  return description.length <= max
    ? description
    : description.slice(0, max) + "...";
};
