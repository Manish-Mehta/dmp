const fetch = require('node-fetch');

const router = require('express').Router();

// Middlewares
const { checkJwt, createScopesMiddleware } = require('../middlewares/auth');

const dashboardData = async (req, res) => {

    let userInfo = await fetch('https://betsol-test.us.auth0.com/userinfo', {
        headers: {
            'Authorization': req.headers.authorization
        }
    });

    userInfo = await userInfo.json();
    console.log(userInfo);
    res.json({ message: `Super secret stuff for ${userInfo.name}` });

}

router.get('/', checkJwt, createScopesMiddleware(['read:dashboard'], { customScopeKey: "permissions" }), dashboardData);

module.exports = router;