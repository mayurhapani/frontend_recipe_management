import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { checkLoginStatus } = useContext(AuthContext);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    // Fetch recipes when component mounts
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/Recipes/getRecipes`);
        const fetchedRecipes = response.data.data;
        setRecipes(fetchedRecipes);

        // Extract unique cuisines
        const uniqueCuisines = [...new Set(fetchedRecipes.map((recipe) => recipe.cuisine))];
        setCuisines(uniqueCuisines);
      } catch (error) {
        toast.error("Failed to fetch recipes");
      }
    };

    fetchRecipes();
  }, [BASE_URL]);

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 min-h-screen">
      <div className="container mx-auto px-4 pt-20 pb-8">
        <h1 className="text-4xl font-bold text-center text-orange-800 mb-8">
          Delicious Recipes from Around the World
        </h1>

        {/* Search input */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                type="text"
                id="search"
                placeholder="Search cuisines or recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Cuisine tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSearchTerm(cuisine)}
              className="px-4 py-2 text-sm font-medium bg-white text-orange-700 hover:bg-orange-50 border border-orange-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Recipe grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No recipes found for &ldquo;{searchTerm}&rdquo;.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
