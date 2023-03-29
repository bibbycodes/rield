import { useEffect, useState } from 'react';

const FadeInImage = ({src, className}: { src: string, className: string }) => {
  const [loaded, setLoaded] = useState(false);

  const handleImageLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = handleImageLoad;
  }, []);

  return (
    <img
      src={src}
      alt=""
      onLoad={handleImageLoad}
      className={`${loaded ? 'animate-fadeInUp' : 'opacity-0'} ${className}`}
    />
  );
};

export default FadeInImage;
