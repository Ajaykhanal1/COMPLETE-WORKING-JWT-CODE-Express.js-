const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET_KEY = "mySecretKey";

/* ---------------------------
   LOGIN (Authentication)
----------------------------*/
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign(
            { username: username },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login Successful",
            token: token
        });
    } else {
        res.status(401).json({
            message: "Invalid Username or Password!"
        });
    }
});

/* ---------------------------
   JWT MIDDLEWARE
----------------------------*/
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            message: "Token Required"
        });
    }

    // Expected format: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(403).json({
            message: "Token format invalid"
        });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Invalid or Expired Token"
            });
        }

        req.user = decoded;
        next();
    });
}

/* ---------------------------
   PROTECTED ROUTE
----------------------------*/
app.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        message: "Welcome to dashboard!",
        user: req.user.username
    });
});

/* ---------------------------
   SERVER START
----------------------------*/
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
