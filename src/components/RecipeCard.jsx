import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { FaClock, FaUtensils, FaEdit, FaTrash } from "react-icons/fa";
import EditRecipeModal from "./EditRecipeModal";

// Import a default image
import defaultRecipeImage from "../assets/images/defaultRecipeImage.jpg";

export default function RecipeCard({
  recipe,
  onDelete = () => {},
  onUpdate = () => {},
  isProfilePage = false,
}) {
  const { user } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);

  if (!recipe) {
    return null;
  }

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const deleteRecipe = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/Recipes/delete/${recipe._id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
      onDelete(recipe._id);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditRecipe = async (updatedRecipe) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BASE_URL}/Recipes/update/${recipe._id}`, updatedRecipe, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
      onUpdate(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const isOwner = recipe?.createdBy?._id === user?._id;

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <img
          src={recipe.image || defaultRecipeImage}
          alt={recipe.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultRecipeImage;
          }}
        />

        <div className="flex justify-between items-center p-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              By: {isOwner ? "You" : recipe?.createdBy?.name || "Unknown"}
            </p>
          </div>
          {user && !isProfilePage && (
            <button
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-colors"
              onClick={() => setShowViewMoreModal(true)}
            >
              View More
            </button>
          )}
          {isProfilePage && isOwner && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                onClick={() => setShowEditModal(true)}
              >
                <FaEdit />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                onClick={deleteRecipe}
                disabled={isDeleting}
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
      {showEditModal && (
        <EditRecipeModal
          recipe={recipe}
          onClose={() => setShowEditModal(false)}
          onEditRecipe={handleEditRecipe}
        />
      )}
      {showViewMoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg transform transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-orange-800">{recipe.title}</h2>
            <p className="text-gray-700 mb-4">
              <strong>Ingredients:</strong> {recipe.ingredients}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Instructions:</strong> {recipe.instructions}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <FaUtensils className="mr-1" />
                <span>{recipe.type}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-1" />
                <span>{recipe.cookingTime} mins</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewMoreModal(false)}
                className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
  isProfilePage: PropTypes.bool,
};