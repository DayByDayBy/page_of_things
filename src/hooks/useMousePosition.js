import { useState, useEffect } from "react";

function throttle(func, limit) {
  let lastFunc, lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.call(context, ...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.call(context, ...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function useMousePosition(throttleMs = 50) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handler = throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, throttleMs);
    
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [throttleMs]);
  
  return mousePosition;
}
