import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import { store } from "./store/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* Redux Provider */}
        <Provider store={store}>
            {/* React Router */}
            <BrowserRouter>
                <App />
                
                {/* Toast notifications */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: "#2d2d2d",
                            color: "#fff",
                            border: "1px solid #3d3d3d"
                        },
                        success: {
                            iconTheme: {
                                primary: "#4f46e5",
                                secondary: "#fff"
                            }
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#fff"
                            }
                        }
                    }}
                />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);