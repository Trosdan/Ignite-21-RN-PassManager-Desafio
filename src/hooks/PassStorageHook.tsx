import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PassStorageProviderProps {
  children: ReactNode;
}

interface PassStorageContextData {
  savePassword: (loginData: LoginDataProps) => Promise<void>;
  loadPasswords: () => Promise<LoginDataProps[]>;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

const PassStorageContext = createContext({} as PassStorageContextData);

const dataKey = "@passmanager:logins";

function PassStorageProvider({ children }: PassStorageProviderProps) {
  const savePassword = useCallback(async (loginData: LoginDataProps) => {
    const response = await AsyncStorage.getItem(dataKey);

    const searchList: LoginDataProps[] = response ? JSON.parse(response) : [];

    await AsyncStorage.setItem(
      "@passmanager:logins",
      JSON.stringify([...searchList, loginData])
    );
  }, []);

  const loadPasswords = useCallback(async () => {
    const response = await AsyncStorage.getItem(dataKey);
    const searchList: LoginDataProps[] = response ? JSON.parse(response) : [];
    return searchList;
  }, []);

  return (
    <PassStorageContext.Provider value={{ savePassword, loadPasswords }}>
      {children}
    </PassStorageContext.Provider>
  );
}

function usePassStorage() {
  const passStorage = useContext(PassStorageContext);

  return passStorage;
}

export { PassStorageProvider, usePassStorage };
