const express = require('express');
const router = express.Router();
const Usermodel = require('../model/usermodel');
const userAuth = require('../middleware/userAuth');
const bcrypt = require('bcrypt');


router.get('/login',userAuth.isLogin,(req,res)=>{
    if(req.session.user && req.session){
        res.redirect('/user/home');
    }else{
        res.render('user/login', { error: null });  
    }
});


// User Login - POST
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await Usermodel.findOne({ username, password });

//         if (user) {
//             // Redirect to home if login is successful
//             req.session.user=user;
//             res.redirect('/user/home');
//         } else {
//             // Show error if login fails
//             res.render('user/login', { error: 'Invalid username or password.' });
//         }
//     } catch (err) {
//         res.status(500).send('Server error. Please try again later.');
//     }
// });



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
        // Check if username already exists
        const existingUser = await Usermodel.findOne({ username });

        if (existingUser) {
            // Username exists - Show error
            res.render('user/signup', { error: 'Username already exists.' });
        } else {
            // Create new user
            await Usermodel.create({ username, password });
            res.redirect('/user/home'); // Redirect to home after successful signup
        }
    } catch (err) {
        res.status(500).send('Server error. Please try again later.');
    }
});

// User Home - GET
router.get('/home',userAuth.checkSession, (req, res) => {
    res.render('user/home', { username: 'Usermodel' });
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

