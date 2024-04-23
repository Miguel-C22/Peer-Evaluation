const express = require('express')
const router = express.Router()

const {
    createTeam, 
    getTeamMember, 
    getAllTeams, 
    getTeam, 
    updateTeamMember, 
    createTeamMember,
    updateTeamName,
    DeleteTeam,
    DeleteMember,
    removeAllTeams,
    csv
} = require('../controllers/teams')

router.route('/createTeams').post(createTeam)
router.route('/teamMembers/:memberId').get(getTeamMember);
router.route('/getAllTeams').get(getAllTeams);
router.route('/getTeam/:teamId').get(getTeam);
router.route('/updateTeamMember/:memberId').patch(updateTeamMember);
router.route('/createTeamMember/:teamId').post(createTeamMember);
router.route('/updateTeamName/:teamId').patch(updateTeamName);
router.route('/deleteTeam/:teamId').delete(DeleteTeam);
router.route('/deleteMember/:memberId').delete(DeleteMember);
router.route('/createTeamsCSV').post(csv)
router.route('/removeAllTeams').delete(removeAllTeams)


module.exports = router
