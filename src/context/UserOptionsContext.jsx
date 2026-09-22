import { createContext, useContext } from "react";
import useUserInformationLogic from "../hooks/useUserInformationLogic";
const UserOptionsContext = createContext(null);

export const UserOptionsProvider = ({ children }) => {
  const userOptionsLogic = useUserInformationLogic();

  return (
    <UserOptionsContext.Provider value={userOptionsLogic}>
      {children}
    </UserOptionsContext.Provider>
  );
};

export const useUserOptions = () => {
  const context = useContext(UserOptionsContext);
  if (!context) {
    throw new Error("useUserOptions must be used inside UserOptions Provider");
  }
  return context;
};
