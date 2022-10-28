import Link from 'next/link';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import UnderlineLink from '@/components/links/UnderlineLink';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [username, setUsername] = React.useState<string>('');
  const [error, setError] = React.useState('');

  const getEmails = async (username: string): Promise<string[] | null> => {
    let json;
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/events/public`
      );
      json = await res.json();
    } catch {
      return null;
    }

    // not iterable
    if (typeof json[Symbol.iterator] !== 'function') {
      return null;
    }

    const uniqueEmails: string[] = [];

    for (const action of json) {
      if (action.actor.login === username && action.type === 'PushEvent') {
        for (const commit of action.payload.commits) {
          const email = commit.author.email;
          if (
            !email.endsWith('users.noreply.github.com') &&
            !uniqueEmails.includes(email)
          ) {
            uniqueEmails.push(email);
          }
        }
      }
    }

    return uniqueEmails;
  };

  const submit = React.useCallback(async () => {
    if (username !== '') {
      const emails = await getEmails(username);
      if (emails === null) {
        setError('Username not found');
      } else {
        setUsername('');
        if (emails.length === 0) {
          setError('Email not found for username');
        } else {
          setError('');
          setEmails(emails);
        }
      }
    }
  }, [username, setEmails]);

  const submitEnter = React.useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && document.activeElement?.id === 'username') {
        submit();
      }
    },
    [submit]
  );

  React.useEffect(() => {
    window.addEventListener('keydown', submitEnter);

    return () => {
      window.removeEventListener('keydown', submitEnter);
    };
  }, [submitEnter]);

  return (
    <Layout>
      <Seo />
      <main>
        <section className='h-screen bg-[url("/svg/layered-waves-haikei.svg")] bg-cover bg-bottom'>
          <div className='layout flex min-h-screen flex-col items-center justify-between gap-2 text-center'>
            <div className='flex flex-grow flex-col'>
              <div className='pb-60'>div</div>
              <h1 className='mt-4 pt-6 text-white'>
                Need a Github user's email? 👀
              </h1>
              <br></br>
              <div className='mb-4 flex h-10 flex-row items-center gap-4'>
                <input
                  className='focus:shadow-outline bord h-full w-full appearance-none rounded-md border border-gray-400 bg-transparent px-3 leading-tight text-white shadow focus:outline-none'
                  id='username'
                  type='text'
                  value={username}
                  placeholder='Username'
                  onChange={(e) => setUsername(e.target.value)}
                  onSubmit={submit}
                />
                <button
                  className='h-full rounded-md bg-pink-600 px-4 text-2xl font-extrabold text-white'
                  onClick={submit}
                >
                  ⮕
                </button>
              </div>
              {error ? (
                <div key='error' className='text-white'>
                  {error}
                </div>
              ) : (
                emails.map((email) => (
                  <div className='text-white' key={email}>
                    {email}
                  </div>
                ))
              )}
            </div>
            <footer className='bottom-2 text-white'>
              <Link href='https://vivid.lol' className='md:w-1/3 md:max-w-none'>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className='mx-auto w-2/3 scale-[100.5%] rounded pt-4 pb-2 md:w-1/3 md:max-w-none'
                >
                  <source src='/images/vivid-demo.mp4' type='video/mp4' />
                </video>
              </Link>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://twitter.com/albertojrigail'>
                Alberto Rigail
              </UnderlineLink>
              {' from '}
              <UnderlineLink
                href='https://vivid.lol'
                className='text-2xl font-extrabold'
              >
                <span className='bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text pb-2 text-transparent'>
                  Vivid
                </span>
              </UnderlineLink>
            </footer>
          </div>{' '}
        </section>
      </main>
    </Layout>
  );
}
