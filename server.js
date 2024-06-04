const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the default homepage '/'
app.get('/', (req, res) => {
    var pathToSite = path.join(__dirname, 'public', 'happylights.html');
    // console.log(`${pathToSite}`);
    res.sendFile(pathToSite);
});

// Route for the '/admin' page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
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
