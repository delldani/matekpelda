import type { NextPage } from "next";
import { Layout} from '../components/layout'
import Link from 'next/link'

const About: NextPage = () => {
  if (typeof window !== "undefined") {
   console.log(window.history)
  }

  return (
    <div >
     
    About Page !
    <Link href="/">
          <a>Home page</a>
        </Link>
        <button onClick={()=>{  const state = { 'page_id': 1, 'user_id': 5 };
          const url = '/';
          window.history.pushState(state, '', url)}}
        >push</button>
    </div>
  );
};

export default About;
