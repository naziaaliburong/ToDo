This is ToDo web app. On "/" route a signup/login form appears. On successful login the user is navigated to "/dashboard" which is a protected route means only logged in users can access the "/dashboard". The "/dasboard" shows an input, edit icon, and delete icon to add, edit, and delete ToDo item respectively. All protected routes' components are wrapped in ProtectedRoute component. If you want to access any protected route log in first or simply delete ProtectedRoute component from App.js in frontend folder.

When user click + button, he adds a list.

When user clicks edit icon, he gets navigated to /edit route which is also a protected route. After updating list he again redirects to /dashboard.

User can also delete list from /dasboard by clicking on delete icon.

The Screenshoots of the app are in Route.docx. Everything is visually demostrated there. 

Note: Deploy the backend for making the app functional, but first replace http://localhost:5000 with backend hosted URL. If you are in haste, just check screenshoots to understand the functionality. 
