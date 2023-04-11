const userModel = require('../models/User')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config').JWT


// User signup route
/**
 * @swagger
 * /api/signup:
 *  post:
 *      summary: Create a new user account.
 *      produces:
 *          - application/json
 *      parameters:
 *          - name: name
 *            description: User name
 *            in: body
 *            required: true
 *            type: string
 *          - name: email
 *            description: User email.
 *            in: body
 *            required: true
 *            type: string
 *          - name: password
 *            description: User password.
 *            in: body
 *            required: true
 *            type: string
 *      responses:
 *       201:
 *         description: Signup successful.
 *       400:
 *         description: Invalid input.
 *       409:
 *         description: Email already exists
 */
const signup = async (req, res, next) => {
    const {name, email, password} = req.body
    try {
        // checking user input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Invalid input'
            })
        }
        // check if email already exists
        const userExists = await userModel.findOne({email})
        if (userExists) {
            return res.status(409).json({
                message: 'Email already exist'
            })
        }

        // create new user
        const user = await userModel.create({name, email, password})
        res.status(201).json({
            message: 'Signup successful'
        })
    } catch (error) {
        next(error)
    }
}

// Login route
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login to the system.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: User email.
 *         in: body
 *         required: true
 *         type: string
 *       - name: password
 *         description: User password.
 *         in: body
 *         required: true
 *         type: string
 *       - name: authScheme
 *         description: Authentication scheme to use (e.g. Basic, OAuth, Bearer).
 *         in: header
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Invalid email or password.
 */
const login = async (req, res, next) => {
    const { email, password } = req.body
    const authScheme = req.get('Authorization')

    try {
        // Checking the user input 
        if (!email || !password) {
            return res.status(400).json({
                message: 'Bad request'
            })
        }
        // Find user by email
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        // checking if password is correct
        const match = await user.isValidPassword(password)
        if (!match) {
            return res.status(401).json({
                message: 'Invalid email or password.'
            })
        }

        // Generate Jwt
        const token = jwt.sign({id: user._id}, JWT_SECRET)

        // Set token in header
        res.setHeader('Authorization', `${authScheme} ${token}`)
        
        res.status(200).json({
            message: 'Login successful',
            token
        })
    } catch (error) {
        next(error)
    }
}

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Log out a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
const logout = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.revokeToken(req.token);
        await user.save()
        res.setHeader('Authorization', '');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
       next(error) 
    }
}

module.exports = {
    signup,
    login,
    logout
}