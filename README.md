# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

VITE_BASE_URL=http://localhost:8001

live url = https://swiftrut-task3-frontend.vercel.app/

admin email = mayur@gmail.com
password = Mayur@123

## Features

### Home Page
- Users can view all recipes.
- Logged-in users can see a "View More" button on each recipe card. Clicking this button opens a modal with full recipe details.
- Non-logged-in users can only see the recipe image, name, and createdBy information.

### Profile Page
- Admin can see all posts of other users and update the status of tasks.
- Admin can assign tasks to other users.
- Users can see tasks given by the admin and tasks they created themselves.
- Tasks are automatically arranged by category (priority). Completed tasks move to the bottom of the list.
- Users can see which tasks are given by the admin (by: @admin).

### Recipe Management
- Admin can edit and delete recipes directly from the profile page.
- Users can add new recipes from the profile page.
- Recipes are displayed with an increased image size and a more compact details section.

### Import/Export
- Go to the profile page to find options for importing and exporting data.
- You can select a CSV file to import data.
- Suggestion: Before importing data, export the old data to understand the data format, then update that file.

### User Roles
- By default, the user role is "user".
- There is only one admin, and new admins cannot be registered for security reasons.

## Theme
- The application uses a consistent theme with gradient colors (orange to yellow) for buttons and headers.
