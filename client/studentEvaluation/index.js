const reviewerName = document.getElementById("reviewerName")
const subjectName = document.getElementById("subjectName")
const comments = document.getElementById("comments")

const tableBody = document.getElementById("formDataBody");
const tableHeader = document.getElementById("tableHeader");
const performanceLevel = document.getElementById("performanceLevel")

const evalContainer = document.getElementById("evalContainer")
const formSubmissionSuccess = document.getElementById("formSubmissionSuccess")
const formSubmissionFail = document.getElementById("formSubmissionFail")

evalContainer.style.display="none"
formSubmissionSuccess.style.display="none"
formSubmissionFail.style.display="none" 

let teamMembersName = ""
let reviewersName = ""

let selectedGrades = []
let numberOfQuestions = 0
let questions = []

async function displayFormData() {
    try {
        const response = await fetch('http://localhost:3005/api/v1/evalFormEdit/getForm');
        if (response.ok) {
            const formData = await response.json();
            populateTable(formData);
        } else {
            console.error('Failed to fetch form data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching form data:', error);
    }
}

function populateTable(formData) {    
    const performanceLevelGrade = document.createElement("div")
    const headerRow = document.createElement("tr");
    
    const attributeHeader = document.createElement("th");
    attributeHeader.textContent = "Attribute";
    headerRow.appendChild(attributeHeader);

    //Gives us how many questions there are
    numberOfQuestions = formData.attributes.length
    
    formData.grades.forEach(grade => {
        const headerCell = document.createElement("th");
        headerCell.textContent = grade.performanceLevel;
        headerRow.appendChild(headerCell);

        const performanceGrade = document.createElement("p")
        performanceGrade.textContent = `${grade.performanceLevel} = ${grade.grade}`
        performanceLevelGrade.appendChild(performanceGrade)
    });

    tableHeader.appendChild(headerRow);
    performanceLevel.appendChild(performanceLevelGrade)
    
    formData.attributes.forEach(attribute => {
        const questionRow = document.createElement("tr");
        const attributeCell = document.createElement("td");
        attributeCell.textContent = attribute.question;
        questionRow.appendChild(attributeCell);
        
        questions.push({id: attribute._id , question: attribute.question})
    
        formData.grades.forEach(grade => {
            const gradeCell = document.createElement("td");
            const radioButton = document.createElement("input");
            radioButton.type = "radio";
            radioButton.name = attribute._id; // Use attribute ID as name attribute
            radioButton.value = grade.grade;
            radioButton.addEventListener("click", function() {
            const selectedValue = this.value;
            const existingIndex = selectedGrades.findIndex(item => item.questionId === attribute._id);
            if (existingIndex !== -1) {
                // If a value for this question is already selected, update it
                selectedGrades[existingIndex].grade = selectedValue;
            } else {
                    // Otherwise, add a new entry to the array
                selectedGrades.push({ questionId: attribute._id, grade: selectedValue });
            }
            // console.log("Selected grades:", selectedGrades);
            });
            gradeCell.appendChild(radioButton);
            questionRow.appendChild(gradeCell);
        });
    
        tableBody.appendChild(questionRow);
    });
}

//Submit Form
const submitFormData = async (e) => {
    //If the number of questions match the selected.length which is getting a grade from each question and putting it in the selectedGrades array 
    if(numberOfQuestions === selectedGrades.length){
        const confirmation = confirm("Are you sure you want to submit from?");
        if (confirmation) {
            const formData = {
                reviewerName: reviewersName,
                subjectName: teamMembersName,
                questions: questions,
                grade: selectedGrades,
                comments: comments.value
            } 
            try {
                const response = await fetch(`http://localhost:3005/api/v1/evalData/submitEval`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
        
                if (response.ok) {
                    console.log("FormData submitted")
                    // Reload the page
                    let evaluatedData = JSON.parse(localStorage.getItem("evaluated")) || [];
                    // Add new data to the array
                    evaluatedData.push(teamMembersName);
                    // Store the updated array back into localStorage
                    localStorage.setItem("evaluated", JSON.stringify(evaluatedData));
                    evalContainer.style.display="none"
                    formSubmissionSuccess.style.display="block"
                    //Resets the page after submission in 2 seconds
                    setInterval(function() {
                        location.reload();
                    }, 2000);
                } else {
                    const error = await response.json();
                    console.error('FormData failed:', error);
                    formSubmissionFail.style.display="block" 
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } 
        
    }else{
        alert("Please select a grade for each attribute before submitting.")
    }
}


//Get Users Team and members
const teamDropdown = document.getElementById("team")

let teamId = ""

async function getTeamId(){
    fetch("http://localhost:3005/api/v1/teams/getAllTeams")
    .then(res => res.json())
    .then(data => {
        data.teams.forEach(team => {
            // Finds the user's email who is logged in and finds what team they are on
            const member = team.members.find(member => member.schoolEmail === localStorage.getItem("email"));
            if (member) {
                // If the member is found, set reviewerName.innerHTML
                reviewerName.innerHTML = `<b>Evaluator:</b> ${member.firstName} ${member.lastName}`;
                // Store the team ID
                teamId = team._id;
                reviewersName = `${member.firstName} ${member.lastName}`
            }
        });
        getTeam();
    })
    .catch(error => {
        console.error('Error:', error);
    });
} 
getTeamId();

//Displays team members
async function getTeam(){
    const evaluatedData = JSON.parse(localStorage.getItem("evaluated")) || [];

    fetch(`http://localhost:3005/api/v1/teams/getTeam/${teamId}`)
    .then(res => res.json())
    .then(data => {

        const option = document.createElement("option");
        option.text = data.team.teamName;
        option.value = data.team._id;
        option.disabled = true;
        teamDropdown.add(option);

        data.team.members.forEach(data =>{
            // Check if the member's email is not the same as the logged-in user's email
            if(localStorage.getItem("email") !== data.schoolEmail) {
                const option = document.createElement("option");
                option.text = `${data.firstName} ${data.lastName}`;
                option.value = data._id;

                let isEvaluated = evaluatedData.includes(`${data.firstName} ${data.lastName}`);
                if (isEvaluated) {
                    option.disabled = true; // Disable the option if it has been evaluated
                }
                
                teamDropdown.add(option);
            }
        })
         // Set the selected index to 0 to display the team name as the default selected option
        teamDropdown.selectedIndex = 0;
    })
}


document.getElementById("team").addEventListener("change", function() {
    evalContainer.style.display="block"
    tableHeader.innerHTML = ""
    tableBody.innerHTML = ""
    performanceLevel.innerHTML = ""
    // Get the selected option
    const selectedOption = this.options[this.selectedIndex];
    //This is so that it doesn't display the team name and only the members
    if(selectedOption.index == 0 ){
        subjectName.innerHTML=`<b>Team Member Evaluating:</b>`
    }else{
        subjectName.innerHTML=`<b>Team Member Evaluating:</b> ${selectedOption.text}`
        teamMembersName = selectedOption.text
    }
    displayFormData()
});
