import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function RecipeCard({ recipe, onDelete = () => {}, isProfilePage = false }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!recipe) {
    return null;
  }

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const deleteRecipe = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/v1/Recipes/delete/${recipe._id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
      onDelete(recipe._id);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = recipe?.createdBy?._id === user?._id;

  return (
    <div className="bg-white rounded shadow-xl p-4 mb-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{recipe.title}</h3>
        <p className="text-sm text-gray-600">
          By: {isOwner ? "@You" : `@${recipe?.createdBy?.name || "Unknown"}`}
        </p>
      </div>
      <p className="text-md mb-2">{recipe?.ingredients}</p>
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-600">
          Type: <span className="text-blue-500">{recipe.type}</span>
        </p>
        <p className="text-sm font-semibold text-gray-600">
          Cooking Time: <span className="text-green-500">{recipe.cookingTime} minutes</span>
        </p>
      </div>
      {isProfilePage && isOwner && (
        <div className="mt-4 flex justify-end">
          <button
            className="px-3 py-1 text-sm border-2 rounded text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600 mr-2"
            onClick={() => navigate(`/editRecipe/${recipe._id}`)}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-sm border-2 rounded text-red-600 border-red-600 hover:text-white hover:bg-red-600"
            onClick={deleteRecipe}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  isProfilePage: PropTypes.bool,
};
