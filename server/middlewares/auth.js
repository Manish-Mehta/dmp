const express = require("express");
const app = express();
const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.jwksUri
    }),

    audience: ["http://localhost:3004/api/"],
    issuer: process.env.JWIissuer,
    algorithms: ["RS256"],
});

const createScopesMiddleware = (scopes, options) => jwtAuthz(scopes, options);

module.exports = {
    checkJwt,
    createScopesMiddleware
}
