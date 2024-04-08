export const scrollSmoothlyTo = ({ isToTop, ref }) => {
  setTimeout(() => {
    if (!ref.current) return;

    const { clientHeight } = ref.current.firstElementChild;
    const scrollDirection = isToTop ? 'scrollTo' : 'scrollBy';
    const topValue = isToTop ? 0 : clientHeight * 2;

    window[scrollDirection]({
      top: topValue,
      behavior: 'smooth',
    });
  }, 0);
};
