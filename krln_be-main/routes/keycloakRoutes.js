// app.js
const express = require('express');
const router = express.Router();
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const app = express();
const PORT = process.env.KEYCLOAK_AUTH_SERVER_URL || 3000;

// Configure session storage for Keycloak
// const memoryStore = new session.MemoryStore();
// app.use(session({
//     secret: process.env.KEYCLOAK_CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore
// }));

// // Initialize Keycloak with session storage
// const keycloak = new Keycloak({ store: memoryStore });

// // Middleware for Keycloak
// app.use(keycloak.middleware({
//     logout: '/logout',
//     admin: '/'
// }));

// Open route (no authentication required)
// app.get('/', (req, res) => {
//     res.send('Welcome to the open API endpoint!');
// });

// // Login route (protected)
// app.get('keycloak/login', keycloak.protect(), (req, res) => {
//     res.send('Login successful! You are authenticated.');
// });

// // Logout route
// app.get('/logout', keycloak.protect(), (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = router;