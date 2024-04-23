const email = document.getElementById('eml')
const createPassword = document.getElementById('cpswd')
const confirmPassword = document.getElementById('pswd')
const confirmNewPassword = document.getElementById('confirmNewPassword')
const newPassword = document.getElementById('newPassword')

let allAdminsEmailsAndIds = [] 


const allStudentsEmailId = async () => {
    await fetch('http://localhost:3005/api/v1/adminAuth/getallUsers')
     .then(res => res.json())
     .then(data => {
        console.log(data.users)
         data.users.forEach(users => {
            console.log(users)
            allAdminsEmailsAndIds.push({email: users.email, id: users._id});
         });
     })
 }


const signUp = async () => {
    const signUpInfo = {email: email.value, password: confirmPassword.value }
    try {
        if(createPassword.value === confirmPassword.value){
            const response = await fetch('http://localhost:3005/api/v1/adminAuth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpInfo),
            });
            if (response.ok) {
                window.location.href = "./signIn.html"; 
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


//auto login
async () => {
    if (localStorage.email) {
        await allStudentsEmails();
        if (allStudentsSchoolEmails.includes(localStorage.email)) {
            window.location.href = "../../createTeams/createTeam.html"; 
        }
    }
}



const signIn = async () => {
    const signInInfo = {email: email.value, password: confirmPassword.value }
    try {
            const response = await fetch('http://localhost:3005/api/v1/adminAuth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signInInfo),
            });
            if (response.ok) {
                localStorage.email = signInInfo.email;
                window.location.href = "../../createTeams/createTeam.html"; 
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
    await allStudentsEmailId();

    const findStudentsEmailId = allAdminsEmailsAndIds.filter(data => data.email === email.value);

    if (findStudentsEmailId.length > 0 && confirmNewPassword.value === newPassword.value) {
        const studentsId = findStudentsEmailId[0].id;
        const updatedPassword = { newPassword: confirmNewPassword.value };
        try {
            const response = await fetch(`http://localhost:3005/api/v1/adminAuth/updatePassword/${studentsId}`, {
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
        console.log('No user found with the provided email');
        alert(`Password change unsuccessful. Please ensure that the provided 
        school email is correct and that the new password matches the confirmed password.`);
    }
};