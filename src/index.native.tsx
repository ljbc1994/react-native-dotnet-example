import React from "react";
import {Provider} from "react-redux";
import App from "./App";
import { setupStore } from "./state/store";

const store = setupStore();

export default function Root() {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    );
}