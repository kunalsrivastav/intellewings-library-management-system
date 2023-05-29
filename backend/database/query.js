/* This code exports an object with various SQL queries as properties. These queries can be used to
interact with a database in a Node.js application. The queries include creating tables, registering
and authenticating users, retrieving and deleting books, and more. */
module.exports = {
    CREATE_USERS_TABLE: `
        CREATE TABLE users (
            user_id CHAR(36) PRIMARY KEY,
            email VARCHAR(255),
            password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `,
    CREATE_BOOKS_TABLE: `
        CREATE TABLE books (
            book_id CHAR(36) PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            author VARCHAR(100) NOT NULL,
            category_id CHAR(36),
            description TEXT,
            cover_image VARCHAR(255),
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        );
    `,
    CREATE_CATEGORIES_TABLE: `
        CREATE TABLE categories (
            category_id CHAR(36) PRIMARY KEY,
            category_name VARCHAR(50) NOT NULL
        );
    `,
    CREATE_USERBOOKS_TABLE: `
        CREATE TABLE user_books (
            user_book_id CHAR(36) PRIMARY KEY,
            user_id CHAR(36),
            book_id CHAR(36),
            upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id),
            FOREIGN KEY (book_id) REFERENCES books(book_id)
        );
    `,
    REGISTER_USER: `INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)`,
    AUTHENTICATE_USER: `SELECT * FROM users WHERE email = ? AND BINARY password = ?`,
    USER_EXISTENCE_CHECK_BY_EMAIL:  `SELECT * FROM users WHERE email = ?`,
    USER_EXISTENCE_CHECK_BY_USER_ID:  `SELECT * FROM users WHERE user_id = ?`,
    GET_CATEGORY_ID: `SELECT * FROM categories WHERE category_name like ?`,
    CREATE_BOOK: `INSERT INTO books (book_id, title, author, category_id, description, cover_image) VALUES (?, ?, ?, ?, ?, ?)`,
    LINK_USERS_BOOK: `INSERT INTO user_books (user_book_id, user_id, book_id) VALUES (?, ?, ?)`,
    DASHBOARD_INFO: `
        SELECT C.category_id, C.category_name, B.title
        FROM categories C
        LEFT JOIN books B ON B.category_id = C.category_id;
    `,
    GET_ALL_BOOKS: `
        SELECT U.email as added_by, B.book_id, B.title, B.author, B.description, B.cover_image, C.category_name
        FROM books B
        INNER JOIN categories C ON B.category_id = C.category_id
        LEFT JOIN user_books UB ON UB.book_id = B.book_id
        LEFT JOIN users U ON UB.user_id = U.user_id;
    `,
    UNLINK_USERS_BOOK: `DELETE FROM user_books WHERE binary user_id = ? and binary book_id = ?`,
    DELETE_BOOK: `DELETE FROM books WHERE binary book_id = ?`,
    ADD_BOOKS_CATEGORIES: `
        INSERT INTO categories (category_id, category_name)
        VALUES
            ('ed1d837b-4ed5-48cd-9d10-b37e9b8ac103', 'Fiction'),
            ('689410f4-3dd8-4657-8da8-e0e3de1f891a', 'Non-Fiction'),
            ('4f66fd4a-59db-4223-985e-7660f5778128', 'Biography'),
            ('54a6c4a9-ad59-414c-aae3-92d835c161cb', 'Autobiography'),
            ('5febf80e-5eb5-489c-84ab-63e08476ae69', 'Self-Help'),
            ('b245650f-5978-4ef5-b137-5fc71d0ff17e', 'History'),
            ('723d049d-db33-40fd-adca-9339a596ca49', 'Science'),
            ('5ec26201-ffb0-4474-b6d1-99f41d65fdbe', 'Art and Photography'),
            ('884aa246-145e-4f36-b0f6-e6a23143d913', 'Children''s Books'),
            ('2dfe4a38-0bc9-4905-b992-36b05a54c9d0', 'Poetry'),
            ('df0b4935-b159-455b-8b06-1aeac319d047', 'Mystery'),
            ('4172105e-bf81-4508-abde-25500f68c108', 'Romance'),
            ('6559316a-c354-4a99-abe9-e11605b04dbf', 'Science Fiction'),
            ('f0f1513a-1c36-48a6-aea7-4ffbf12ce553', 'Fantasy'),
            ('a5865cc1-c7d7-43e1-891b-a0e0e5ee4aa7', 'Thriller'),
            ('3d821e65-7e7c-46f2-8fa0-45a7c8c2064b', 'Horror'),
            ('21454e76-6fb9-4557-992a-100a465d7a90', 'Historical Fiction'),
            ('c5d0c165-d069-4c65-9975-09b7771214fa', 'Business'),
            ('5fd1dd9b-fbb8-42a3-8dc8-c89917d5e9bb', 'Travel'),
            ('469cf0ec-e880-4b8f-bb8e-44192ab0a7dd', 'Cookbooks'),
            ('4935ece7-109b-4020-9609-356e5fbf28dd', 'Others');
    `,
    ADD_CATEGORY: `INSERT INTO categories (category_id, category_name) VALUES (?, ?)`,
    GET_CATEGORY: `SELECT * FROM categories`,
    GET_USERS_BOOKS: `
        SELECT B.book_id, B.title, B.author, B.description, B.cover_image, C.category_name 
        FROM books B
        INNER JOIN categories C ON B.category_id = C.category_id
        INNER JOIN user_books UB on UB.book_id = B.book_id
        WHERE UB.user_id = ?;
    `,
}