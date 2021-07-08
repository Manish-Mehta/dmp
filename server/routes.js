const app = require('express')();

// Controllers
const dashboard = require('./controllers/user-dashboard');
const { router: organisationRouter } = require('./controllers/organisation');
const { router: userRouter } = require('./controllers/user');
const { router: rolesRouter } = require('./controllers/roles');

app.use('/api/dashboard', dashboard); //Dummy API to get User info from AUth0 via Access token
app.use('/api/org', organisationRouter);
app.use('/api/user', userRouter);
app.use('/api/roles', rolesRouter);

module.exports = app;
