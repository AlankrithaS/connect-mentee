import React, { createContext, useContext, useState, useEffect } from 'react';
import PocketBase, { AsyncAuthStore } from 'pocketbase';
import * as SecureStore from 'expo-secure-store';

const PocketBaseContext = createContext();

export const usePocketBase = () => useContext(PocketBaseContext);

export const PocketBaseProvider = ({ children }) => {
  const [pb, setPb] = useState();

  useEffect(() => {
    const initializePocketBase = async () => {
      // This is where our auth session will be stored using expo-secure-store
      const store = new AsyncAuthStore({
        save: async (serialized) => {
          await SecureStore.setItemAsync('pb_auth', serialized);
        },
        initial: await SecureStore.getItemAsync('pb_auth'),
        clear: async () => {
          await SecureStore.deleteItemAsync('pb_auth');
        },
      });
      const pbInstance = new PocketBase('http://127.0.0.1:8090', store);
      setPb(pbInstance);
    };

    initializePocketBase();
  }, []);

  return (
    <PocketBaseContext.Provider value={{ pb }}>
      {children}
    </PocketBaseContext.Provider>
  );
};
