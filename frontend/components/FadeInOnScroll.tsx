import { ReactNode, useEffect, useRef, useState } from 'react';

const FadeInOnScroll = ({children}: { children: ReactNode }) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'animate-fadeInUp' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
