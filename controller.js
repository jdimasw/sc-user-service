const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserModel = require('./user-model'); 

router.get('/', async (req, res) => {
    try {
        if(req.decoded.role != "admin") {
            return res.status(401).json({"error": true, "message": 'Unauthorized role access.' });
        }

    	const result = await UserModel.find({}, {password: 0, __v: 0});

        res.status(200).json({res: "User OK", data: result, user: req.decoded});
    } catch(err) {
        res.status(400).json({ error: true, message: err.message });
    }
});

router.post('/create', async(req, res) => {
	try {
        if(req.decoded.role != "admin") {
            return res.status(401).json({"error": true, "message": 'Unauthorized role access.' });
        }

		const { username, password, name, description, role } = req.body;
		const hashPassword = bcrypt.hashSync(password, 10);

		const user = new UserModel({ username, password: hashPassword, name, description, role });

		await user.save();

        res.status(200).json({res: "User Created"});

	} catch(err) {
        // console.log(err.message)
		res.status(400).json({ error: true, message: err.message });
	}

});

router.get('/:userId', async (req, res) => {
    try {
        const result = await UserModel.findById(req.params.userId, {_id: 0, password: 0});

        if(req.decoded.role != "admin" && result.username != req.decoded.username) {
            return res.status(401).json({"error": true, "message": 'Unauthorized role access.' });
        }

        res.status(200).json(result);
    } catch(err) {
        res.json(err)
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        if(req.decoded.role != "admin") {
            return res.status(401).json({"error": true, "message": 'Unauthorized role access.' });
        }

        const result = await UserModel.deleteOne({ _id: req.params.userId });

        res.status(200).json({res: "User Deleted"});
    } catch(err) {
        res.status(400).json({ error: true, message: err.message });
    }
});

router.patch('/:userId', async (req, res) => {
    try {
        if(req.decoded.role != "admin") {
            return res.status(401).json({"error": true, "message": 'Unauthorized role access.' });
        }

        const { username, password, name, description } = req.body;

        let params = {};

        if(username) params.username = username;
        if(password) params.password = bcrypt.hashSync(password, 10);
        if(name) params.name = name;
        if(description) params.description = description;

        const result = await UserModel.updateOne({ _id: req.params.userId }, {
            $set: params
        });
        res.status(200).json({res: "User Updated"});
    } catch(err) {
        res.status(400).json({ error: true, message: err.message });
    }
});

module.exports = router;