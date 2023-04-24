import { api } from "@/services/api";
import { setCookies } from 'nookies'
import React, { ReactNode, createContext, useState } from "react";
import Router from 'next/router'

type SignInCredentials = {
    email: string
    password: string
}


type AuthContextData = {
    signIn(credentials: SignInCredentials): Promise<void>
    isAuthenticated: boolean,
    user?: User
}

type AuthProviderProps = {
    children: ReactNode;
}

type User = {
    email:string
    permissions:string[]
    roles:string[]
}


export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()  
  const isAuthenticated = !!user;

  async function signIn({ email, password }: SignInCredentials) {
      try {
        const response = await api.post("sessions", {
          email,
          password,
        });
        const {permissions,roles, token ,refreshToken} = response.data
        setUser({
            email,
            permissions,
            roles
        })

        setCookies(undefined, 'authbasic.token', token, {
            maxAge: 60 * 60 * 24 * 30 // 1 month
        })
        setCookies(undefined, 'authbasic.refreshToken', refreshToken);
        path: '/'

        Router.push('/dashboard') 

      } catch (error) {
         console.log(error)     
      }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}