'use client';

import "../../shared/styles.scss";

import Theme from "../../components/theme/theme";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import Sidebar from "../../components/sidebar/sidebar";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SharedData, { brandName, logoURL } from "../../shared/shared";

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return <>
    <SharedData>
      <html lang={`en`}>

        {/* Head */}
        <HelmetProvider>
          <Helmet>
            <title>{brandName} | Official</title>
            {/* <title>{pageTitle} | {brandName} Official</title> */}
            <link rel={`manifest`} href={`/manifest.json`} />
            <meta name={`theme-color`} content={`#000000`} />
            <meta name={`description`} content={`Smart Garden`} />
            <link rel={`icon`} href={logoURL} type={`image/x-icon`} />
            <link rel={`apple-touch-icon`} href={`/icons/icon-192x192.png`} />
            <meta name={`viewport`} content={`width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no`} />
            <link rel={`stylesheet`} href={`https://use.fontawesome.com/releases/v5.8.1/css/all.css`} integrity={`sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf`} crossOrigin={`anonymous`} />
          </Helmet>

          {/* Body */}
          <body className={`flex`}>
            <Theme>
              <Sidebar style={{ maxWidth: 250 }} />
              <main className={`main w100 flex column gap5 spaceBetween alignCenter`}>
                <Header />
                {children}
                <Footer />
              </main>
            </Theme>
          </body>

        </HelmetProvider>
      </html>
    </SharedData>
  </>
}