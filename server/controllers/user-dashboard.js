const request = require('request');     // [Deprecated] Do not use request remove this after testing  

module.exports = {

    testProtectedApi: (req, res) => {
        console.log("token validated");
        console.log(req.user);
        res.json({ message: "Super secret stuff" });
    },
    dashboardData: (req, res) => {

        // console.log(req.headers);

        request.get({
            url: 'https://betsol-test.us.auth0.com/userinfo',
            headers: {
                'Authorization': req.headers.authorization
            }
        }, (e, r) => {
            const userInfo = JSON.parse(r.body);
            console.log(userInfo);
            res.json({ message: `Super secret stuff for ${userInfo.name}` });
        });

    }
}
