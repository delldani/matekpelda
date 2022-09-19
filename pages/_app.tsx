import '../styles/globals.css'
import type { AppProps } from 'next/app';
import {Layout } from '../components/layout';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  
  const [ counter,setCounter] = React.useState(0);
  return (
    <div>
<button onClick={()=>setCounter(counter +1)}>app counter</button>{counter}
  <Layout>
  <Component {...pageProps} />
  </Layout>
    </div>
  )
}

export default MyApp
