import { useMagic } from '../MagicProvider';
import showToast from '@/utils/showToast';
import Spinner from '../../ui/Spinner';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { LoginProps } from '@/utils/types';
import { saveToken } from '@/utils/common';
import Card from '../../ui/Card';
import CardHeader from '../../ui/CardHeader';
import { useState } from 'react';
import FormInput from '@/components/ui/FormInput';

const EmailOTP = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  const handleLogin = async () => {
    if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
      setEmailError(true);
    } else {
      try {
        setLoginInProgress(true);
        setEmailError(false);
        const account = await magic?.auth.loginWithEmailOTP({ email });
        if (account) {
          saveToken(account, setToken, 'EMAIL');
          setEmail('');
        }
      } catch (e) {
        console.log('login error: ' + JSON.stringify(e));
        if (e instanceof RPCError) {
          switch (e.code) {
            case RPCErrorCode.MagicLinkFailedVerification:
            case RPCErrorCode.MagicLinkExpired:
            case RPCErrorCode.MagicLinkRateLimited:
            case RPCErrorCode.UserAlreadyLoggedIn:
              showToast({ message: e.message, type: 'error' });
              break;
            default:
              showToast({
                message: 'Something went wrong. Please try again',
                type: 'error',
              });
          }
        }
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader id="login">Email OTP Login</CardHeader>
      <div className="login-method-grid-item-container">
        <FormInput
          onChange={(e) => {
            if (emailError) setEmailError(false);
            setEmail(e.target.value);
          }}
          placeholder={token.length > 0 ? 'Already logged in' : 'Email'}
          value={email}
        />
        {emailError && <span className="error">Enter a valid email</span>}
        <button
          className="login-button"
          disabled={isLoginInProgress || (token.length > 0 ? false : email.length == 0)}
          onClick={() => handleLogin()}
        >
          {isLoginInProgress ? <Spinner /> : 'Login'}
        </button>
      </div>
    </Card>
  );
};

export default EmailOTP;
