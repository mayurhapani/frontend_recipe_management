import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
  const { isLoggedIn, userName, logout } = useContext(AuthContext);
  const [logoutModel, setLogoutModel] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLogoutModel(false);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-yellow-500 fixed top-0 left-0 right-0 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold text-white hover:text-yellow-200 transition duration-300"
            >
              Sundaram Enterprise
            </Link>
            <nav>
              <ul className="flex items-center space-x-6">
                <li>
                  <Link to="/" className="text-white hover:text-yellow-200 transition duration-300">
                    Home
                  </Link>
                </li>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-white hover:text-yellow-200 transition duration-300"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/addTask"
                        className="text-white hover:text-yellow-200 transition duration-300"
                      >
                        Add Task
                      </Link>
                    </li>
                    <li className="relative group">
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <FaUser className="text-white group-hover:text-yellow-200 transition duration-300" />
                        <span className="text-white font-semibold group-hover:text-yellow-200 transition duration-300">
                          {userName}
                        </span>
                      </div>
                      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                        <button
                          onClick={() => setLogoutModel(true)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-500 hover:text-white w-full text-left transition duration-300"
                        >
                          <FaSignOutAlt className="inline-block mr-2" />
                          Logout
                        </button>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/signin"
                        className="text-white hover:text-yellow-200 transition duration-300"
                      >
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="text-white hover:text-yellow-200 transition duration-300"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>
      {logoutModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-evenly">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300"
              >
                Log Out
              </button>
              <button
                onClick={() => setLogoutModel(false)}
                className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
