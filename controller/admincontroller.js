const Adminmodel = require('../model/adminmodel');
const bcrypt = require('bcrypt');
const Usermodel = require('../model/usermodel');




const Loadlogin = async(req,res)=>{
    res.render('admin/login');
}


const login = async(req,res)=>{
    try{
        const {username,password} = req.body;
        const admin = await Adminmodel.findOne({username});

        if(!admin) return res.render('admin/login',{error: 'Invalid Credentials'});

        const isMatch = await bcrypt.compare(password,admin.password);

        if(!isMatch) return res.render('admin/login',{error: 'Invalid Credentials'});
        req.session.admin = true;

        res.redirect('/admin/dashboard');
    
    
    }catch(error){
        res.send(error);
    }
}


const Loaddashboard = async(req,res)=>{

    try {

        const admin = req.session.admin;
        if(!admin) return res.redirect('/admin/login');
        

        const users = await Usermodel.find({});
        

         res.render('admin/dashboard',{users});


    } catch (error) {

       res.send(error);

        
        
    }
}


// Add User
const addUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Usermodel({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding user');
    }
};

// Edit User
const editUser = async (req, res) => {
    try {
        const { username, password,userId } = req.body;
        
       const updates = { username };

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        
        await Usermodel.findByIdAndUpdate(userId, updates);

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user');
    }
};


//delete user
const deleteUser = async (req, res) => {
    try {
        const {userId} = req.body;
        console.log('Attempting to delete user:', userId);

        // Find and delete the user
        const result = await Usermodel.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



// Logout Function
const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Error logging out');
            }
            res.redirect('/admin/login');
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).send('Error logging out');
    }
};


module.exports = { Loadlogin,login,Loaddashboard, addUser, editUser, deleteUser,logout };

