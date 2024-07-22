const express = require('express')
const router = express.Router()

const notesController = require('../controllers/notesController')
const verifyJWT = require('../middlewares/verifyJWT')

router.use(verifyJWT)

router.route('/')
	// GET
	.get(notesController.getAllNotes)
	// POST
	.post(notesController.createNewNote)
	// PATCH
	.patch(notesController.updateNote)
	// DELETE
	.delete(notesController.deleteNote)



module.exports = router