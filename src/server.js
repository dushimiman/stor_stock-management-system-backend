const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const users = [
    { email: 'Admin@gmail.com', password: 'Diane@123', token: 'abc123' },
];

const stockData = [
    {
        name: 'headofficer',
        items: {
            GPS: 10,
            SPEED_GOVERNORS: 5,
            FUEL_LEVER_SENSOR: 8,
            SENSOR_FOR_ROSCO: 6,
            X_1R_PRODUCT: 4
        }
    },
    {
        name: 'rusizi',
        items: {
            GPS: 7,
            SPEED_GOVERNORS: 2,
            FUEL_LEVER_SENSOR: 3,
            SENSOR_FOR_ROSCO: 9,
            X_1R_PRODUCT: 1
        }
    },
    {
        name: 'musanze',
        items: {
            GPS: 8,
            SPEED_GOVERNORS: 3,
            FUEL_LEVER_SENSOR: 6,
            SENSOR_FOR_ROSCO: 4,
            X_1R_PRODUCT: 2
        }
    },
    {
        name: 'muhanga',
        items: {
            GPS: 12,
            SPEED_GOVERNORS: 4,
            FUEL_LEVER_SENSOR: 7,
            SENSOR_FOR_ROSCO: 3,
            X_1R_PRODUCT: 5
        }
    },
    {
        name: 'rwamagana',
        items: {
            GPS: 6,
            SPEED_GOVERNORS: 7,
            FUEL_LEVER_SENSOR: 4,
            SENSOR_FOR_ROSCO: 2,
            X_1R_PRODUCT: 3
        }
    },
    {
        name: 'huye',
        items: {
            GPS: 9,
            SPEED_GOVERNORS: 6,
            FUEL_LEVER_SENSOR: 5,
            SENSOR_FOR_ROSCO: 8,
            X_1R_PRODUCT: 6
        }
    }
];

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, token: user.token });
    } else {
        res.json({ success: false });
    }
});

app.get('/api/stock', (req, res) => {
    res.json(stockData);
});
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/items', authenticateToken, (req, res) => {
    const { name, category_id, serial_number } = req.body;
    const branch_id = req.user.branch_id;

    if (req.user.role !== 'Stock Manager' || req.user.branch_id !== 1) {
        return res.status(403).send('Forbidden');
    }

    const sql = 'INSERT INTO items (name, category_id, branch_id, serial_number) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, category_id, branch_id, serial_number], (err, result) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('Item added successfully');
    });
});

app.get('/api/categories', authenticateToken, (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.json(results);
    });
});

app.get('/api/items', authenticateToken, (req, res) => {
    const sql = 'SELECT DISTINCT name FROM items';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.json(results);
    });
});

app.get('/api/item-categories', authenticateToken, (req, res) => {
    const sql = 'SELECT id, name FROM categories';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.json(results);
    });
});
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
