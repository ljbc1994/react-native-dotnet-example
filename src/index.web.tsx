import React from "react";
import {Provider} from "react-redux";
import App from "./App";
import { setupStore } from "./state/store";

const store = setupStore({
    preloadedState: (window as any).__data,
});

export default function Root() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}