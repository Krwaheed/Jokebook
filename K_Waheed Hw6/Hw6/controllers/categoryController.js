const db = require('../models/db');

exports.getCategories = (req, res) => {
    db.all("SELECT * FROM categories", [], (err, categories) => {
        if (err) {
            res.status(500).render('error', { error: err.message });
            return;
        }
        res.render('categories', { categories });
    });
};
