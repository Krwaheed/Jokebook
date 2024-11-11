const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Route to display a random joke on the landing page
router.get('/', (req, res) => {
  db.get("SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1", (err, joke) => {
    if (err) {
      res.render('error', { message: "Error fetching a random joke", error: err });
    } else {
      res.render('index', { joke: joke });
    }
  });
});

module.exports = router;
