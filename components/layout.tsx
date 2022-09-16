import React from "react";

type Props = {
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children }) => {
  const [counter, setCounter] = React.useState(0);

  return (
    <div>
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        Counter
      </button>
      {children}
      <h2>{counter}</h2>
    </div>
  );
};
