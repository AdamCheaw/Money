const firebase = require('../database/firebase');
const logger = require("firebase-functions/logger");
function CheckIsAllowedAPI(req, res, next) {
    const sessionCookie = req.cookies.session || '';  
    if (!sessionCookie) {
        logger.log("reject unauthorized request");
        return res.status(401).json({ status: false, error: "Unauthorized" });
    }

    firebase
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((decodedClaims) => {
            req.user = decodedClaims;
            next();
        })
        .catch((error) => {
            logger.log(`Firebase 'verifySessionCookie' failed. Error: ${error}`);
            return res.status(401).json({ status: false, error: "Unauthorized" });
        });
}

function CheckIsAllowedPage(req, res, next) {
    const sessionCookie = req.cookies.session || '';  

    if (!sessionCookie) {
        logger.log("reject unauthorized request");
        return res.redirect('/login');
    }

    firebase
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then((decodedClaims) => {
            req.user = decodedClaims;
            next();
        })
        .catch((error) => {
            logger.log(`Firebase 'verifySessionCookie' failed. Error: ${error}`);
            // Session cookie is unavailable or invalid. Force user to login.
            res.redirect('/login');
        });
}

function SessionLogin(req, res) {
    if (!req.headers.authorization) {
        logger.log("reject unauthorized request");
        return res.status(401).json({ status: false, error: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ");
    if (!token[1]) {
        logger.log("reject unauthorized request");
        return res.status(401).json({ status: false, error: "Unauthorized" });
    }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    firebase
        .auth()
        .createSessionCookie(token[1], { expiresIn })
        .then((sessionCookie) => {
                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: true }));
            },
            (error) => {
                logger.log(`Firebase 'createSessionCookie' failed. Error: ${error}`);
                res.status(401).send('UNAUTHORIZED REQUEST!');
            }
        );
}

function SessionLogout(req, res) {
    firebase
        .auth()
        .revokeRefreshTokens(req.user.uid)
        .then(() => {
            res.clearCookie('session');
            res.json({ status: true });
        })
        .catch((error) => {
            logger.log(`Firebase 'revokeRefreshTokens' failed. Error: ${error}`);
            res.status(500).send('Internal Server Error');
        });
}

module.exports = {
    CheckIsAllowedAPI, CheckIsAllowedPage, SessionLogin, SessionLogout
}