const calcTargetScroll = (selector: string) => {
  const articleBody = document.querySelector(selector) ?? document.body;
  const { height, top } = articleBody.getBoundingClientRect();
  const scrollHeight = top + height + window.scrollY - window.innerHeight;
  return scrollHeight;
};

export const progress2scroll = (selector: string) => (progress: number) => {
  const progressRate = progress / 100;
  const scrollHeight = calcTargetScroll(selector) * progressRate;
  return scrollHeight;
};

export const scroll2progress = (selector: string) => (scroll: number) => {
  const progress = (scroll / calcTargetScroll(selector)) * 100;
  return progress > 100 ? 100 : progress;
};
