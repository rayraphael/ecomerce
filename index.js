const express = require('express');
const app = express();
const session = require('express-session');
const db = require('./dbConnect/config');
const http = require('http').Server(app);
const port = 4000;
const mustacheExpress = require('mustache-express');
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded());
app.use(express.json());
const bcrypt = require('bcrypt');
// Setup Session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
// Stop page caching
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});
//DB Connection
db.connect((err) => {
    if (err) {
        console.log('DB Error: ' + err);
    }
    console.log('DB connected');
})



// staff section
// signup section
app.post('/', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let userPass = req.body.userPass;
    // let dateCreated = req.body.dateCreated;
    // let dateDelect = req.body.dateDelect;

    let values = { name: name, email: email, userPass: userPass };
    let posted = 'INSERT INTO staff SET?';
    db.query(posted, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.redirect('/');
        res.send('successfull');
    });
});
// login section
app.post('/', (req, res) => {
    let email = req.body.email;
    let userPass = req.body.userPass;
    db.query('SELECT * FROM staff WHERE email = ? AND userPass = ?', [email, userPass], function (err, results) {
        if (results.length > 0) {
            let userRow = JSON.parse(JSON.stringify(results[0]));
            req.session.loggedIn = true;
            req.session.email = userRow.email;
            req.session.userId = userRow.id;
            // console.log(userRow.id);

            res.send('successfull');

        } else {
           res.send(error);
        }
    });
})
// // customers section
// // signup section
app.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let phone = req.body.phone;
    // let dateCreated = req.body.dateCreated;
    // let dateDelect = req.body.dateDelect; 
    let stateId = req.body.stateId;
    let values = { username: username, password: password, phone: phone, stateId: stateId };
    let posted = 'INSERT INTO customers SET?';
    db.query(posted, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.redirect('/');
        res.send('successfull');
    });
});
// // login section
app.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    db.query('SELECT * FROM customers WHERE username = ? AND password = ?', [username, password], function (err, results) {
        if (results.length > 0) {
            let usernameRow = JSON.parse(JSON.stringify(results[0]));
            req.session.loggedIn = true;
            req.session.username = usernameRow.username;
            req.session.userId = usernameRow.id;
            // console.log(usernameRow.id);

            res.send('successfull');

        } else {
            res.send(error);
        }
    });
});



http.listen(port, () => {
    console.log('Running on port: ' + port);
})
