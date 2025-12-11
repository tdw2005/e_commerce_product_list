import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, ...props }) => {
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observerRef.current.unobserve(imgRef.current);
      }
    });

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={failed ? process.env.PUBLIC_URL + '/logo192.png' : (inView ? src : process.env.PUBLIC_URL + '/logo192.png')}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default LazyImage;
