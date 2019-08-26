const express = require('express');
const bodyParser= require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
var db;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/examen', (err, client) => {
    if (err) return console.log(err);
    db = client.db('examen');
    app.listen(3000, () => {
        console.log('listening on 3000')
    })
});


app.get('/', (req, res) => {
    res.redirect('/list')
});

app.get('/list', (req, res) => {
    db.collection('overtredingen').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('list.ejs', { overtredingen: result })
    })
});


app.get('/search', (req, res) => {
    res.render('search.ejs', { product: '' })
});

app.post('/search', (req, res) => {
    var query = { opnameplaats_straat: req.body.opnameplaats_straat };
    var query2 = { aantal_overtredingen_snelheid: req.body.aantal_overtredingen_snelheid };
    db.collection('overtredingen').find(query).toArray(function(err, result) {
        if (err) return console.log(err);
        if (result == '')
            res.render('search_not_found.ejs', {});
        else
            res.render('search_result.ejs', { examen: result[0] })
    });
    db.collection('overtredingen').find(query2).toArray(function(err, result) {
        if (err) return console.log(err);
        if (result == '')
            res.render('search_not_found.ejs', {});
        else
            res.render('search_result.ejs', { examen: result[0] })
});