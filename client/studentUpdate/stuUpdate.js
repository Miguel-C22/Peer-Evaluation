const students = document.getElementById('students')
const circles = document.getElementById('circles')

authEmails = [];
membersInfo = [];

async function getUsersInfo() {
    //Fetching all users that have created an account
    await fetch("http://localhost:3005/api/v1/auth/getallUsers")
        .then(res => res.json())
        .then(data => {
            data.users.forEach(user => {
                //Storing all the users emails in the authEmail Array
                authEmails.push(user.email);
            });
        });

    //Fetching all teams and members
    await fetch('http://localhost:3005/api/v1/teams/getAllTeams')
        .then(res => res.json())
        .then(data => {
            data.teams.forEach(team => {
                const memberCount = team.members.length; //Getting the number of members per team
                team.members.forEach(member => {
                    // Storing each members info and the memberAmount on there team in a new array that will be pushed to the membersInfo object
                    membersInfo.push({
                        name: member.firstName + " " + member.lastName,
                        number: memberCount,
                        schoolEmail: member.schoolEmail
                    });
                });
            });

            //Calling the other functions after the two fetch request run
            allStudentsDisplay();
            evalUpdates();
        });
}

getUsersInfo();

/* 
This function is displaying all students that have created an account and displaying 
circles to indicate how many students are on there team
*/
async function allStudentsDisplay() {
    //Filtering through all members and matching the emails with students that have created an account
    const filteredMembersEmails = membersInfo.filter(member => authEmails.includes(member.schoolEmail));

    filteredMembersEmails.forEach(data => {
        // Create a container div for each name and circles
        const container = document.createElement("div");
        container.classList.add("student-container");
        // Create element for name
        const newName = document.createElement("p");
        const textName = document.createTextNode(data.name);
        newName.appendChild(textName);
        container.appendChild(newName);

        // Create empty elements (circles) based on the number property
        for (let i = 0; i < data.number - 1; i++) {
            const newCircle = document.createElement("span");
            container.appendChild(newCircle);
        }

        // Append the container to the main container
        students.appendChild(container);
    });
}

/* 
This function is responsible for marking a circle green to indicate that a student has 
filled out an evaluation form for one of their team members. Once all circles are green, 
it signifies that the student has submitted all the evaluation forms for all their team members.
*/
async function evalUpdates() {
    fetch('http://localhost:3005/api/v1/evalData/allEvaluationData')
        .then(res => res.json())
        .then(data => {
            // Count occurrences of each member's name in the fetched data
            const nameCounts = {};
            data.getAllEvalData.forEach(evalData => {
                console.log(evalData)
                membersInfo.forEach(member => {
                    if (evalData.reviewerName.includes(member.name)) {
                        if (nameCounts[member.name]) {
                            nameCounts[member.name]++;
                        } else {
                            nameCounts[member.name] = 1;
                        }
                    }
                });
            });

            // Update circles for each member based on the count
            membersInfo.forEach(member => {
                const studentContainers = document.querySelectorAll('.student-container');

                studentContainers.forEach(container => {
                    const nameParagraph = container.querySelector('p');
                    if (nameParagraph.textContent === member.name) {
                        const circles = container.querySelectorAll('span');
                        for (let i = 0; i < nameCounts[member.name]; i++) {
                            if (circles[i]) {
                                circles[i].classList.add("update"); // Add class to the circle
                            }
                        }
                    }
                });
            });
        });
}


