const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide member firstName'],
    },
    lastName: {
        type: String,
        required: [true, 'Please provide member lastName'],
    },
    schoolEmail: {
        type: String,
        required: [true, 'Please provide school email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
          unique: true, 
    }
});

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: [true, 'Please provide team name'],
    },
    members: [MemberSchema], // Use the MemberSchema for the members array
});

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;

