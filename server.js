var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var password = require('./secrets.json').password;
var connection = mysql.createConnection({
    host: '35.202.35.215',
    user: 'root',
    password: password,
    database: 'data'
});

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/pet/:petId', function (request, response) {
    connection.query('SELECT * FROM pets where id = ?;', [request.params.petId], function (error, results) {
        if (error) {
            console.log('Error:', error);

            return response.status(500).send('Internal server error');
        }

        var petWithGivenPetId = results[0];
        if (petWithGivenPetId) {
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify(petWithGivenPetId));
        }
        else {
            response.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }

    });
});


app.post('/pet', function(request, response) {
    connection.query('INSERT INTO pets (name, type) VALUES (?,?);', [request.body.name, request.body.type], function (error, results) {
        if (error) {
            console.log('Error:', error);

            return response.status(500).send('Internal server error');
        }

        response.status(201).send('resource created');
    });
});

app.listen(8080);
