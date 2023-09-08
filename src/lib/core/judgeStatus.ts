export const judgeStatus = (progress: number): number => {
  if (progress <= 5) {
    return 0;
  } else if (progress === 100) {
    return 2;
  } else {
    return 1;
  }
};
