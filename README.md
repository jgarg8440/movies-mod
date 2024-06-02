# Before you can run this project, ensure you have the following installed:

 Node.js (v14 or later)
 npm (v6 or later)
 MongoDB (either locally or using MongoDB Atlas)
 Git


# Setup Instructions

# 1. Clone the Repository

# 2. Install Dependencies
npm install

# 3. Configure Environment Variables
Create a .env file in the root directory of your project and add the following environment variables:

Atlas_url=<your-mongodb-atlas-url>
SECRET=<your-session-secret>


# 4. Run the Application
   node app.js

The server will start running on port 3000. Open your browser and navigate to http://localhost:3000 to access the application.


# Movie Listing Application

This project is a comprehensive movie listing application built using Node.js, Express, MongoDB, and several other modern web development technologies. It features user authentication, movie listing management, and a user-friendly interface for viewing and managing movies.


# Features Implemented
 
# User Authentication
Sign Up: Users can create an account by providing a username, email, and password.
Log In: Existing users can log in using their username and password.
Log Out: Authenticated users can log out of their session.
Session Management: User sessions are managed with cookies, ensuring secure and persistent logins.


# Movie Listings
Public Listings: All users, including non-authenticated visitors, can view a public list of movies.
Private Listings: Only authenticated users can view a private list of movies.
Add Movies: Authenticated users can add new movies to the listing by providing details such as title, year, writer, actors, and a poster image.
Delete Movies: Authenticated users can delete movies from the listing.


# Middleware and Utilities
Session Store: Session data is stored in MongoDB using connect-mongo.
Flash Messages: Flash messages are used to provide feedback to users, such as login errors or success messages.
Body Parsing: body-parser middleware is used to parse incoming request bodies in a middleware before handling them.


# Error Handling
Database Connection: Proper error handling for database connection issues.
Operation Errors: Graceful handling of errors during operations such as adding or deleting movies.


# Security
Cookie Settings: Cookies are configured to be HTTP-only for security.
Environment Variables: Sensitive information like database URLs and session secrets are managed using environment variables.

# Technologies Used

Node.js: Server-side JavaScript runtime environment.
Express.js: Web framework for building the application.
MongoDB: NoSQL database for storing user and movie data.
Mongoose: ODM library for MongoDB, providing a straightforward schema-based solution.
Passport.js: Authentication middleware for Node.js, implementing local strategy for user authentication.
connect-mongo: MongoDB session store for Express and Connect.
EJS: Templating engine for rendering dynamic content in views.
dotenv: Module for loading environment variables from a .env file.
body-parser: Middleware for parsing request bodies.
express-flash: Flash message middleware for Express.


# Project Structure
The project is structured to ensure modularity and maintainability:

movie-listing-app/
├── models/
│   ├── user.js          # Mongoose schema and model for User
│   └── listing.js       # Mongoose schema and model for Listing
├── public/
│   └── (static files like CSS, JS, images)
├── views/
│   ├── listing.ejs      # View for displaying the movie listing
│   ├── login.ejs        # View for login page
│   ├── private.ejs      # View for private movie listing message
│   ├── root.ejs         # Root view after login
│   ├── signup.ejs       # View for signup page
│   └── (other view files)
├── .env                 # Environment variables
├── app.js               # Main application file
└── package.json         # Project metadata and dependencies

