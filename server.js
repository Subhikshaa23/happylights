const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const app = express();


dotenv.config();
const port = process.env.PORT;
const adminPassword = process.env.ADMIN_PASSWORD;

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check password for '/admin' route
const checkAdminPassword = (req, res, next) => {
    const { password } = req.body;

    if (password === adminPassword) {
        next(); 
    } else {
        res.redirect('/admin?auth=failed');
    }
};

// Route for the '/admin' page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST route to handle login form submission
app.post('/admin', checkAdminPassword, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Route for the default homepage '/'
app.get('/', (req, res) => {
    // console.log("Request received for /");
    res.sendFile(path.join(__dirname, 'public', 'happylights.html'));
});

// Endpoint to get posts
app.get('/posts', (req, res) => {
    fs.readFile(path.join(__dirname, 'posts.json'), 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// Endpoint to save posts
app.post('/posts', (req, res) => {
    const posts = req.body;
    fs.writeFile(path.join(__dirname, 'posts.json'), JSON.stringify(posts, null, 2), 'utf8', (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
