import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./auth/signIn/SignIn";
import SignUp from "./auth/signUp/SignUp";
import Home from "./home/Home";
import "./app.css";
import Navbar from "./components/Navbar";
import History from "./myPosts/history/History";
import Saved from "./myPosts/saved/Saved";
import PostEdit from "./post/PostEdit";
import PostView from "./post/PostView";
import PostCreate from "./post/PostCreate";
import Protected from "./components/Protected";
import GoogleCallback from "./auth/GoogleCallback";
import UserProfile from "./user/UserProfile";
import VisitedUser from "./user/VisitedUser";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth/google" element={<GoogleCallback />} />
        <Route element={<Protected />}>
          <Route element={<Navbar />}>
            <Route path="/user/:visitedUserId" element={<VisitedUser />} />
            <Route path="/" element={<Home />} />
            <Route path="/view/:id" element={<PostView />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/write" element={<PostCreate />} />
            <Route path="/edit/:id" element={<PostEdit />} />
            <Route path="/posts">
              <Route path="history" element={<History />} />
              <Route path="saved" element={<Saved />} />
            </Route>
          </Route>
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
