import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const recipeTypes = [
  "AMERICAN",
  "THAI",
  "ITALIAN",
  "ASIAN",
  "MEXICAN",
  "FRENCH",
  "INDIAN",
  "CHINESE",
  "JAPANESE",
];

const cookingTimes = [15, 20, 30, 45, 60];

export default function AddRecipeModal({ onClose, onAddRecipe }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [type, setType] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [image, setImage] = useState(null);

  const loadFile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image || !title || !ingredients || !instructions || !type || !cookingTime) {
        toast.error("All fields are required");
        return;
      }

      // image upload to Cloudinary
      const dataImage = new FormData();
      dataImage.append("file", image);
      dataImage.append("upload_preset", "instaClone");
      dataImage.append("cloud_name", "mayurcloud21");
      dataImage.append("folder", "recipeManagement");

      const responseImage = await axios.post(
        "https://api.cloudinary.com/v1_1/mayurcloud21/upload",
        dataImage,
        { withCredentials: false }
      );
      const uploadedImagePath = responseImage.data.url;

      // Call onAddRecipe with the recipe data including the image URL
      onAddRecipe({
        title,
        ingredients,
        instructions,
        type,
        cookingTime,
        image: uploadedImagePath,
      });

      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-20 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ingredients" className="block text-gray-700 font-bold mb-2">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a type</option>
              {recipeTypes.map((recipeType) => (
                <option key={recipeType} value={recipeType}>
                  {recipeType}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="instructions" className="block text-gray-700 font-bold mb-2">
              Instructions
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="cookingTime" className="block text-gray-700 font-bold mb-2">
              Cooking Time (minutes)
            </label>
            <select
              id="cookingTime"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select cooking time</option>
              {cookingTimes.map((time) => (
                <option key={time} value={time}>
                  {time} mins
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <img
              className="w-full h-56 object-cover"
              src={image ? URL.createObjectURL(image) : "placeholder_image_url"}
              alt=""
              id="output"
            />
            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor="image">
              Recipe Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={loadFile}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AddRecipeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddRecipe: PropTypes.func.isRequired,
};