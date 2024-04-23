const email = document.getElementById('eml')
const createPassword = document.getElementById('cpswd')
const confirmPassword = document.getElementById('pswd')
const confirmNewPassword = document.getElementById('confirmNewPassword')
const newPassword = document.getElementById('newPassword')

let allStudentsSchoolEmails = [] // Stores the Students emails from all teams that the teachers created
let allStudentsSchoolEmailsAndIds = [] // Stores all the students emails and id's of all students that created an account



/*
Teachers will create the teams and assign members to each team with the students name and school email address.
We are grabbing all the students emails from all the teams 
and putting the students emails in "let allStudentsSchoolEmails = []"
*/
const allStudentsEmails = async () => {
   await fetch('http://localhost:3005/api/v1/teams/getAllTeams')
    .then(res => res.json())
    .then(data => {
        data.teams.forEach(team => {
            team.members.forEach(member => {
                allStudentsSchoolEmails.push(member.schoolEmail);
            });
        });
    })
}


/*
Fetching all the students that have created and account and putting there emails and Id in "let allStudentsSchoolEmailsAndIds = []"
Where we will the filter through in "changePassword()" function
*/
const allStudentsEmailId = async () => {
    await fetch('http://localhost:3005/api/v1/auth/getallUsers')
     .then(res => res.json())
     .then(data => {
        console.log(data.users)
         data.users.forEach(users => {
            console.log(users)
            allStudentsSchoolEmailsAndIds.push({email: users.email, id: users._id});
         });
     })
 }


/*
We are filtering through "let allStudentsSchoolEmails = []" to match the 
"email.value" of what the user enters in the email input field.

We are then seeing if "email.value" is matching any emails in the "let allStudentsSchoolEmails = []" using the ".filter()". 
If it does match it will create the account for the student. If it doesn't match then the student/user 
cannot make an account 

This is so the Teachers have full control on who can make accounts

*/
const signUp = async () => {
    
    await allStudentsEmails() // Calling the AllStudentsEmails function
    const findStudentsEmail = allStudentsSchoolEmails.filter(data => data === email.value); // Filtering Through
    const signUpInfo = {email: email.value, password: confirmPassword.value }
    console.log(allStudentsSchoolEmails)
    try {
        if(createPassword.value === confirmPassword.value && findStudentsEmail.length > 0){
            const response = await fetch('http://localhost:3005/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpInfo),
            });
            if (response.ok) {
                window.location.href = "./signIn.html"; // redirect to the login page
                alert("Account has been created");
            } else {
                alert(`Registration failed. Please try again using a school email 
                only and ensure the password is at least 6 characters long.`);
                const error = await response.json();
                console.error('Registration failed:', error);
            }
        }else{
            console.log('failed creating users account')
            alert(`Registration failed. Please try again using a school email 
            only and ensure the password is at least 6 characters long.`);
        }
    } catch (error) {
        console.log(error)
    }
}

const signIn = async () => {
    const signInInfo = {email: email.value, password: confirmPassword.value }
    try {
            const response = await fetch('http://localhost:3005/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signInInfo),
            });
            if (response.ok) {
                window.location.href = "../../studentEvaluation/index.html"; // redirect to the login page
                localStorage.setItem("email", signInInfo.email);
                
            } else {
                alert("Check email or password. If you do not have an account please create one using your school email only");
                const error = await response.json();
                console.error('Registration failed:', error);
            }
    } catch (error) {
        console.log(error)
    }
}


const changePassword = async () => {
    // Call allStudentsEmailId function to populate allStudentsSchoolEmailsAndIds array
    await allStudentsEmailId();

    // Now that allStudentsSchoolEmailsAndIds is populated, you can filter it
    const findStudentsEmailId = allStudentsSchoolEmailsAndIds.filter(data => data.email === email.value);

    // Check if any matching user is found and that the new password matches the confirmed password
    if (findStudentsEmailId.length > 0 && confirmNewPassword.value === newPassword.value) {
        const studentsId = findStudentsEmailId[0].id;
        const updatedPassword = { newPassword: confirmNewPassword.value };
        try {
            const response = await fetch(`http://localhost:3005/api/v1/auth/updatePassword/${studentsId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPassword),
            });

            if (response.ok) {
                window.location.href = "./signIn.html";
                alert("Password Changed");
            } else {
                alert(`Password change unsuccessful. Please ensure that the provided school 
                email is correct and that the new password matches the confirmed password.`);
                const error = await response.json();
                console.error('Password change failed:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        // Handle case where no user with the provided email is found or new password and confirmed password does not match
        console.log('No user found with the provided email');
        alert(`Password change unsuccessful. Please ensure that the provided 
        school email is correct and that the new password matches the confirmed password.`);
    }
};