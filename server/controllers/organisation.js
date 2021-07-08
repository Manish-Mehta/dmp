const fetch = require('node-fetch');

const router = require('express').Router();

// Middlewares
const { checkJwt, createScopesMiddleware } = require('../middlewares/auth');

const AUTH0_API_TOKEN = process.env.AUTH0_API_TOKEN;
const DEFAULT_CONN_ID = process.env.DEFAULT_CONN_ID;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;

const createOrg = async ({ name, displayName, metadata }) => {

    if (!displayName) {
        displayName = name;
    }

    name = name.replace(/\s/g, '-').toLowerCase();

    let orgDetails = await fetch('https://betsol-test.us.auth0.com/api/v2/organizations', {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            name,
            metadata,
            "display_name": displayName
        })
    });

    orgDetails = await orgDetails.json();
    // console.log(orgDetails);

    addConnectionToOrg({ id: orgDetails.id });
    return orgDetails;
}

const addConnectionToOrg = async ({ id, connectionId = DEFAULT_CONN_ID, assignMembershipOnLogin = false }) => {

    let conDetails = await fetch(`https://betsol-test.us.auth0.com/api/v2/organizations/${id}/enabled_connections`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            connection_id: connectionId,
            assign_membership_on_login: assignMembershipOnLogin
        })
    });

    conDetails = await conDetails.json();
    // console.log(conDetails);

    return conDetails;
}

const getConnectionsOfOrg = async ({ id }) => {

    let conDetails = await fetch(`https://betsol-test.us.auth0.com/api/v2/organizations/${id}/enabled_connections`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    conDetails = await conDetails.json();
    console.log(conDetails);

    if (conDetails.length === 0) {
        conDetails = {};
    } else {
        conDetails = conDetails[0];
    }

    return conDetails;
}

const inviteUser = async ({ orgId, inviter, invitee, roles, connectionId }) => {

    let invitation = await fetch(`https://betsol-test.us.auth0.com/api/v2/organizations/${orgId}/invitations`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({
            inviter: { name: inviter },
            invitee: { email: invitee },
            connection_id: connectionId,
            client_id: AUTH0_CLIENT_ID,
            roles
        })
    });

    invitation = await invitation.json();
    console.log(invitation);

    return invitation || {};
}

const getMembers = async ({ id }) => {

    let members = await fetch(`https://betsol-test.us.auth0.com/api/v2/organizations/${id}/members`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    members = await members.json();
    console.log(members);

    return members || [];
}

const getInvites = async ({ id }) => {

    let invites = await fetch(`https://betsol-test.us.auth0.com/api/v2/organizations/${id}/invitations`, {
        headers: {
            Authorization: `Bearer ${AUTH0_API_TOKEN}`,
            'Content-Type': 'application/json',
        }
    });

    invites = await invites.json();
    console.log(invites);

    return invites || [];
}

const createOrgApi = async (req, res) => {

    const { name, displayName, metadata } = req.body;

    if (!name) {
        return res.status(400).send({ error: 'Organisation Name is required' });
    }

    const orgDetails = await createOrg({ name, displayName, metadata });

    if (!orgDetails.id) {
        return res.status(orgDetails.statusCode || 400).send(orgDetails);
    }
    res.send({ message: `${orgDetails.name} created Successfilly with id ${orgDetails.id}` });

}

const inviteUserApi = async (req, res) => {

    const orgId = req.params.id;
    const { inviter, invitee, roles } = req.body;

    const { connection_id } = await getConnectionsOfOrg({ id: orgId });

    if (!connection_id) {
        return res.status(400).send({ error: 'Organisation Connection Not Found' });
    }

    const invitation = await inviteUser({ orgId, inviter, invitee, roles, connectionId: connection_id });

    if (!invitation.id) {
        return res.status(invitation.statusCode || 400).send(invitation);
    }

    res.send(invitation);
}

const getAllMembersApi = async (req, res) => {

    const orgId = req.params.id;

    const members = await getMembers({ id: orgId });
    const invites = await getInvites({ id: orgId });

    invites.forEach(invite => {
        members.push({
            email: invite.invitee.email,
            // joined: false
        });
    });

    res.send(members);
}

router.post('/create', checkJwt, createScopesMiddleware(['edit:organisation'], { customScopeKey: "permissions" }), createOrgApi);
router.post('/:id/invite-user', checkJwt, createScopesMiddleware(['invite:organization_user'], { customScopeKey: "permissions" }), inviteUserApi);
router.get('/:id/all-members', checkJwt, createScopesMiddleware(['read:organization_members'], { customScopeKey: "permissions" }), getAllMembersApi);

module.exports = {
    router,
    createOrg,
    addConnectionToOrg,
    getConnectionsOfOrg
};