import type { NextPage } from "next";
import { Layout} from '../components/layout'
import Link from 'next/link'

const About: NextPage = () => {
  return (
    <div >
     
    About Page !
    <Link href="/">
          <a>Home page</a>
        </Link>
    </div>
  );
};

export default About;
