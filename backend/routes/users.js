const express = require('express');
const { getExistenceOfUserByEmail, createUser, authenticateUser } = require('../database/database');
const { validateUserData } = require('../middleware/validation');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const TOKEN_EXPIRE_DURATION = process.env.TOKEN_EXPIRE_DURATION;

/* This code is defining a route for the `/signup` endpoint using the `express.Router()` method. When a
`POST` request is made to this endpoint, the code first extracts the `email` and `password` from the
request body. It then validates the user data using the `validateUserData()` function from the
`../middleware/validation` module. If the user data is valid, the code checks if the user already
exists in the database using the `getExistenceOfUserByEmail()` function from the
`../database/database` module. If the user already exists, the code sends a `403 Forbidden` response
with an error message. If the user does not exist, the code generates a unique user ID using the
`crypto.randomUUID()` method and creates a new user in the database using the `createUser()`
function from the `../database/database` module. */
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const isValidUserData = validateUserData(email, password);
    if (isValidUserData) {
        const existingUserCheck = await getExistenceOfUserByEmail(email);
        if (existingUserCheck?.length) {
            res.status(403).send({ error: 'Email is Already registered, please Login using your created Password.' });
        } else {
            const generatedUserId = crypto.randomUUID();
            const result = await createUser(generatedUserId, email, password);
            jwt.sign({ user_id: generatedUserId, email: email }, JWT_PRIVATE_KEY, { expiresIn: TOKEN_EXPIRE_DURATION }, (error, token) => {
                if (!error) {
                    res.status(201).send({ 
                        message: 'Account Created',
                        token: token,
                        email: email,
                        user_id: generatedUserId
                    });
                } else {
                    res.status(500).send({ error: 'Something went wrong! please try again later.' })
                }
            });
        }
    } else {
        res.status(400).send({ error: 'Either email or password is Invalid.' });
    }
});


/* This code is defining a route for the `/login` endpoint using the `express.Router()` method. When a
`POST` request is made to this endpoint, the code first extracts the `email` and `password` from the
request body. It then validates the user data using the `validateUserData()` function from the
`../middleware/validation` module. If the user data is valid, the code checks if the user exists in
the database using the `getExistenceOfUserByEmail()` function from the `../database/database`
module. If the user exists, the code authenticates the user using the `authenticateUser()` function
from the `../database/database` module. If the authentication is successful, the code generates a
JSON Web Token (JWT) for the user using the `jwt.sign()` method from the `jsonwebtoken` library. The
JWT contains the user ID and email, which are passed as an object with the properties `user_id` and
`email`. The `JWT_PRIVATE_KEY` is used to sign the JWT, and the `TOKEN_EXPIRE_DURATION` specifies
the expiration time for the token. If the JWT is successfully generated, the code sends a 200 OK
response with a */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const isValidUserData = validateUserData(email, password);
    if (isValidUserData) {
        const existingUserCheck = await getExistenceOfUserByEmail(email);
        if (existingUserCheck?.length) {
            const result = await authenticateUser(email, password);
            if (result?.length) {
                const userDetails = { ...result[0] };
                jwt.sign({ user_id: userDetails?.user_id, email: userDetails?.email }, JWT_PRIVATE_KEY, { expiresIn: TOKEN_EXPIRE_DURATION }, (error, token) => {
                    if (!error) {
                        res.status(200).send({ 
                            message: 'Login Successful!!',
                            token: token,
                            email: userDetails?.email,
                            user_id: userDetails?.user_id
                        });
                    } else {
                        res.status(500).send({ error: 'Something went wrong! please try again later.' })
                    }
                });
            } else {
                res.status(403).send({ error: 'Incorrect Password.' });
            }
        } else {
            res.status(403).send({ error: 'Invalid Email.' });
        }
    } else {
        res.status(400).send({ error: 'Either email or password is Invalid.' });
    }
});

module.exports = router;