const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'identifier.sqlite');


const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error when opening the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});


function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE
        )`, (err) => {
            if (err) {
                console.error('Error creating categories table:', err.message);
            } else {
                console.log('Categories table is ready.');

                seedCategories();
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS jokes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            setup TEXT,
            delivery TEXT,
            FOREIGN KEY(category_id) REFERENCES categories(id)
        )`, (err) => {
            if (err) {
                console.error('Error creating jokes table:', err.message);
            } else {
                console.log('Jokes table is ready.');

                seedJokes();
            }
        });
    });
}


function seedCategories() {
    const categories = ['funnyJoke', 'lameJoke'];
    const stmt = db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)");
    categories.forEach(category => {
        stmt.run(category);
    });
    stmt.finalize();
}


function seedJokes() {
    const jokes = [
        { category: 'funnyJoke', setup: 'Why did the student eat his homework?', delivery: 'Because the teacher told him it was a piece of cake!' },
        { category: 'funnyJoke', setup: 'What kind of tree fits in your hand?', delivery: 'A palm tree' },
        { category: 'funnyJoke', setup: 'What is worse than raining cats and dogs?', delivery: 'Hailing taxis' },
        { category: 'lameJoke', setup: 'Which bear is the most condescending?', delivery: 'Pan-DUH' },
        { category: 'lameJoke', setup: 'What would the Terminator be called in his retirement?', delivery: 'The Exterminator' }
    ];
    jokes.forEach(joke => {
        db.run("INSERT INTO jokes (category_id, setup, delivery) VALUES ((SELECT id FROM categories WHERE name = ?), ?, ?)",
            [joke.category, joke.setup, joke.delivery], (err) => {
                if (err) {
                    console.error('Error inserting joke:', err.message);
                }
            });
    });
}

module.exports = db;
