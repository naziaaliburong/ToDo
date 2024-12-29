This is ToDo web app. On "/" route a signup/login form appears. On successful login the user is navigated to "/dashboard" which is a protected route means only logged in users can access the "/dashboard". The "/dasboard" shows an input to add ToDo item to the list. The ToDo Component is wrapped in between ProtectedRoute Component.If you want to access "/dashboard" remove ProtectedRoute Component from ToDo Component and access it in vercel (i.e. https://to-do-six-rho.vercel.app/dashboard). 

When user clicks edit icon, he gets navigated to /edit route which is also a protected route. After updating list he again redirects to /dashboard.

User can also delete list from /dasboard by clicking on delete icon.

The Screenshoots of the app are in Route.docx. Everything is visually demostrated there.
