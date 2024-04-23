const topHead = document.getElementsByTagName('header')[0];

/*create the top bar */

//create the yellow headbar

const headDiv = topHead.appendChild(document.createElement("div"));
headDiv.id = 'headbar';
//create logo
const atcLogo = headDiv.appendChild(document.createElement('img'));
atcLogo.id = 'ATClogo';
atcLogo.src = '../images/anokalogo1.png';
//create username and profile pic
const userBox = headDiv.appendChild(document.createElement('div'));
userBox.id = 'userbox';
const userImage = userBox.appendChild(document.createElement('img'));
userImage.id = 'userimage';
userImage.src = '../images/unknownuser.png';
const userName = userBox.appendChild(document.createElement('button'));
userName.id = 'username';


/*get username and set it*/
const setName = async () => {
    try {
        userName.textContent = localStorage.email;
    }
    catch (e) {
        userName.textContent = 'Username';
    }
}
setName();

userName.type = 'button';

/*create the popup box */

//create the popup
const popUpBox = topHead.appendChild(document.createElement('div'));
popUpBox.id = 'popupFloat';

const popUser = popUpBox.appendChild(document.createElement('img'));
popUser.id = 'popUser';
popUser.src = '../images/unknownuser.png';

//buttons
const buttonsDiv = popUpBox.appendChild(document.createElement('div'))
buttonsDiv.className = 'buttonsDiv';
const signOutBtn = buttonsDiv.appendChild(document.createElement('input'));
const homeBtn = buttonsDiv.appendChild(document.createElement('input'));
const backBtn = popUpBox.appendChild(document.createElement('input'));

signOutBtn.type = 'button';
homeBtn.type = 'button';
backBtn.type = 'button';

signOutBtn.className = 'buttons';
homeBtn.className = 'buttons';
backBtn.className = 'buttond';

signOutBtn.id = 'signOutBtn';
homeBtn.id = 'homeBtn';
backBtn.id = 'backBtn';

signOutBtn.value = 'Sign Out';
homeBtn.value = 'Home';
backBtn.value = 'Return to Page';


//toggle visibility

popUpBox.style = 'display: none;';
userName.onclick = function() {
    popUpBox.style = 'display: flex;';
};
backBtn.onclick = function() {
    popUpBox.style = 'display: none;';
};

//button functionality
homeBtn.onclick = function() {
    window.location.href = "/client/studentEvaluation/index.html";
}

signOutBtn.onclick = function() {
    localStorage.removeItem("email");
    window.location.href = "/client/authentication/students/signIn.html";
}