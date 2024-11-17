const router = require('express').Router();
const User = require('../models/user');
const Assign = require('../models/assignment');
const { verifyAndAuth } = require('./token');

//Fetching all admins
// :id is user id and provide token in the header
router.get('/admins/:id', verifyAndAuth, async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true });
        if (admins.length === 0) {
            res.status(404).json("no admins found");
            return;
        }
        res.status(200).json(admins);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
});

//uploading an assignment
router.post('/upload/:id', verifyAndAuth, async (req, res) => {
    const assign = new Assign({
        task: req.body.task,
        admin: req.body.adminId,
        user: req.params.id
    });

    let savedAssign;

    try {

        if(typeof assign.task !== String){
            res.status(400).json("task must be of type string");
            return;
        }

        //checking the validity of admin
        const admin = await User.findById(req.body.adminId);
        if (!admin || !admin.isAdmin) {
            res.status(400).json("this admin does not exist");
            return;
        }

        savedAssign = await assign.save();

    } catch (err) {
        res.status(500).json(err.message);
        return;
    }

    try {
        let newUser = await User.findById(req.params.id);
        newUser.assignments.push(savedAssign._id);
        const user = await User.findByIdAndUpdate(req.params.id, {
            $set: newUser
        });
        res.status(200).json({"Saved assignment": savedAssign});

    } catch (err) {
        res.status(500).json(err.message);
    }

});


//fetching all assignments tagged to admin
router.get('/assignments/:id', verifyAndAuth, async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.isAdmin) {
            res.status(400).json("this admin does not exist");
            return;
        }
    }catch(err){
        res.status(500).json(err.message);
        return;
    }

    
    try {

        const allAssign = await Assign.find({ admin: req.params.id });
        res.status(200).json(allAssign);

    } catch (err) {
        res.status(500).json(err.message);
    }


});

// accepting an assignment
router.post('/assignments/:id1/accept/:id', verifyAndAuth, async (req, res) => {

    const assignId = req.params.id1;

    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            res.status(400).json("this admin does not exist");
            return;
        }
    }catch(err){
        res.status(500).json(err.message);
        return;
    }

    try {
        const newAssign = {};
        newAssign.status = 'accepted';

        const updatedAssign = await Assign.findByIdAndUpdate(assignId, {
            $set: newAssign
        });

        res.status(200).json({"updated Assignment": updatedAssign});

    } catch (err) {
        res.status(500).json(err.message);
    }

});

//rejecting an assignment
router.post('/assignments/:id1/reject/:id', verifyAndAuth, async (req, res) => {

    const assignId = req.params.id1;

    try {
        const user = await User.findById(req.user.id);

        if (!user || !user.isAdmin) {
            res.status(400).json("this admin does not exist");
            return;
        }
    }catch(err){
        res.status(500).json(err.message);
        return;
    }

    try {
        const newAssign = {};
        newAssign.status = 'rejected';

        const updatedAssign = await Assign.findByIdAndUpdate(assignId, {
            $set: newAssign
        });

        console.log(updatedAssign);
        res.status(200).json({"updated Assignment": updatedAssign});

    } catch (err) {
        res.status(500).json(err.message);
    }

});


module.exports = router;
