const app = require('express')();

// Controllers
const { testProtectedApi, dashboardData } = require('./controllers/user-dashboard');

// Middlewares
const { checkJwt, createScopesMiddleware } = require('./middlewares/auth');

app.get('/api/protected', checkJwt, testProtectedApi);
app.get('/api/dashboard', checkJwt, /* createScopesMiddleware(['read:dashboard']), */ dashboardData);


module.exports = app;