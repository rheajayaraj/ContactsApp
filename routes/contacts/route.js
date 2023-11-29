const express = require('express');
const router = express.Router()
const createcontact=require('../../controllers/contacts/createcontactcontroller')
const viewcontacts=require('../../controllers/contacts/viewcontactscontroller')
const viewcontact=require('../../controllers/contacts/viewcontactcontroller')
const updatecontact=require('../../controllers/contacts/updatecontactcontroller')
const deletecontact=require('../../controllers/contacts/deletecontactcontroller')
//Post Method
router.post('/post', createcontact)
//Get all Method
router.get('/getAll', viewcontacts)
//Get by ID Method
router.get('/getOne/:name', viewcontact)
//Update by ID Method
router.patch('/update/:name', updatecontact)
//Delete by ID Method
router.delete('/delete/:name', deletecontact)

module.exports = router;