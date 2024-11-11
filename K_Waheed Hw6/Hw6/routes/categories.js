const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', (req, res) => {
    db.all("SELECT * FROM categories", (err, categories) => {
        if (err) {
            res.render('error', { message: "Error fetching categories", error: err });
        } else {
            res.render('categories', { categories: categories });
        }
    });
});

module.exports = router;
