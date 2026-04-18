import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal - Trigger animations when elements enter viewport
 * @param {number} threshold - IntersectionObserver threshold (0-1)
 * @returns {object} { ref, isVisible }
 */
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/**
 * useScrollRevealAll - For revealing multiple elements with stagger delay
 * @param {number} count - Number of elements
 * @param {number} threshold - IntersectionObserver threshold
 * @param {number} staggerDelay - Delay between each element
 * @returns {React.RefObject}
 */
export function useScrollRevealAll(count, threshold = 0.15, staggerDelay = 120) {
  const refs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => Math.min(prev + 1, count));
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [count, threshold]);

  const setRef = (index) => (el) => {
    refs.current[index] = el;
  };

  return { refs: refs.current, setRef, visibleCount };
}

/**
 * useReadingProgress - Calculate scroll progress for reading bar
 * @returns {number} 0-100 progress percentage
 */
export function useReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const prog = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, prog)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

/**
 * useNavbarScroll - Detect scroll direction for navbar
 * @param {number} threshold - Scroll threshold to trigger hide
 * @returns {object} { isHidden, isAtTop }
 */
export function useNavbarScroll(threshold = 80) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > threshold && currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY || currentScrollY < threshold) {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, lastScrollY]);

  return { isHidden };
}