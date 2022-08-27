const express = require('express');
const fs = require('fs');
const path = require('path');
const database = require('./db/db.json');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(database);
});

app.post('/api/notes', (req, res) => {
  let jsonFilePath = path.join(__dirname, '/db/db.json');
  let noteToAdd = req.body;
  
  noteToAdd.id = uuid.v4();
  database.push(noteToAdd);

  fs.writeFile(jsonFilePath, JSON.stringify(database), (err) => {
    if (err) {
      return console.log(err);
    }
  });

  res.json(noteToAdd);
});

app.delete("/api/notes/:id", (req, res) => {
    let jsonFilePath = path.join(__dirname, "/db/db.json");

    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }

    fs.writeFileSync(jsonFilePath, JSON.stringify(database), (err) => {
        if (err) {
            return console.log(err);
        } 
    });
    res.json();
});

app.listen(PORT, function () {
  console.log('App listening on PORT ' + PORT);
});
