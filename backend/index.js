const express = require('express');
const cors = require('cors')
const home = require('./routes/home');
const users = require('./routes/users');
const books = require('./routes/books');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

/* `app.use(express.json())` is a middleware that parses incoming requests with JSON payloads. It
allows the server to handle JSON data sent in the request body. */
app.use(express.json());

/* `app.use(cors());` is enabling Cross-Origin Resource Sharing (CORS) for the application. CORS is a
security feature implemented in web browsers that restricts web pages from making requests to a
different domain than the one that served the web page. By enabling CORS, the server allows requests
from other domains to access its resources. This is useful when building web applications that need
to make requests to APIs hosted on different domains. */
app.use(cors());

/* These lines of code are setting up routes for the application using the Express framework. */
app.use('/', home);
app.use('/api/users', users);
app.use('/api/books', books);

const PORT = process.env.PORT;

app.listen(PORT || 8080, () => console.log(`Listening on port ${PORT}...`));