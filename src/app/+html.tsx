import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return <html lang={`en`}><head>
    <meta charSet={`utf-8`} />
    <meta name={`theme-color`} content={`#090a09`} />
    <meta name={`viewport`} content={`width=device-width, initial-scale=1`} />
    <link rel={`preload`} as={`font`} type={`font/ttf`} crossOrigin={`anonymous`} href={`/media/fonts/Anton-Regular.ttf`} />
    <link rel={`preload`} as={`font`} type={`font/ttf`} crossOrigin={`anonymous`} href={`/media/fonts/SpaceGrotesk.ttf`} />
    <noscript><style>{`.page-loader { display: none !important; }`}</style></noscript>
    <meta name={`description`} content={`Kalashi Music. Bangladesh-born, Atlanta-based rapper. Explore the releases, listen on Spotify, and step inside the sound.`} />
    <meta property={`og:title`} content={`KALASHI — A World In My Sound`} />
    <meta property={`og:description`} content={`Bangladesh roots. Atlanta energy. The world of Kalashi.`} />
  </head><body>{children}</body></html>;
}
