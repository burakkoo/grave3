// components/RecaptchaComponent.tsx
'use client';
import React, { useRef, useEffect } from 'react';

declare global {
  interface Window {
    turnstile: any;
  }
}
import ReCAPTCHA from 'react-google-recaptcha';

interface RecaptchaComponentProps {
  onVerify: (token: string | null) => void;
}

const RecaptchaComponent: React.FC<RecaptchaComponentProps> = ({ onVerify }) => {
  // const recaptchaRef = useRef<ReCAPTCHA>(null);

  // const handleRecaptchaChange = (token: string | null) => {
  //   onVerify(token);
  // };

  // return (
  //   <ReCAPTCHA
  //     ref={recaptchaRef}
  //     sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''} // Use an environment variable for the site key
  //     onChange={handleRecaptchaChange}
  //   />
  // );
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileRef.current) return;

    // Initialize Turnstile
    const widgetId = window.turnstile.render(turnstileRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '',
      callback: (token: string) => onVerify(token),
      'error-callback': () => onVerify(null),
    });

    return () => {
      if (widgetId) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onVerify]);

  return <div ref={turnstileRef} />;
};

export default RecaptchaComponent;
