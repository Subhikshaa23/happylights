const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/posts', (req, res) => {
    fs.readFile('posts.json', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/posts', (req, res) => {
    const posts = req.body;
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
