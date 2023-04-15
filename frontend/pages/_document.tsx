import { Html, Head, Main, NextScript } from 'next/document'
import React from "react";
import Smartlook from 'smartlook-client'

export default function Document() {
  Smartlook.init('eab1d2441e688c0e09309f39dba85984301ad7e7')
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
