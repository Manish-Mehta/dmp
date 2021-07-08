const fetch = require('node-fetch');

const router = require('express').Router();

// Middlewares
const { checkJwt, createScopesMiddleware } = require('../middlewares/auth');

const AUTH0_API_TOKEN = process.env.AUTH0_API_TOKEN;

const getRoles = async () => {

    let roles = await fetch('https://betsol-test.us.auth0.com/api/v2/roles', {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    roles = await roles.json();
    // console.log(roles);

    return roles || [];
}

const getRolesApi = async (req, res) => {
    const rolesList = await getRoles();
    res.send(rolesList);
}

router.get('/', checkJwt, createScopesMiddleware(['read:roles'], { customScopeKey: "permissions" }), getRolesApi);

module.exports = {
    router
};