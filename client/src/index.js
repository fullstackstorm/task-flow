import React from "react";
import App from "./components/App";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { StyleSheetManager } from 'styled-components';

const shouldForwardProp = (prop) => prop !== 'isOpen';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <Router>
            <App />
        </Router>
    </StyleSheetManager>
);
