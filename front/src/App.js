import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./auth/signIn/SignIn";
import SignUp from "./auth/signUp/SignUp";
import Home from "./home/Home";
import Navbar from "./components/Navbar";
// import History from "./myPosts/history/History";
// import Saved from "./myPosts/saved/Saved";
// import PostEdit from "./post/PostEdit";
// import PostView from "./post/PostView";
// import PostCreate from "./post/PostCreate";
import Protected from "./components/Protected";
import GoogleCallback from "./auth/GoogleCallback";
// import UserProfile from "./user/UserProfile";
import VisitedUser from "./user/VisitedUser";
// import NotFound from "./pages/NotFound";
// import Notifications from "./pages/Notifications";
import { Suspense, lazy, useEffect } from "react";
import { fetch_u } from "./utility/fetch";
import { usePosts } from "./context/PostsContext";
import Test from "./pages/Test";
import { initialPost } from "./utility/initialPost";

// Lazy-loaded components
const History = lazy(() => import("./myPosts/history/History"));
const Saved = lazy(() => import("./myPosts/saved/Saved"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Notifications = lazy(() => import("./pages/Notifications"));
const PostEdit = lazy(() => import("./post/PostEdit"));
const PostView = lazy(() => import("./post/PostView"));
const UserProfile = lazy(() => import("./user/UserProfile"));
const PostCreate = lazy(() => import("./post/PostCreate"));

function App() {
  const { setFirstPost, setAllPosts } = usePosts();
  setFirstPost(initialPost);

  useEffect(() => {
    const initialSpinner = document.querySelector("#preload-spinner-container");
    if (initialSpinner) initialSpinner.style.display = "none";
  }, []);

  function SuspenseLoading() {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<SuspenseLoading />}>
        <Routes>
          <Route path="/auth/google" element={<GoogleCallback />} />
          <Route path="/t" element={<Test />} />
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
      </Suspense>
    </Router>
  );
}
export default App;
