import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthProvider";
import Header from "./components/Header";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Signin from "./pages/Signin";
import GlobalLoader from "./components/GlobalLoader";

function App() {
  const { loading } = useContext(AuthContext);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {loading ? (
            <GlobalLoader />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;
