/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx, { ClassValue } from "clsx";
import format from "date-fns/format";

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  const debounced = (...args: []) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
  return debounced;
};

export const throttle = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  let lastExecutedTime = 0;
  const throttled = (...args: []) => {
    const currentTime = Date.now();
    const timeSinceLastExecution = currentTime - lastExecutedTime;
    if (timeSinceLastExecution >= delay) {
      func.apply(this, args);
      lastExecutedTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecutedTime = currentTime;
      }, delay - timeSinceLastExecution);
    }
  };
  return throttled;
};

export const getOS = (forDesktop: boolean = true): string => {
  const userAgent = navigator.userAgent;
  if (forDesktop) {
    if (/Macintosh/i.test(userAgent)) {
      return "MacOS";
    }
    if (/Windows/i.test(userAgent)) {
      return "Windows";
    }
  }
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "WindowsPhone";
  }
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS";
  }
  return "unknown";
};

export const cn = (...inputs: ClassValue[]) => {
  return clsx(inputs);
};

export const parseToCustomDate = (targetDate: string | Date) => {
  return {
    raw: typeof targetDate === "string" ? targetDate : targetDate.toISOString(),
    readable: format(new Date(targetDate), "dd/MM/yyyy hh:mm:ss"),
  };
};