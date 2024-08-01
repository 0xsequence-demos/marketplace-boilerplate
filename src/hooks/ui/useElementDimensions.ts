/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState, useEffect, useRef } from 'react';

const useElementDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const elementRef = useRef(null);

  useEffect(() => {
    const getElementDimensions = () => {
      if (elementRef.current) {
        const { width, height, x, y } = (
          elementRef.current as any
        )?.getBoundingClientRect();
        setDimensions({ width, height, x, y });
      }
    };

    // Call the function initially and add event listeners for resizing
    getElementDimensions();
    window.addEventListener('resize', getElementDimensions);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', getElementDimensions);
    };
  }, []);

  return { ref: elementRef, dimensions };
};

export default useElementDimensions;
