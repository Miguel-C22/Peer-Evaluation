// Function to add a new attribute/question field
function addAttribute() {
    const attributesContainer = document.getElementById('attributesContainer');
    const newAttributeWrapper = document.createElement('div'); // Wrapper for input and delete button
    const newAttributeInput = document.createElement('textarea'); // Use textarea for editing
    newAttributeInput.placeholder = 'Enter attribute';
    const deleteButton = document.createElement('button'); // Delete button
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', () => {
        newAttributeWrapper.remove(); // Remove the entire wrapper when delete button is clicked
    });

    newAttributeWrapper.appendChild(newAttributeInput);
    newAttributeWrapper.appendChild(deleteButton);
    attributesContainer.appendChild(newAttributeWrapper);
}

// Function to add a new grade/scoring option field
function addGrade() {
    const gradesContainer = document.getElementById('gradesContainer');
    const newGradeWrapper = document.createElement('div'); // Wrapper for inputs and delete button

    const performanceLevelInput = document.createElement('input');
    performanceLevelInput.type = 'text';
    performanceLevelInput.placeholder = 'Enter performance level';

    const gradeInput = document.createElement('input');
    gradeInput.type = 'number';
    gradeInput.placeholder = 'Enter Grade';

    const deleteButton = document.createElement('button'); // Delete button
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', () => {
        newGradeWrapper.remove(); // Remove the entire wrapper when delete button is clicked
    });

    newGradeWrapper.appendChild(performanceLevelInput);
    newGradeWrapper.appendChild(gradeInput);
    newGradeWrapper.appendChild(deleteButton);
    gradesContainer.appendChild(newGradeWrapper);
}

// Function to fetch current form data from the server
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

// Call fetchFormData when the page loads
window.addEventListener('DOMContentLoaded', fetchFormData);

// Function to display form data in an editable format
function displayFormData(formData) {
    const attributesContainer = document.getElementById('attributesContainer');
    const gradesContainer = document.getElementById('gradesContainer');

    // Clear previous data
    attributesContainer.innerHTML = '';
    gradesContainer.innerHTML = '';

    // Display attributes/questions
    formData.attributes.forEach((attribute, index) => {
        const questionInput = document.createElement('div');
        const questionTextArea = document.createElement('textarea');
        questionTextArea.value = attribute.question;
        questionTextArea.addEventListener('input', () => {
            formData.attributes[index].question = questionTextArea.value;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => {
            formData.attributes.splice(index, 1);
            displayFormData(formData); // Refresh display after removal
        });

        questionInput.appendChild(questionTextArea);
        questionInput.appendChild(deleteButton);
        attributesContainer.appendChild(questionInput);
    });

    // Display grades/scoring options
    formData.grades.forEach((grade, index) => {
        const gradeDiv = document.createElement('div');

        const performanceLevelInput = document.createElement('input');
        performanceLevelInput.type = 'text';
        performanceLevelInput.value = grade.performanceLevel;
        performanceLevelInput.addEventListener('input', () => {
            formData.grades[index].performanceLevel = performanceLevelInput.value;
        });
        gradeDiv.appendChild(performanceLevelInput);

        const gradeInput = document.createElement('input');
        gradeInput.type = 'number';
        gradeInput.value = grade.grade;
        gradeInput.addEventListener('input', () => {
            formData.grades[index].grade = parseInt(gradeInput.value);
        });
        gradeDiv.appendChild(gradeInput);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => {
            formData.grades.splice(index, 1);
            displayFormData(formData); // Refresh display after removal
        });
        gradeDiv.appendChild(deleteButton);

        gradesContainer.appendChild(gradeDiv);
    });
}

async function editForm() {
    const form = document.getElementById('evaluationForm');

    // Retrieve questions
    const questions = [];
    const questionInputs = document.querySelectorAll('#attributesContainer textarea');
    questionInputs.forEach(input => {
        questions.push({ question: input.value.trim() });
    });

    // Retrieve grades
    const grades = [];
    const gradeWrappers = document.querySelectorAll('#gradesContainer > div');
    gradeWrappers.forEach(wrapper => {
        const performanceLevelInput = wrapper.querySelector('input[type="text"]');
        const gradeInput = wrapper.querySelector('input[type="number"]');
        if (performanceLevelInput && gradeInput) {
            const performanceLevelValue = performanceLevelInput.value.trim();
            const gradeValue = parseInt(gradeInput.value.trim());
            grades.push({ performanceLevel: performanceLevelValue, grade: gradeValue });
        }
    });

    try {
        const response = await fetch('http://localhost:3005/api/v1/evalFormEdit/editForm', {
            method: 'PATCH',
            body: JSON.stringify({
                attributes: questions,
                grades: grades
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Form updated successfully');
            // Optionally, redirect or show a success message
        } else {
            console.error('Error updating form:', response.statusText);
            // Optionally, display an error message to the user
        }
    } catch (error) {
        console.error('Error updating form:', error.message);
        // Optionally, display an error message to the user
    }
}
