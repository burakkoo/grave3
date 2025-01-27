'use client';

import Button from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextInput } from '@/components/ui/TextInput';
import { useToast } from '@/hooks/useToast';
import { AtSign, PasswordLock, ActivationKey, LogInSquare } from '@/svg_components';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { GenericLoading } from '@/components/GenericLoading';
import { z } from 'zod';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters long');

export function UserAuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [activationCode, setActivationCode] = useState('');

  // Individual error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [activationCodeError, setActivationCodeError] = useState<string | null>(null);

  const [loading, setLoading] = useState({
    email: false,
    github: false,
    facebook: false,
    google: false,
  });

  const areButtonsDisabled = loading.email || loading.github || loading.facebook || loading.google;
  const searchParams = useSearchParams();
  const qrCode = searchParams.get('qrCode') || ''; // Extract QR code from URL
  let callbackUrl = searchParams.get('from') || mode === 'login' ? '/discover' : '/setup';

  const { showToast } = useToast();

  useEffect(() => {
    const verifyQrCode = async () => {
      if (!qrCode) {
        setIsVerifying(false);
        return;
      }

      const response = await fetch(`/api/users/find-qr-user?qrCode=${qrCode}`);

      if (response.ok) {
        const data = await response.json();
        if (data.redirectUrl && data.used) {
          router.push(data.redirectUrl);
        } else {
          setIsVerifying(false); // No redirection needed, show the form
        }
      } else {
        console.error('Error verifying QR code');
        setIsVerifying(false); // Error, but show the form
      }
    };

    verifyQrCode();
  }, [qrCode, router]);

  const submitCredentials = async () => {
    setLoading((prev) => ({
      ...prev,
      email: true,
    }));

    if (mode === 'register') {
      const checkActivationCode = await fetch('/api/users/verify-activation-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCode,
          activationCode,
        }),
      });

      if (checkActivationCode.ok) {
        const data = await checkActivationCode.json();
        if (data.error) {
          setActivationCodeError(data.error); // Specific error for activation code
          setLoading((prev) => ({
            ...prev,
            email: false,
          }));
          return;
        }
      } else {
        setActivationCodeError('Error verifying activation code'); // Specific error for activation code
        setLoading((prev) => ({
          ...prev,
          email: false,
        }));
        return;
      }
    }
    // Validate email and password
    const emailValidation = emailSchema.safeParse(email);
    const passwordValidation = passwordSchema.safeParse(password);

    if (!emailValidation.success) {
      setEmailError(emailValidation.error.issues[0]?.message);
    } else {
      setEmailError(null);
    }

    if (!passwordValidation.success) {
      setPasswordError(passwordValidation.error.issues[0]?.message);
    } else {
      setPasswordError(null);
    }

    if (mode === 'register' && password !== passwordConfirmation) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError(null);
    }

    if (emailValidation.success && passwordValidation.success && handlePasswordConfirmation()) {
      const signInResult = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        qrCode, // Include QR code in the sign-in request
        redirect: false,
        callbackUrl,
      });

      setLoading((prev) => ({
        ...prev,
        email: false,
      }));

      if (!signInResult?.ok) {
        return showToast({ type: 'error', title: 'Authentication failed' });
      }
      showToast({
        type: 'success',
        title: 'Signed in',
        message: 'You are now signed in.',
      });

      router.push(callbackUrl);
    }
  };

  const handlePasswordConfirmation = () => {
    if (mode === 'register' && password !== passwordConfirmation) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  if (isVerifying) {
    return <GenericLoading />; // Or a loading spinner if you want to show a loading state
  }

  return (
    <>
      <div className="mb-4">
        <TextInput
          value={email}
          onChange={(text) => setEmail(text)}
          label="Email"
          errorMessage={emailError || undefined} // Specific email error
          Icon={AtSign}
        />
      </div>
      <div className="mb-4">
        <TextInput
          value={password}
          onChange={(text) => setPassword(text)}
          label="Password"
          type="password"
          errorMessage={passwordError || undefined} // Specific password error
          Icon={PasswordLock}
        />
      </div>
      {mode === 'register' && (
        <>
          <div className="mb-4">
            <TextInput
              value={passwordConfirmation}
              onChange={(text) => setPasswordConfirmation(text)}
              label="Confirm Password"
              type="password"
              errorMessage={confirmPasswordError || undefined} // Specific confirm password error
              Icon={PasswordLock}
            />
          </div>

          <div className="mb-4">
            <TextInput
              value={activationCode}
              onChange={(text) => {
                setActivationCode(text);
                setActivationCodeError(null); // Reset activation code error when user types
              }}
              label="Activation Code"
              errorMessage={activationCodeError || undefined} // Specific activation code error
              Icon={ActivationKey}
            />
          </div>
        </>
      )}
      <div className="mb-5">
        <Button
          onPress={() => {
            submitCredentials();
          }}
          shape="pill"
          expand="full"
          Icon={LogInSquare}
          loading={loading.email}
          isDisabled={areButtonsDisabled}>
          {mode === 'login' ? 'Login' : 'Sign up'} with Email
        </Button>
      </div>
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center px-1">
          <span className="w-full border-t border-muted" />
        </div>
      </div>
    </>
  );
}
