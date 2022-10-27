import { AppProps } from 'next/app';

import '@/styles/globals.css';
// !STARTERCONF This is for demo purposes, remove @/styles/colors.css import immediately
import '@/styles/colors.css';

if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development'
  // && /VIVID_ENABLED=true/.test(document.cookie)
) {
  import('vivid-studio').then((v) => v.run());
  import('vivid-studio/style.css');
}

/**
 * !STARTERCONF info
 * ? `Layout` component is called in every page using `np` snippets. If you have consistent layout across all page, you can add it here too
 */

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
