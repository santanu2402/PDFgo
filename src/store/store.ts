import { create } from 'zustand';
import { produce } from 'immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const useStore = create(
    persist(
        (set, get) => ({
            signInDone: false,
            authType: '',
            user: {
            },
            active: '',
            setUser: (data: object) => set(produce(state => {
                state.user = data;
            })),
            setAuthType: (data: string) => set(produce(state => {
                state.authType = data;
            })),
            setActive: (data: string) => set(produce(state => {
                state.active = data;
            })),
            toggleSignIn: (value:boolean) => set(produce(state => {
                state.signInDone = value;
            })),
        }),
        {
            name: 'pdfgo-app',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);