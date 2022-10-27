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
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white bg-gradient-to-r from-gray-900 to-gray-600'>
          <div className='layout flex min-h-screen flex-col items-center justify-center gap-2 text-center'>
            <h1 className='mt-4 text-white'>Need a Github user's emails? 👀</h1>
            <br></br>
            <div className='mb-4 flex flex-row items-center gap-4'>
              <input
                className='focus:shadow-outline w-full appearance-none rounded-sm border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none'
                id='username'
                type='text'
                value={username}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
                onSubmit={submit}
              />
              <button
                className='rounded-sm bg-gradient-to-r from-fuchsia-500 via-red-600 to-orange-400 p-1.5 font-extrabold text-white'
                onClick={submit}
              >
                Submit
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
            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://twitter.com/albertojrigail'>
                Alberto Rigail
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
