import type { NextPage } from "next";
import React from 'react';


interface Props  {
    children?:React.ReactNode;
};

export const Layout: NextPage<Props> = ({children}) => {
const [ counter,setCounter] = React.useState(0);
    return (
    <div >
        <button onClick={()=>setCounter(counter+1)}>counter</button>
{children}
    </div>
  );
};

