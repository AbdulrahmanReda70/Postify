import "./app.css";
import "./tailwind.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PostsProvider } from "./context/PostsContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ValidTokenContext from "./context/ValidTokenContext";
import {
  createTheme,
  ThemeProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const root = createRoot(document.getElementById("root"));

root.render(
  <ThemeProvider theme={{ [MATERIAL_THEME_ID]: darkTheme }}>
    <JoyCssVarsProvider>
      <CssBaseline enableColorScheme />
      <PostsProvider>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <ValidTokenContext>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </ValidTokenContext>
        </GoogleOAuthProvider>
      </PostsProvider>
    </JoyCssVarsProvider>
  </ThemeProvider>
);
