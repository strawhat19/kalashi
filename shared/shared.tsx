'use client';

import React from "react";
import { createContext, useState } from "react";

export const brandName = `Kalashi`;
export const SharedDatabase = createContext({});
export const logoURL = `/images/logos/QuizListLogo.svg`;

export default function SharedData({ children }: { children: React.ReactNode; }) {

  let [beta, setBeta] = useState(false);
  let [user, setUser] = useState<any>(null);
  let [loaded, setLoaded] = useState(false);
  let [darkMode, setDarkMode] = useState(true);

  return <>
    <SharedDatabase.Provider value={{ 
      user, setUser, 
      beta, setBeta,
      loaded, setLoaded,
      darkMode, setDarkMode,
    }}>
      {children}
    </SharedDatabase.Provider>
  </>
}