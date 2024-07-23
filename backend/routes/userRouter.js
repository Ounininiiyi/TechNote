const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usersController')
const verifyJWT = require('../middlewares/verifyJWT')

// router.use(verifyJWT)

router.route('/')
	// GET
	.get(usersController.getAllUsers)
	// POST
	.post(usersController.createNewUser)
	// PATCH
	.patch(usersController.updateUser)
	// DELETE
	.delete(usersController.deleteUser)



module.exports = router