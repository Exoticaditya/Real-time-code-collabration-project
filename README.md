# Real-Time Code Collaboration Tool

## Project Overview
The Real-Time Code Collaboration Tool is designed to facilitate collaborative coding experiences for developers. It enables multiple users to work on the same codebase simultaneously, providing real-time updates, integrated chat, and version control features.

## Features
- **Real-Time Collaboration:** Multiple users can edit code simultaneously, with live updates reflecting changes across all users’ screens.
- **Integrated Chat:** Built-in chat functionality for users to communicate while coding.
- **Version Control:** Track changes and revert to previous versions of the code.
- **User Authentication:** Secure user login and management using OAuth.
- **Cross-Platform Support:** Accessible on various devices, including desktops and tablets.

## Architecture
The tool is built using a client-server architecture:
- **Frontend:** Developed using React.js for a responsive user interface.
- **Backend:** Node.js and Express.js handle server requests and manage real-time data using Socket.io.
- **Database:** MongoDB is used for storing user data and project files.

## Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Exoticaditya/Real-time-code-collabration-project.git
   ```
2. **Install dependencies:**
   Navigate to both the frontend and backend directories and run:
   ```bash
   npm install
   ```
3. **Start the server:**
   In the backend directory, run:
   ```bash
   npm start
   ```
4. **Start the frontend:**
   In the frontend directory, run:
   ```bash
   npm start
   ```

## Usage Guide
1. **Create an account** or log in using existing credentials.
2. **Create a new project** and invite collaborators by sharing the project link.
3. **Start coding!** Changes made by one user will appear in real-time for all collaborators.
4. **Use the integrated chat** to discuss code changes and collaborate more effectively.

## Conclusion
The Real-Time Code Collaboration Tool aims to streamline the coding process for teams, enhancing productivity and communication. For more information, contributions are welcome!