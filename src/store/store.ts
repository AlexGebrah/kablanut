import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer: {

    },
});

// Типизация для хуков
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;