const express = require('express');
const checkToken = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const { getExistenceOfUserByUserId, getCategoryId, createBook, createUserBooks, getDashboardInfo, 
        getAllBooks, unlinkUsersBook, deleteBook, addCategory, getCategory, getUsersBooks } = require('../database/database');
const crypto = require('crypto');
const { validateBookData } = require('../middleware/validation');
const bucket = require('../middleware/firebase');

dotenv.config();
const router = express.Router();
router.use(checkToken);

const upload = multer();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

/* This code defines a GET endpoint at the path '/all' that requires an authorization token to access.
It verifies the token using JWT and checks if the user exists in the database. If the user exists,
it retrieves all books from the database using the 'getAllBooks' function and sends the result as a
response with a status code of 200. If the user does not exist, it sends an error response with a
status code of 401. */
router.get('/all', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const allBooksResult = await getAllBooks();
                res.status(200).send(allBooksResult);
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

/* This code defines a GET endpoint at the path '/dashboard' that requires an authorization token to
access. It verifies the token using JWT and checks if the user exists in the database. If the user
exists, it retrieves the dashboard information from the database using the 'getDashboardInfo'
function and sends the result as a response with a status code of 200. If the user does not exist,
it sends an error response with a status code of 401. */
router.get('/dashboard', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const dashboardResult = await getDashboardInfo();
                const result = {};
                dashboardResult?.map((item) => {
                    if (result?.hasOwnProperty(item?.category_id)) {
                        let tempCategory = result?.[item?.category_id];
                        if (item?.title) {
                            tempCategory['total'] = tempCategory['total'] + 1;
                            tempCategory['books'].push(item?.title);
                        }
                        result[item?.category_id] = tempCategory;
                    } else {
                        let tempCategory = {};
                        tempCategory['categoryId'] = item?.category_id;
                        tempCategory['total'] = item?.title ? 1 : 0;
                        tempCategory['categoryName'] = item?.category_name;
                        tempCategory['books'] = item?.title ? [item?.title] : [];
                        result[item?.category_id] = tempCategory;
                    }
                })
                res.status(200).send(result);
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

/* The above code is a route handler function for creating a new book. It first verifies the JWT token
provided in the request header, then checks the validity of the user associated with the token. If
the user is valid, it generates a unique book ID using the crypto module, uploads the book file to a
Google Cloud Storage bucket, and creates a new book record in the database with the book details and
the download URL. It also creates a new record in the user_books table to associate the book with
the user who created it. Finally, it sends a response with a success message or an error message */
router.post('/create', upload.any(), async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const bookId = crypto.randomUUID();
                const file = req.files[0];
                const fileName = bookId;
                let downloadUrl;
                if (file) {
                    const fileUpload = bucket.file(fileName);
                    const stream = fileUpload.createWriteStream({
                        metadata: {
                        contentType: file.mimetype,
                        },
                    });
                    stream.on('error', (error) => {
                        console.error(error);
                    });
                    downloadUrl = `https://storage.googleapis.com/${bucket.name}/${bookId}`;
                    stream.on('finish', () => {
                        // File upload is complete
                        downloadUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
                    });
                    stream.end(file.buffer);
                }
                
                const title = req.body?.title;
                const author = req.body?.author;
                const description = req.body?.description;
                const category = req.body?.category;

                // console.log(title, author, description, category, downloadUrl);
                const isValidRequest = validateBookData(title, author, description, category);
                if (isValidRequest) {
                    const categoryResult = await getCategoryId(category);
                    const categoryId = categoryResult[0]?.category_id;
                    const createBookResult = await createBook(bookId, title, author, categoryId, description, downloadUrl);
                    const userBooksId = crypto.randomUUID();
                    const userBooksResult = await createUserBooks(userBooksId, user_id, bookId);
                    res.status(201).send({ message: 'Book Added!' });
                } else {
                    res.status(400).send({ error: "Missing parameters." });
                }
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

/* This code defines a DELETE endpoint at the path '/delete' that requires an authorization token to
access. It verifies the token using JWT and checks if the user exists in the database. If the user
exists, it retrieves the book_id from the request body and uses it to unlink the book from the
user's list of books using the 'unlinkUsersBook' function and delete the book from the database
using the 'deleteBook' function. It sends a success message as a response with a status code of 200.
If the user does not exist, it sends an error response with a status code of 401. */
router.delete('/delete', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const { book_id } = req.body;
                const unlinkResult = await unlinkUsersBook(user_id, book_id);
                const deleteBookResult = await deleteBook(book_id);
                res.status(200).send({ message: "Book successfully Deleted!" });
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

router.post('/add-category', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const { category } = req.body;
                if (category?.length) {
                    const categoryId = crypto.randomUUID();
                    const addCategoryResult = await addCategory(categoryId, category);
                    res.status(201).send({ message: "Category Created!" });
                } else {
                    res.status(400).send({ error: "Category not found!" });
                }
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

router.get('/categories', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const result = await getCategory();
                res.status(200).send(result);
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

router.get('/mybooks', async (req, res) => {
    const token = req.token;
    jwt.verify(token, JWT_PRIVATE_KEY, async (error, authData) => {
        if (error) {
            res.status(403).send({ error: "Invalid token or token seems expired!, Login again to create new token." });
        } else {
            const { user_id, email } = authData;
            const checkUserValidity = await getExistenceOfUserByUserId(user_id);
            if (checkUserValidity?.length) {
                const myBooksResult = await getUsersBooks(user_id);
                res.status(200).send(myBooksResult);
            } else {
                res.status(401).send({ error: "Invalid User!" });
            }
        }
    });
});

module.exports = router;