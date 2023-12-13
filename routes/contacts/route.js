const express = require('express');
const router = express.Router();
const createcontact = require('../../controllers/contacts/createcontactcontroller');
const viewcontacts = require('../../controllers/contacts/viewcontactscontroller');
const viewcontact = require('../../controllers/contacts/viewcontactcontroller');
const updatecontact = require('../../controllers/contacts/updatecontactcontroller');
const deletecontact = require('../../controllers/contacts/deletecontactcontroller');
const viewtag = require('../../controllers/contacts/viewtagscontroller');

router.post('/create', createcontact);
router.get('/viewAll', viewcontacts);
router.get('/view/:contact', viewcontact);
router.post('/update/:contact', updatecontact);
router.delete('/delete/:id', deletecontact);
router.get('/tag', viewtag);

module.exports = router;
