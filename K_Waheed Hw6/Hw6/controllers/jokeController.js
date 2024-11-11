const db = require('../models/db');

exports.getJokesByCategory = (req, res) => {
    const { category } = req.params;
    db.all("SELECT * FROM jokes WHERE category_id = (SELECT id FROM categories WHERE name = ?)", [category], (err, jokes) => {
        if (err) {
            res.status(500).render('error', { error: err.message });
            return;
        }
        res.render('jokes', { category, jokes });
    });
};

exports.addJoke = (req, res) => {
    const { category, setup, delivery } = req.body;
    db.run("INSERT INTO jokes (category_id, setup, delivery) VALUES ((SELECT id FROM categories WHERE name = ?), ?, ?)", [category, setup, delivery], function(err) {
        if (err) {
            res.status(500).render('error', { error: err.message });
            return;
        }
        res.redirect('/jokes/' + category);
    });
};
