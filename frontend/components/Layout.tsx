import Link from 'next/link';
import Head from 'next/head';
import { PropsWithChildren } from 'react';
import { ConnectKitButton } from 'connectkit';
import Compound from "../pages/compound";

export default function Layout({children}: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Real Yield Dashboard</title>
        <meta name="description" content="Real Yield Auto Compounder"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="py-10 px-20">
        {/* Navigation bar */}
        <nav className="text-white py-2">
          {/* Logo */}
          <div className="flex">
            <img src="logo.png" alt="Logo" className="w-40"/>
            <span className="flex-grow"></span>
            <ConnectKitButton/>
          </div>

          {/* Navigation links */}
          <ul className="flex items-center py-3 mt-10 border-b-2 border-b-gray-500">
            <li className="px-5"><Link href='/'>Home</Link></li>
            <li className="px-5"><Link href='/performance'>Performance</Link></li>
            <li className="px-5"><Link href='/compound'>Farms</Link></li>
          </ul>
        </nav>

        {/* Dynamic content */}
        <div className="p-4">
          <main>{children}</main>
        </div>
      </main>
    </>
  )
}
