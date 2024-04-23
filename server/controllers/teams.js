const Team = require('../schema/team');
const mongoose = require('mongoose');
const csvtojson = require('csvtojson')


// Create a new team
const createTeam = async (req, res) => { 
  try {
      const { teamName, members } = req.body;

      // Create the team with the teamName and members array
      const team = await Team.create({ teamName, members });

      res.status(201).json({ team });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Create a new team member
// When creating a team member that team member cannot exist in any other teams
const createTeamMember = async (req, res) => {
    try{
      const { teamId } = req.params;
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      const newMember = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        schoolEmail: req.body.schoolEmail,
      };

      team.members.push(newMember);
      await team.save();
      res.status(201).json({ team });

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
 };


 //Display all teams and members to each team
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    console.error('Error getting teams:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
   };


// Display a single team and its members
const getTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(200).json({ team });
  } catch (error) {
    console.error('Error getting team:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
 };


// Display a single team member
const getTeamMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    // Ensure that memberId is a valid ObjectId
    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }
    // Find the member across all teams by memberId
    const member = await Team.findOne({ 'members._id': memberId }, { 'members.$': 1 });
    if (!member) {
      console.error(`Member not found for memberId: ${memberId}`);
      return res.status(404).json({ error: 'Member not found' });
    }
    // Return the individual member details
    const memberDetails = {
      _id: member.members[0]._id.toString(), // Convert ObjectId to string
      firstName: member.members[0].firstName,
      lastName: member.members[0].lastName,
      schoolEmail: member.members[0].schoolEmail,
    };
    res.status(200).json({ memberDetails });
  } catch (error) {
    console.error('Error getting member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};


// Update a team member
const updateTeamMember = async (req, res) => { 
  try {
    const { memberId } = req.params;
    const { firstName } = req.body;
    const { lastName } = req.body
    const { schoolEmail } = req.body; // Extract the memberName from the request body

    // Ensure that memberId is a valid ObjectId
    if (!mongoose.isValidObjectId(memberId)) {
      return res.status(400).json({ error: 'Invalid ObjectId' });
    }

    // Find the team that contains the member by memberId and update the memberName
    // $set operator in MongoDB is used to set or update the value of a field within a document.
    const team = await Team.findOneAndUpdate(
      { 'members._id': memberId },
      { 
        $set: { 
          'members.$.firstName': firstName,
          'members.$.lastName': lastName,
          'members.$.schoolEmail': schoolEmail
        } 
      },
      { new: true }
    );

    if (!team) {
      console.error(`Member not found for memberId: ${memberId}`);
      return res.status(404).json({ error: 'Member not found' });
    }

    // Return the updated individual member details
    const updatedMember = team.members.find(member => member._id.toString() === memberId);
    const memberDetails = {
      _id: updatedMember._id.toString(),
      firstName: updatedMember.firstName,
      lastName: updatedMember.lastName,
      schoolEmail: updatedMember.schoolEmail,
    };

    res.status(200).json({ memberDetails });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};



// Update Team Name
const updateTeamName = async (req, res) => { 
  try {
    const { teamId } = req.params;
    const { teamName } = req.body; // Extract the teamName from the request body

    // Find the team by teamId and update the teamName
    const team = await Team.findByIdAndUpdate(teamId, { teamName }, { new: true });

    if (!team) {
      console.error(`Team not found for teamId: ${teamId}`);
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({ team });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};


// Delete Team
const DeleteTeam = async (req, res) => { 
  try {
    const { teamId } = req.params;
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};


// Delete member from team
const DeleteMember = async (req, res) => { 
  try {
    const { memberId } = req.params;
    //$pull operator is used to remove specific elements from an array field within a document based on a specified condition.
    const team = await Team.findOneAndUpdate({'members._id': memberId}, 
      { $pull: { members: { _id: memberId } } }, { new: true }
      );
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting member:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};


// Uploading teams and members from a CSV file
const csv = async (req, res) => {
  try {
    //Manually
    // const csvData = await csvtojson().fromFile("TeamUpdate.csv");
    
  //Upload
  const csvFile = req.files.csvFile; // Assuming the name of your file input field is "csvFile"
  const csvData = await csvtojson().fromString(csvFile.data.toString('utf8'));
    console.log(csvData);

    const teams = {};

    // Group data by team name
    csvData.forEach(({ teamName, firstName, lastName, schoolEmail }) => {
      if (!teams[teamName]) {
        teams[teamName] = {
          teamName,
          members: []
        };
      }
      teams[teamName].members.push({ firstName, lastName, schoolEmail });
    });

    // Insert data into the database
    await Promise.all(Object.values(teams).map(async (teamData) => {
      const { teamName, members } = teamData;
      const team = new Team({ teamName, members });
      await team.save();
    }));

    console.log("Data inserted");
    res.json({ success: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred" });
  }
};


const removeAllTeams = async (req, res) => {
  try {
    const removeTeams = await Team.deleteMany({})
    res.json({ success: "Removed all Teams and Members" })
  } catch (error) {
    console.error('Error deleting documents:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




module.exports = { 
  createTeam, 
  getTeamMember, 
  getAllTeams, 
  getTeam, 
  updateTeamMember,
  createTeamMember,
  updateTeamName, 
  DeleteTeam,
  DeleteMember,
  csv,
  removeAllTeams,
};