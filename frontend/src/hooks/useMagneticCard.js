import { useEffect, useRef } from 'react';

/**
 * useMagneticCard - Add magnetic cursor effect to a card
 * @param {number} strength - Movement strength (default 8)
 * @param {number} yStrength - Y movement strength (default 5)
 */
export function useMagneticCard(strength = 8, yStrength = 5) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / rect.width * strength;
      const moveY = (e.clientY - centerY) / rect.height * yStrength;
      
      container.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'translate(0px, 0px)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, yStrength]);

  return containerRef;
}

/**
 * useCountUp - Animate a number counting up
 * @param {number} target - Target number to count to
 * @param {number} duration - Animation duration in ms
 * @returns {number} Current animated value
 */
export function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    let startTime = null;
    let animationId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out expo)
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      
      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [target, duration]);

  return value;
}