import React, { useEffect, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleSignInButton({ onSuccess, onError, disabled }) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const updateWidth = () => {
      const next = Math.floor(node.getBoundingClientRect().width);
      if (next > 0) {
        setWidth(Math.min(400, Math.max(200, next)));
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center min-h-[44px]">
      {!disabled && (
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          theme="filled_black"
          size="large"
          width={width}
          text="continue_with"
          shape="pill"
        />
      )}
    </div>
  );
}
