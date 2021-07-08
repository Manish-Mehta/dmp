const router = require('express').Router();
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const { getConnectionsOfOrg } = require('./organisation');

// Middlewares
const { checkJwt, createScopesMiddleware } = require('../middlewares/auth');

const AUTH0_API_TOKEN = process.env.AUTH0_API_TOKEN;

// const createUser = async ({ name, displayName, metadata }) => {
//     let orgDetails = await fetch('https://betsol-test.us.auth0.com/api/v2/users', {
//         headers: {
//             Authorization: `Bearer ${AUTH0_API_TOKEN}`,
//             'Content-Type': 'application/json',
//         },
//         method: 'POST',
//         body: JSON.stringify({
//             "email": "john.doe@gmail.com",
//             "phone_number": "+199999999999999",
//             "user_metadata": {},
//             "blocked": false,
//             "email_verified": false,
//             "phone_verified": false,
//             "app_metadata": {},
//             "given_name": "John",
//             "family_name": "Doe",
//             "name": "John Doe",
//             "nickname": "Johnny",
//             "picture": "https://secure.gravatar.com/avatar/15626c5e0c749cb912f9d1ad48dba440?s=480&r=pg&d=https%3A%2F%2Fssl.gstatic.com%2Fs2%2Fprofiles%2Fimages%2Fsilhouette80.png",
//             "user_id": "abc",
//             "connection": "Initial-Connection",
//             "password": "secret",
//             "verify_email": false,
//             "username": "johndoe"
//         })
//     });

//     orgDetails = await orgDetails.json();
// }

const getUserOrg = async ({ userId }) => {

    let orgDetails = await fetch(`https://betsol-test.us.auth0.com/api/v2/users/${userId}/organizations`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    orgDetails = await orgDetails.json();

    console.log(orgDetails);

    if (orgDetails.length === 0) {
        orgDetails = {};
    } else {
        orgDetails = orgDetails[0];
    }

    return orgDetails;
}

const getUserByEmail = async ({ email }) => {

    let userDetails = await fetch(`https://betsol-test.us.auth0.com/api/v2/users-by-email?` + new URLSearchParams({
        email,
        fields: 'user_id,email,identities'
    }), {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    userDetails = await userDetails.json();

    console.log(userDetails);

    if (userDetails.length === 0) {
        userDetails = {};
    } else {
        userDetails = userDetails[0];
    }

    return userDetails;
}

// const createUserApi = async (req, res) => {

//     const { name, displayName, metadata } = req.body;

//     const orgDetails = await createUser({ name, displayName, metadata });

//     if (!orgDetails.id) {
//         return res.status(orgDetails.statusCode || 400).send(orgDetails);
//     }
//     res.send({ message: `${orgDetails.name} created Successfilly with id ${orgDetails.id}` });
// }

const getUserOrgApi = async (req, res) => {
    const org = await getUserOrg({ userId: req.user.sub });
    res.send(org);
}

const getOrgByEmailApi = async (req, res) => {
    const user = await getUserByEmail({ email: req.query.email });

    if (!user || !user.user_id) {
        return res.send({ error: "No User Found" });
    }

    const org = await getUserOrg({ userId: user.user_id });

    if (!org || !org.id) {
        return res.send({ error: "No Organization Found For User" });
    }

    const orgConnection = await getConnectionsOfOrg({ id: org.id });

    if (!orgConnection || !orgConnection.connection_id) {
        return res.send({ error: "No Connection Found for Organization" });
    }

    res.send({ connection: orgConnection, ...org });
}

// router.post('/create', checkJwt, createScopesMiddleware(['edit:user'], { customScopeKey: "permissions" }), createUserApi);
router.get('/org', checkJwt, getUserOrgApi);
router.get('/org-by-email', getOrgByEmailApi); //Public API

module.exports = {
    router,
    // createUser,
    getUserOrg

};