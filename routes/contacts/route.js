const express = require('express');
const router = express.Router()
const createcontact=require('../../controllers/contacts/createcontactcontroller')
const viewcontacts=require('../../controllers/contacts/viewcontactscontroller')
const viewcontact=require('../../controllers/contacts/viewcontactcontroller')
const updatecontact=require('../../controllers/contacts/updatecontactcontroller')
const deletecontact=require('../../controllers/contacts/deletecontactcontroller')
//Post Method
router.post('/create', createcontact)
//Get all Method
router.get('/viewAll', viewcontacts)
//Get by ID Method
router.get('/view/:contact', viewcontact)
//Update by ID Method
router.patch('/update/:contact', updatecontact)
//Delete by ID Method
router.delete('/delete', deletecontact)

module.exports = router;