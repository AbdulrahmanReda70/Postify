import "./app.css";
import "./tailwind.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { HomePostsProvider } from "./context/PostsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ValidTokenContext from "./context/ValidTokenContext";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const GOOGLE_CLIENT_ID =
  "284609296896-t6pojjda9iep8e5ho79fvq192qf572tq.apps.googleusercontent.com";
const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={darkTheme}>
    <HomePostsProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ValidTokenContext>
          <App />
        </ValidTokenContext>
      </GoogleOAuthProvider>
    </HomePostsProvider>
  </ThemeProvider>
);
