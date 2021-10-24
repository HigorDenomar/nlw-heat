import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

import { api } from '../services/api';

const TOKEN_STORAGE_KEY = "@nlwheat:token";
const CLIENT_ID = "yourGithubClientID";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  async function signIn() {
    try {
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=read:user`;

      const authSessionResponse = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      if (
        authSessionResponse.type === "success" &&
        authSessionResponse.params.error !== "access_denied"
      ) {
        const authResponse = await api.post<AuthResponse>('/authenticate', { code: authSessionResponse.params.code });
        const { user, token } = authResponse.data;

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);

        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }

    setIsSigningIn(false);
  }

  async function signOut() {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);

    setUser(null);
  }

  useEffect(() => {
    async function loadStorageData() {
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      if (tokenStorage) {
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;

        const { data } = await api.get<User>('/profile');

        setUser(data);
      }

      setIsSigningIn(false);
    }

    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isSigningIn,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}