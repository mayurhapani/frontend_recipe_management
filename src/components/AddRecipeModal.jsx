import { useState } from "react";
import PropTypes from "prop-types";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe({ title, ingredients, type, instructions, cookingTime: parseInt(cookingTime) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-semibold p-6 pb-0">Add New Recipe</h2>
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-grow">
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
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Recipe
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
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
