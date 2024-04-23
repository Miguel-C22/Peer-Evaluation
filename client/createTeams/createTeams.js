let Vw = document.getElementById("View");
let modl2 = document.getElementById("createTeamForm")
let modl1 = document.getElementById("modal1")
const createTeam = document.getElementById("createTeam")

const editFirstName = document.getElementById("editFirstName")
const editLastName = document.getElementById("editLastName")
const editSchoolEmail = document.getElementById("editSchoolEmail")
const removeMember = document.getElementById("removeMember")

const addFirstName = document.getElementById("addFirstName")
const addLastName = document.getElementById("addLastName")
const addSchoolEmail = document.getElementById("addSchoolEmail")
const addMemberBtn = document.getElementById("addMemberBtn")
const editTeamName = document.getElementById("editTeamName")
const editTeamNameBtn = document.getElementById("editTeamNameBtn")
const removeTeamBtn = document.getElementById("removeTeamBtn")

const evalForms = document.getElementById("evalForms")

const closeModal1 = document.getElementById("closeModal1")
const closeModal2 = document.getElementById("closeModal2")
const closeEvalForms = document.getElementById("closeEvalForms")

evalForms.style.display="none"
closeEvalForms.style.display="none"

let index = 0;

let individualStudentsEvalData = []

closeEvalForms.onclick = function(){
    evalForms.style.display="none"
    closeEvalForms.style.display="none"
    evalForms.innerHTML=""
}

closeModal1.onclick = function (){
    modl1.style.display = 'none' 
}

closeModal2.onclick = function(){
    modl2.style.display = "none"
}



async function ViewDataBase(){
    fetch('http://localhost:3005/api/v1/teams/getAllTeams')
    .then(res => res.json())
    .then(data => {
        data.teams.map(data => {

            //Displays Teams and Members
            const dal = document.createElement('div');
            dal.className = 'Stupen';
            dal.id = index;

            const trigg = document.createElement("button");
            trigg.className = "arr";
            trigg.id = index;

            Vw.append(dal);
            let dalAbb = document.createElement('a');
            dalAbb.id = "abb";
            dalAbb.append(`${data.teamName} `);
            dalAbb.append(trigg);
            dal.append(dalAbb);
                    
            const tab = document.createElement("div");
            tab.className = "table";
            tab.id = index;

            const edit = document.createElement("button");
            edit.className = "btn";
            edit.id = index;
            edit.textContent = "Edit"

            Vw.append(tab);

            let topAbb = document.createElement('a');
            topAbb.append(`${data.teamName} `);
            topAbb.append(edit);
            topAbb.id = "abb";
            tab.append(topAbb);
                    
            //Display Team Edit Modal
            edit.onclick = function(){
                modl2.style.display = 'Block'
                editTeamName.value = data.teamName
                document.getElementById("tag1").innerHTML = data.teamName
                document.getElementById("tag2").innerHTML = data.teamName

                //Adds a TeamMember to team
                addMemberBtn.addEventListener("click", async function(event) {
                    event.preventDefault(); 
                    const teamId = data._id; 
                    const addTeamMemberInfo = {
                        firstName: addFirstName.value,
                        lastName: addLastName.value,
                        schoolEmail: addSchoolEmail.value,
                    };
                    
                        try {
                            const addTeamMemberResponse = await fetch(`http://localhost:3005/api/v1/teams/createTeamMember/${teamId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(addTeamMemberInfo),
                            });
                        
                            console.log("Added Team Member", addTeamMemberResponse);
                            location.reload();
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });
                    
                // Editing the team name
                editTeamNameBtn.addEventListener("click", async function(event) {
                    event.preventDefault(); 
                    const teamId = data._id; 
                    const newTeamName = {
                        teamName: editTeamName.value,
                    };
                    
                        try {
                            const editTeamNameResponse = await fetch(`http://localhost:3005/api/v1/teams/updateTeamName/${teamId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(newTeamName),
                            });
                        
                            console.log("Added Team Member", editTeamNameResponse);
                            location.reload();
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    });

                // Deletes Team and all it's members
                removeTeamBtn.addEventListener("click", async function(event){
                    event.preventDefault(); 
                    const teamId = data._id; 
                    try {
                        const editTeamNameResponse = await fetch(`http://localhost:3005/api/v1/teams/deleteTeam/${teamId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                    
                        console.log("Deleted Team", editTeamNameResponse);
                        location.reload();
                    } catch (error) {
                        console.error('Error:', error);
                    }
                    })
                }
                
                //Displays and Hides members on each team   
                trigg.onclick = function(){                       
                    if (tab.style.display === "none") {
                        // If the tab is currently hidden, show it
                        tab.style.display = "block";
                    } else {
                        // If the tab is currently visible, hide it
                        tab.style.display = "none";
                        modl1.style.display = 'none';
                        modl2.style.display = 'none';
                    }
                }

                let index2 = 0

                //Individual member
                data.members.map(data2 => { 
                    
                    const edi = document.createElement("button");
                    edi.className = "EditBTN";
                    edi.id = index2;
                    edi.textContent = "Edit";

                    const res = document.createElement("button");                                          
                    res.className = "ResultsBTN";
                    res.id = index2;
                    res.textContent = "Results";

                    //Grabbing all eval data results for an individual student
                    res.onclick = async function (){
                        evalForms.style.display="flex"
                        closeEvalForms.style.display="block"
                        evalForms.innerHTML = ""
                        individualStudentsEvalData = []
                        await fetch(`http://localhost:3005/api/v1/evalData/studentEvalData/${data2.firstName} ${data2.lastName}`)
                        .then(res => res.json())
                        .then(data => {
                            data.studentEvalData.map(data => {
                                console.log(data)
                                individualStudentsEvalData.push(data)
                                console.log(individualStudentsEvalData.length)
                            })
                            if(individualStudentsEvalData.length == []){
                                evalForms.innerHTML = `No forms for ${data2.firstName} ${data2.lastName} yet`
                            }else{
                                nameHeader = document.createElement('h2');
                                evalForms.appendChild(nameHeader);
                                nameHeader.innerHTML = `Results for ${data2.firstName} ${data2.lastName}`;


                                displayEachEvalForm()
                                //print button
                                    printBtn = document.createElement('button')
                                    evalForms.appendChild(printBtn)
                                    printBtn.id = "printBtn";
                                    printBtn.textContent = "Print";
        
                                    printBtn.onclick = function () {
                                        print();
                                    }
                            }
                        })
                    }

                    //Displaying all the eval form results for the specific individual
                    async function displayEachEvalForm() {
                        individualStudentsEvalData.forEach(data => {
                            const evalForm = document.createElement('div');
                            evalForm.classList.add('evaluation-form');
                    
                            // Add reviewer name to the form
                            const reviewerName = document.createElement('h3');
                            reviewerName.textContent = `Reviewer: ${data.reviewerName}`;
                            evalForm.appendChild(reviewerName);
                    
                            // Create a table element
                            const table = document.createElement('table');
                    
                            // Add table rows for questions and grades
                            data.questions.forEach((questionData, index) => {
                                const row = table.insertRow();
                    
                                // Add question cell
                                const questionCell = row.insertCell();
                                questionCell.textContent = `Question ${index + 1}: ${questionData.question}`;
                    
                                // Add grade cell
                                const gradeCell = row.insertCell();
                                gradeCell.textContent = `Grade: ${data.grade[index].grade}`;
                            });
                    
                            // Append the table to the evalForm
                            evalForm.appendChild(table);
                    
                            // Add comments below the table
                            const comments = document.createElement('p');
                            comments.innerHTML = `${data.comments.replace(/\\n/g, "__NEWLINE__").replace(/__NEWLINE__/g, "<br>")}`;
                            evalForm.appendChild(comments);
                    
                            // Get the evalForms container and append the evalForm
                            const evalForms = document.getElementById("evalForms");
                            if (evalForms) {
                                evalForms.appendChild(evalForm);
                            } else {
                                console.error("evalForms container not found");
                            }
                        });
                    }

            
                    // Opens modal for each team member which then you can edit or remove that specific member
                    edi.onclick = function(){             
                        document.getElementById("memnam").innerHTML = `${data2.firstName} ${data2.lastName}`
                        modl1.style.display = 'Block'
                        editFirstName.value = data2.firstName 
                        editLastName.value = data2.lastName
                        editSchoolEmail.value = data2.schoolEmail

                    // Update or Remove Team Member Modal
                    modl1.addEventListener('submit', async function(event) {
                        const updatedMemberInfo = {
                            firstName: editFirstName.value,
                            lastName: editLastName.value,
                            schoolEmail: editSchoolEmail.value
                        }
        
                        try {
                            const updateTeamMember = await fetch(`http://localhost:3005/api/v1/teams/updateTeamMember/${data2._id}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(updatedMemberInfo),
                            });
                            console.log("updated Team member Success" + updateTeamMember)
                        } catch (error) {
                            console.error('Error:', error);
                        }
                    })
                        
                    //Removes a member from the team
                    removeMember.addEventListener("click", async function (){
                        try {
                            const removeTeamMember = await fetch(`http://localhost:3005/api/v1/teams/deleteMember/${data2._id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            console.log("Removed Team Member" + removeTeamMember)
                        } catch (error) {
                            console.error('Error:', error);
                        }
                        })
                    }    

                    const lib = document.createElement('a');
                    lib.id = 'abb';
                    tab.append(lib);
                    lib.append(`${data2.firstName} ${data2.lastName}`);
                    lib.append(edi);
                    lib.append(res);

                    index2++
                });
            index++;
        });
    });
};
ViewDataBase()        

//CSV
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
            
    const formData = new FormData();
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    formData.append('csvFile', file);
          
    try {
        const response = await fetch('http://localhost:3005/api/v1/teams/createTeamsCSV', {
        method: 'POST',
        body: formData
    });

        const data = await response.json();
        document.getElementById('message').textContent = data.success || data.error;
        location.reload(); // Reload the page
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred while uploading the file.';
    }
});

//Adding another member when creating a new team
document.getElementById("addAnotherMemberBtn").addEventListener("click", function() {
    const membersContainer = document.getElementById("members");
    const newMemberDiv = document.createElement("div");
    newMemberDiv.className = "member";
    newMemberDiv.innerHTML = `
        <input type="text" class="firstName" placeholder="FirstName" required>
        <input type="text" class="lastName" placeholder="LastName" required>
        <input type="email" class="schoolEmail" placeholder="schoolEmail" required>
    `;
    membersContainer.appendChild(newMemberDiv);
});

//Add another Member when creating a team
document.getElementById("createTeam").addEventListener("submit", async function(event) {
event.preventDefault(); //Important
    const teamName = document.getElementById("teamName").value;

    // Collect member data
    const members = [];
    //Selecting each div that has a members info
    const memberDivs = document.querySelectorAll(".member");
    //Grabbing that info value and pushing into the members object so it can store all members info
    memberDivs.forEach(memberDiv => {
        const firstName = memberDiv.querySelector(".firstName").value;
        const lastName = memberDiv.querySelector(".lastName").value;
        const schoolEmail = memberDiv.querySelector(".schoolEmail").value;
        members.push({ firstName, lastName, schoolEmail });
    });

    const teamData = { teamName, members };

    try {
        const response = await fetch('http://localhost:3005/api/v1/teams/createTeams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teamData),
        });

        if (response.ok) {
            console.log("Team created successfully!");
            // Optionally, you can redirect the user to another page or show a success message
            location.reload(); //Important
        } else {
            console.error("Failed to create team:", response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



// Function to send DELETE requests
async function sendDeleteRequest(url) {
    const result = confirm("Are you sure you want to proceed?");
    if (result) {
        alert("You clicked OK");
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log("Delete request successful");
                location.reload(); // Reload the page
            } else {
                console.error("Failed to delete data:", response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        alert("You clicked Cancel");
    }
   
}

// Event listeners for each button
document.getElementById("removeAllTeams").addEventListener("click", function() {
    sendDeleteRequest('http://localhost:3005/api/v1/teams/removeAllTeams');
});

document.getElementById("removeAllEvalData").addEventListener("click", function() {
    sendDeleteRequest('http://localhost:3005/api/v1/evalData/removeAllEvalData');
});

document.getElementById("removeAllStudentUsers").addEventListener("click", function() {
    sendDeleteRequest('http://localhost:3005/api/v1/auth/removeAllAuth');
});