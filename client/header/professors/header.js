const topHead = document.getElementsByTagName('header')[0];

/* Create the top bar */

// Create the yellow headbar
const headDiv = topHead.appendChild(document.createElement("div"));
headDiv.id = 'headbar';

// Create logo
const atcLogo = headDiv.appendChild(document.createElement('img'));
atcLogo.id = 'ATClogo';
atcLogo.src = '../images/anokalogo1.png';

// Create navigation links container
const navLinksContainer = headDiv.appendChild(document.createElement("nav"));
navLinksContainer.id = 'navLinksContainer';

// Create navigation links
const link1 = navLinksContainer.appendChild(document.createElement('a'));
link1.href = "/client/formEdit/formEdit.html";
link1.textContent = "Form Edit";
link1.className = "link";

const link2 = navLinksContainer.appendChild(document.createElement('a'));
link2.href = "/client/studentUpdate/stuUpdate.html";
link2.textContent = "Students";
link2.className = "link";

// Create username and profile pic
const userBox = headDiv.appendChild(document.createElement('div'));
userBox.id = 'userbox';
const userImage = userBox.appendChild(document.createElement('img'));
userImage.id = 'userimage';
userImage.src = '../images/unknownuser.png';
const userName = userBox.appendChild(document.createElement('button'));
userName.id = 'username';

/* Get username and set it */
const setName = async () => {
    try {
        userName.textContent = localStorage.email;
    } catch (e) {
        userName.textContent = 'Username';
    }
}
setName();

userName.type = 'button';

// Create the popup box
const popUpBox = topHead.appendChild(document.createElement('div'));
popUpBox.id = 'popupFloat';

const popUser = popUpBox.appendChild(document.createElement('img'));
popUser.id = 'popUser';
popUser.src = '../images/unknownuser.png';

// Buttons
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

// Toggle visibility
popUpBox.style = 'display: none;';
userName.onclick = function() {
    popUpBox.style = 'display: flex;';
};
backBtn.onclick = function() {
    popUpBox.style = 'display: none;';
};

// Button functionality
homeBtn.onclick = function() {
    window.location.href = "/client/createTeams/createTeam.html";
}

signOutBtn.onclick = function() {
    localStorage.removeItem("email");
    window.location.href = "/client/authentication/professors/signIn.html";
}