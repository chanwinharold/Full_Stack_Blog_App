import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * useCustomCursor - Custom accent cursor with trailing ring
 */
export function useCustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const lerp = useCallback((start, end, factor) => {
    return start + (end - start) * factor;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;
      setPosition({ x: newX, y: newY });
      lastPosRef.current = { x: newX, y: newY };
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover-target')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // Smooth trailing animation
    const animate = () => {
      setTrailing((prev) => ({
        x: lerp(prev.x, position.x, 0.12),
        y: lerp(prev.y, position.y, 0.12),
      }));
      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [position, lerp]);

  return { position, trailing, isHovering };
}

/**
 * usePageTransition - Handle page transitions with clip-path
 */
export function usePageTransition() {
  const [phase, setPhase] = useState('idle'); // idle, exiting, sweeping, entering

  const startTransition = useCallback(() => {
    setPhase('exiting');
    
    setTimeout(() => {
      setPhase('sweeping');
    }, 200);

    setTimeout(() => {
      setPhase('entering');
    }, 350);

    setTimeout(() => {
      setPhase('idle');
    }, 650);
  }, []);

  return { phase, startTransition };
}