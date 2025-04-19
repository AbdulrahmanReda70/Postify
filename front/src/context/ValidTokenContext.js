import { createContext, useContext, useState } from "react";

const validTokenContext = createContext();

export default function ValidTokenContext({ children }) {
  const [isValid, setIsValid] = useState(null);

  return (
    <validTokenContext.Provider
      value={{
        isValid,
        setIsValid,
      }}
    >
      {children}
    </validTokenContext.Provider>
  );
}

export const useIsValidToken = () => useContext(validTokenContext);
