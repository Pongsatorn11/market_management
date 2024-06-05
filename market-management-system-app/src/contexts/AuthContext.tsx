import React, { useState, createContext, ReactNode, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../interfaces/user.interface';
import { axiosInstance } from '../axiosRequest';

interface AuthContextType {
  refreshSelf: () => void;
  user: IUser | null;
  saveUser: (token: string) => void;
  removeUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  refreshSelf: () => { },
  user: null,
  saveUser: () => { },
  removeUser: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      try{
        const response = await axiosInstance.get('/users/self');
        setUser(response.data);
      }catch(error){
        console.log(error);
      }
    }
    checkToken();
  }, []);

  const refreshSelf = async () => {
    try{
      const response = await axiosInstance.get('/users/self');
      setUser(response.data);
    }catch(error){
      console.log(error);
    }
  }

  const saveUser = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      const response = await axiosInstance.get('/users/self');
      setUser(response.data);
    } catch (error) {
      console.log(error)
    }
  }

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider value={{ refreshSelf, user, saveUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
}