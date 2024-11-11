const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/:category', (req, res) => {
    const categoryName = req.params.category;
    db.all("SELECT j.setup, j.delivery FROM jokes j JOIN categories c ON j.category_id = c.id WHERE c.name = ?", [categoryName], (err, jokes) => {
        if (err) {
            res.render('error', { message: "Error fetching jokes", error: err });
        } else {
            res.render('jokes', { jokes: jokes, category: categoryName });
        }
    });
});

// Route to handle adding a new joke
router.post('/new', (req, res) => {
    const { category, setup, delivery } = req.body;
    if (!category || !setup || !delivery) {
        res.render('error', { message: "All fields are required" });
    } else {
        db.run("INSERT INTO jokes (category_id, setup, delivery) VALUES ((SELECT id FROM categories WHERE name = ?), ?, ?)", [category, setup, delivery], function(err) {
            if (err) {
                res.render('error', { message: "Error adding joke", error: err });
            } else {
                res.redirect(`/jokebook/jokes/${category}`);
            }
        });
    }
});

module.exports = router;
