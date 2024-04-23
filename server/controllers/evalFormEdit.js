const EvalForm = require('../schema/evalFormEdit');

const createForm = async (req, res) => {
    const {attributes , grades} = req.body
try{
    const saveForm = await EvalForm.create({ attributes, grades})
    res.status(201).json({ saveForm });
}
 catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
    
}

const editForm = async (req, res) => {
    const { attributes, grades } = req.body;

    try {
        // Assuming you have a way to identify the existing form, for example, by its ID
        const existingForm = await EvalForm.findOne(); // Assuming there's only one form for editing

        if (!existingForm) {
            return res.status(404).json({ error: 'Form not found' });
        }

        // Update attributes of the existing form
        existingForm.attributes = attributes;

        // Update grades of the existing form
        existingForm.grades = grades;

        // Save the updated form
        const updatedForm = await existingForm.save();

        res.status(200).json({ updatedForm });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getFormData = async (req, res) => {
    try {
        // Retrieve the form data from the database
        const formData = await EvalForm.findOne();
        
        if (!formData) {
            // If no form data is found, send an appropriate response
            return res.status(404).json({ error: 'Form data not found' });
        }

        // Send the form data in the response
        res.status(200).json(formData);
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createForm,
    editForm,
    getFormData,
}