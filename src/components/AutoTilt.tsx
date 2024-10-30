import React, { useEffect, useRef } from 'react';

interface AutoTiltProps {
  children: React.ReactNode;
}

const AutoTilt: React.FC<AutoTiltProps> = ({ children }) => {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tiltElement = tiltRef.current;
    if (!tiltElement) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      const tiltX = Math.sin(time) * 25;
      const tiltY = Math.cos(time) * 25;

      if (tiltElement) {
        tiltElement.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.25, 1.25, 1.25)`;
      }

      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={tiltRef} 
      className="transition-transform duration-300 ease-out"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
};

export default AutoTilt;