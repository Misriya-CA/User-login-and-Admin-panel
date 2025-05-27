const express = require('express');
const router = express.Router();
const Usermodel = require('../model/usermodel');
const userAuth = require('../middleware/userAuth');
const bcrypt = require('bcrypt');


router.get('/login',userAuth.isLogin,(req,res)=>{
    res.render('user/login', { error: null })
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await Usermodel.findOne({ username });

        if (!user) {
            return res.render('user/login', { error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('user/login', { error: 'Invalid username or password.' });
        }

        req.session.user = user;
        res.redirect('/user/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error. Please try again later.');
    }
});



// User Signup - GET
router.get('/signup',userAuth.isLogin, (req, res) => {
    res.render('user/signup', { error: null });
});



// User Signup - POST
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Usermodel.findOne({ username });

        if (existingUser) {
            return res.render('user/signup', { error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Usermodel.create({ username, password: hashedPassword });

        res.redirect('/user/home');
    } catch (err) {
        res.status(500).send('Server error. Please try again later.');
    }
});


// User Home - GET
router.get('/home',userAuth.checkSession, (req, res) => {
    res.render('user/home', { username: req.session.user.username  });
});




router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/user/home');
        }
        res.redirect('/user/login'); // Redirect to login after logout
    });
});







module.exports = router;

