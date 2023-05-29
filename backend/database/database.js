const mysql = require('mysql2');
const dotenv = require('dotenv');
const query = require('./query');

dotenv.config();

/* This code is creating a connection pool to a MySQL database using the `mysql2` library. The pool is
configured with the host, port, user, password, and database information from environment variables
using the `dotenv` library. The `.promise()` method is called on the pool to enable the use of
async/await syntax when executing queries. */
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// Use only for table Creation.
const createUsersTable = async () => {
    return await pool.query(query.CREATE_USERS_TABLE);
}

// Use only for table Creation.
const createBooksTable = async () => {
    return await pool.query(query.CREATE_BOOKS_TABLE);
}

// Use only for table Creation.
const createCategoriesTable = async () => {
    return await pool.query(query.CREATE_CATEGORIES_TABLE);
}

// Use only for table Creation.
const createUserBooksTable = async () => {
    return await pool.query(query.CREATE_USERBOOKS_TABLE);
}

const createUser = async (userId, email, password) => {
    const [result] = await pool.query(
        query.REGISTER_USER,
        [userId, email, password]
    );
    return result;
}

const authenticateUser = async (email, password) => {
    const [result] = await pool.query(
        query.AUTHENTICATE_USER,
        [email, password]
    );
    return result;
}

const getExistenceOfUserByEmail = async (email) => {
    const [result] = await pool.query(
        query.USER_EXISTENCE_CHECK_BY_EMAIL,
        [email]
    );
    return result;
}

const getExistenceOfUserByUserId = async (userId) => {
    const [result] = await pool.query(
        query.USER_EXISTENCE_CHECK_BY_USER_ID,
        [userId]
    );
    return result;
}

const getCategoryId = async (categoryName) => {
    const [result] = await pool.query(
        query.GET_CATEGORY_ID,
        [categoryName]
    );
    return result;
};

const createBook = async (bookId, title, author, categoryId, description, coverPhoto) => {
    const [result] = await pool.query(
        query.CREATE_BOOK,
        [bookId, title, author, categoryId, description, coverPhoto]
    );
    return result;
}

const createUserBooks = async (rowId, userId, bookId) => {
    const [result] = await pool.query(
        query.LINK_USERS_BOOK,
        [rowId, userId, bookId]
    );
    return result;
}

const getDashboardInfo = async () => {
    const [result] = await pool.query(query.DASHBOARD_INFO);
    return result;
}

const getAllBooks = async () => {
    const [result] = await pool.query(query.GET_ALL_BOOKS);
    return result;
}

const unlinkUsersBook = async (userId, bookId) => {
    const [result] = await pool.query(
        query.UNLINK_USERS_BOOK, 
        [userId, bookId]
    );
    return result;
}

const deleteBook = async (bookId) => {
    const [result] = await pool.query(
        query.DELETE_BOOK, 
        [bookId]
    );
    return result;
}

const addCategory = async (categoryId, categoryName) => {
    const [result] = await pool.query(
        query.ADD_CATEGORY,
        [categoryId, categoryName]
    );
    return result;
}

const getCategory = async () => {
    const [result] = await pool.query(query.GET_CATEGORY);
    return result;
}

const getUsersBooks = async (userId) => {
    const [result] = await pool.query(
        query.GET_USERS_BOOKS,
        [userId]
    );
    return result;
}

/* This code is exporting an object with various functions as properties. These functions are used to
interact with a MySQL database, such as creating tables, inserting data, and querying data. By
exporting these functions, they can be used in other parts of the codebase to interact with the
database. */
module.exports = {
    createUsersTable: createUsersTable,
    createBooksTable: createBooksTable,
    createCategoriesTable: createCategoriesTable,
    createUserBooksTable: createUserBooksTable,
    createUser: createUser,
    authenticateUser: authenticateUser,
    getExistenceOfUserByEmail: getExistenceOfUserByEmail,
    getExistenceOfUserByUserId: getExistenceOfUserByUserId,
    getCategoryId: getCategoryId,
    createBook: createBook,
    createUserBooks: createUserBooks,
    getDashboardInfo: getDashboardInfo,
    getAllBooks: getAllBooks,
    unlinkUsersBook: unlinkUsersBook,
    deleteBook: deleteBook,
    addCategory: addCategory,
    getCategory: getCategory,
    getUsersBooks: getUsersBooks
}