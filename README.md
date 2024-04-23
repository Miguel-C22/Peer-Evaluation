ATC Peer Evaluation file layout

**Highly recommend using Visual Studio Code for your code editor**

**Make sure you have Node.js installed on your computer**

**At the very bottom will be directions on how to run the backend on your local machine. If you do not run the backend this application will not work properly***

- client folder
    The Client Folder will have all of the font end code. 

    ***NOTE*** 
    Each folder in the 'client' folder  will be to a specific page and will have its own HTML, JS, and CSS files. 
    The only file that is shared with every page in this application will be the 'main.css' file which contains the general style for this application

    ***Here is a breakdown of the client folder***

    - authentication folder 
        The 'authentication' folder has all the Auth code which is the Login, Sign up, and Forget Password. 
        inside the 'authentication' folder it will have a 'professors' and 'students' folder. ''
        - 'professors' folder will contain the Auth for the professors
        - 'students' folder will contain the Auth for the students

    - createTeams folder
        **This page is for the professors only**
        . Lets the professors create teams manually 
        . Create a team by uploading a csv file
        . Displays all the teams
        . Edit existing teams or members
        . Allows the professors to check the results for each student
        . Remove all Evaluation Data
        . Remove all Student Users
        . Remove all the Evaluation Form Data

    - formEdit folder
        **This page is for the professors only**
        . Let professors update the evaluation form that the students will be using to evaluate each other

    - StudentUpdate folder
        **This page is for the professors only**
        . Let professors see which students have created an account
        . Gives the professor updates on each student to see how many members on their team they have evaluated

    - studentsEvaluation folder
        **This page is for the students**
        . This is the only page students will have access to after creating an account
        . Lets them evaluate each member on their team

    - header folder
        . This is the header for all pages

    - images folder
        . All images for this application are in this folder




- server folder 
    The Server Folder will have all the back end code

    - controllers folder
        Here is a quick break down for each file

        - adminAuth.js
            Holds all the functionality for storing the data when a professor Logs in, Creates Account, or Change Password

        - auth.js
            Holds all the functionality for storing the data when a student Logs in, Creates Account, or Change Password

        - evalData.js
            Holds all the functionality for storing the data when a student submits a evaluation form for their peers

        - evalFromEdit.js
            Holds all the functionality for storing the data when a professor changes the form that the students use for evaluation each other

        - evalFromEdit.js
            Holds all the functionality for storing all the teams that are created
        
     - db folder
        This is a utility function which is imported to the 'app.js' folder for connecting to the MongoDb database

    - node_modules folder
        **IMPORTANT**
        - No need to worry about this folder for this project

    - routes folder 
        . Contains all the specific endpoints for each route/URL
        . Goes with the 'controllers' folder

    - schema folder 
        This folder contains how the data is stored for each table in MongoDB

        - adminAuth.js
            data table layout for professors Logs in, Creates Account, or Change Password data

        - auth.js
            data table layout for students Logs in, Creates Account, or Change Password data

        - evalData.js
            data table layout for storing the data when a student submits a evaluation form for their peers

        - evalFromEdit.js
            data table layout for storing the data when a professor changes the form that the students use for evaluation each other

        - evalFromEdit.js
            data table layout for storing all the teams that are created

    - .env folder 
        **IMPORTANT**
        This is the URL for connecting to the MongoDB data base

        .env file is meant for storing personal data so when you upload your code to github for example no one will be able to see or access this folder
        as well as protects impotent information from users that use your application. So when a user goes and looks at the code through the Dev Tools
        all your personal information will be hidden.

    - app.js folder
        This brings everything together and runs the backend
        

    - package.json files don't worry much about
        Its for installing npm packages

        - You will see this when you open up the 'package.json' file
        These are all the NPM packages that you needed to use for this application
        Without these NPM packages this application will not work

        Example: 
        "dependencies": {
            "bcrypt": "^5.1.1",
            "bcryptjs": "^2.4.3",
            "cors": "^2.8.5",
            "csvtojson": "^2.0.10",
            "dotenv": "^16.4.1",
            "express": "^4.18.2",
            "express-fileupload": "^1.4.3",
            "http-status-codes": "^2.3.0",
            "mongodb": "^6.3.0",
            "mongoose": "^8.1.1"
        },
        



**HOW TO RUN THE BACKEND ON YOUR LOCAL MACHINE**

1. Open up the PeerEvaluation Folder in Visual Studio Code
2. Go to the terminal in Visual Studio Code that is located in the top nav bar 

Once you have the terminal opened in Visual Studio Code follow these steps to access the server folder directory 

- Type 
1. $ cd server
2. $ npm install | ***This will install all the NPM packages that you will need to run this application **Only need to do once** ***
3. $ npm start | ***This will run the backend server on your local machine you should see "Server is listening on port 3005..." in your terminal***
    

You will need to go to the front end add in each JS file change fetch request url to this "http://localhost:3005". everything after this in the url keep the same

Example:
   async function fetchFormData() {
    try {
        const response = await fetch('http://localhost:3005/api/v1/evalFormEdit/getForm');
        if (response.ok) {
            const formData = await response.json();
            displayFormData(formData);
        } else {
            console.error('Failed to fetch form data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching form data:', error);
    }
}