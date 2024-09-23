import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const cookies = new Cookies();

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [file, setFile] = useState(null);

  const { setIsLoggedIn, setLogInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setId(response.data.data._id);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
  }, []);

  const sendData = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Missing access token. User needs to be authenticated.");
        return;
      }

      let user = !password.trim() === "" ? { name, email, password } : { name, email };

      const response = await axios.patch(`${BASE_URL}/users/update/${id}`, user, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Missing access token. User needs to be authenticated.");
        return;
      }

      const response = await axios.delete(`${BASE_URL}/users/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("id");

      cookies.remove("token", { path: "/", sameSite: "None", secure: true });
      cookies.remove("token");

      setIsLoggedIn(false);
      setLogInUser({});
      toast.success(response.data.message);
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  // Handle file selection for import
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Import function
  const handleImport = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Missing access token. User needs to be authenticated.");
      return;
    }

    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${BASE_URL}/tasks/import`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error importing tasks");
    }
  };

  // Export function
  const handleExport = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Missing access token. User needs to be authenticated.");
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/tasks/export`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error exporting tasks");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700 text-center">Profile Settings</h2>
        <form className="space-y-4" onSubmit={sendData}>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            type="submit"
          >
            Save Changes
          </button>
        </form>

        <div className="mt-6">
          <button
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
            onClick={deleteUser}
          >
            Delete User
          </button>
        </div>

        {/* Import & Export Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Import & Export Tasks</h3>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4 file:rounded-full
            file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          />
          <button
            onClick={handleImport}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition mb-4"
          >
            Import Tasks
          </button>
          <button
            onClick={handleExport}
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
          >
            Export Tasks
          </button>
        </div>
      </div>
    </div>
  );
}
