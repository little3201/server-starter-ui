import { ref, unref } from 'vue'

type ScrollToParams = {
  el: HTMLElement;
  position?: 'scrollLeft' | 'scrollTop';
  to: number;
  duration?: number;
  callback?: () => void;
}

const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

const move = (el: HTMLElement, position: 'scrollLeft' | 'scrollTop', amount: number) => {
  el.style[position as any] = `${amount}px`;
}

export function useScrollTo({
  el,
  position = 'scrollLeft',
  to,
  duration = 500,
  callback
}: ScrollToParams) {
  const isActiveRef = ref(false);
  const start = el[position as 'scrollLeft' | 'scrollTop'];
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  function animateScroll() {
    if (!unref(isActiveRef)) {
      return;
    }
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    move(el, position, val);
    if (currentTime < duration && unref(isActiveRef)) {
      requestAnimationFrame(animateScroll);
    } else {
      if (callback) {
        callback();
      }
    }
  }

  function run() {
    isActiveRef.value = true;
    animateScroll();
  }

  function stop() {
    isActiveRef.value = false;
  }

  return { start: run, stop };
}
