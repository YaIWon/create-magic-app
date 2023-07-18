import { LoginProps } from '@/utils/types';
import { useMagic } from '../provider/MagicProvider';
import { useEffect, useState } from 'react';
import Card from '../card/Card';
import CardHeader from '../card/CardHeader';
import classNames from 'classnames';
import { logout, saveToken } from '@/utils/common';
import Spinner from '../ui/Spinner';
import { useRouter } from 'next/router';

const setScriptAttributesAndAddScript = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  script.setAttribute('data-magic-publishable-api-key', process.env.MAGIC_API_KEY!);
  script.setAttribute('data-redirect-uri', '/');
  script.async = true;

  document.body.appendChild(script);
};

const LoginForm = ({ token, setToken }: LoginProps) => {
  const { magic } = useMagic();
  const router = useRouter();
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  useEffect(() => {
    if (token.length == 0) {
      if (router.query.didt) {
        saveToken(router.query.didt as string, setToken);
      }
      if (router.query.magic_credential) {
        saveToken(router.query.magic_credential as string, setToken);
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (token.length > 0 && !isLoginInProgress) {
      setLoginInProgress(false);
    }
  }, [token]);

  const handleLogin = () => {
    setLoginInProgress(true);
    setScriptAttributesAndAddScript('https://auth.magic.link/pnp/login');
  };

  const handleLogout = () => {
    setLoginInProgress(true);
    setScriptAttributesAndAddScript('https://auth.magic.link/pnp/logout');
    logout(setToken, magic);
    setLoginInProgress(false);
  };

  return (
    <Card>
      <CardHeader title="Login Form" />
      <button
        className={classNames(
          'w-full rounded-3xl px-8 py-2 bg-[#A799FF] enabled:hover:bg-[#A799FF]/[0.5] text-center text-white font-medium disabled:cursor-default cursor-pointer my-2 items-center justify-center',
        )}
        disabled={isLoginInProgress}
        onClick={() => (token.length > 0 ? handleLogout() : handleLogin())}
      >
        {isLoginInProgress ? <Spinner /> : token.length > 0 ? 'Logout' : 'Login'}
      </button>
      <span className="text-xs">
        Please wait a few seconds after clicking login or logout as this button is executing a magic script
      </span>
    </Card>
  );
};

export default LoginForm;
