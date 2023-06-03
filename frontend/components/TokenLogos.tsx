import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

interface LogoComponentProps {
  logoUrls: string[];
}

export const TokenLogos: React.FC<LogoComponentProps> = ({ logoUrls }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numLogos = logoUrls.length;
    const radius = 60;
    const angle = (2 * Math.PI) / numLogos;

    logoUrls.forEach((logo, index) => {
      const logoElement = container.children[index] as HTMLDivElement;
      const logoPositionX = Math.cos(angle * index) * radius;
      const logoPositionY = Math.sin(angle * index) * radius;

      logoElement.style.transform = `translate(${logoPositionX}px, ${logoPositionY}px)`;
    });
  }, [logoUrls]);

  return (
    <div ref={containerRef} className="relative mr-3">
      {logoUrls.map((logoUrl, index) => (
        <div
          key={index}
          className="rounded-full inline"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <Image
            alt="Token Logo"
            width={50}
            height={50}
            src={logoUrl}
          />
        </div>
      ))}
    </div>
  );
};

