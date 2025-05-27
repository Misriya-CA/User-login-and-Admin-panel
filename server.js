const express = require('express');
const app = express();
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const path = require('path');
const connectDB = require('./db/connectDB');
const nocache = require('nocache');
app.use(nocache());



// session middleware

app.use(session({
    secret: 'your-secret-key',
    resave: false, 
    saveUninitialized: true, 
     cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
    }
    
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});


// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json())



// view engine setup
app.set("views",path.join(__dirname, 'views'));
app.set('view engine','hbs');


//static 
app.use(express.static('public'));


app.use('/user',userRoutes);
app.use('/admin',adminRoutes);




connectDB();
app.listen(7001,()=>{
    console.log("server is running");
})



