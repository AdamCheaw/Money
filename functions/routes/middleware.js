const firebase = require('../database/firebase');

function CheckIsAllowedAPI(req, res, next) {
    const sessionCookie = req.cookies.session || '';  
    if (!sessionCookie) {
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
            // Session cookie is unavailable or invalid. Force user to login.
            return res.status(401).json({ status: false, error: "Unauthorized" });
        });
    //firebase
    //    .auth()
    //    .signInWithCustomToken(token[1])
    //    .then((docodedToken) => {
    //        req.user = docodedToken;
    //        next();
    //    })
    //    .catch((error) => {
    //        console.error(error);
    //        res.status(401).json({ status: false, error: "Unauthorized" });
    //    });
}

function CheckIsAllowedPage(req, res, next) {
    const sessionCookie = req.cookies.session || '';  

    if (!sessionCookie) {
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
            // Session cookie is unavailable or invalid. Force user to login.
            res.redirect('/login');
        });
}

function SessionLogin(req, res) {
    if (!req.headers.authorization) {
        return res.status(401).json({ status: false, error: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ");
    if (!token[1]) {
        return res.status(401).json({ status: false, error: "Unauthorized" });
    }
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    //firebase
    //    .auth()
    //    .verifyIdToken(token[1]) // 驗證google token
    //    .then((docodedToken) => {
    //        // 產生custom token用於 API 驗證
    //        return firebase.auth().createCustomToken(docodedToken.uid, { expiresIn });
    //    })
    //    .then((customToken) => {
    //        // 產生SessionCookie用於 Session 驗證
    //        firebase
    //            .auth()
    //            .createSessionCookie(token[1], { expiresIn })
    //            .then((sessionCookie) => {
    //                // 設置cookie policy和回傳token
    //                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
    //                res.cookie('session', sessionCookie, options);
    //                res.end(JSON.stringify({ status: 'success', token: customToken }));
    //            })
    //            .catch((error) => {
    //                console.error(error);
    //                res.status(401).send('UNAUTHORIZED REQUEST!');
    //            });
    //    })    
    //    .catch((error) => {
    //        console.error(error);
    //        res.status(401).send('INTERNAL ERROR');
    //    });
    firebase
        .auth()
        .createSessionCookie(token[1], { expiresIn })
        .then(
            (sessionCookie) => {
                // Set cookie policy for session cookie.
                const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: true }));
            },
            (error) => {
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
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
}

module.exports = {
    CheckIsAllowedAPI, CheckIsAllowedPage, SessionLogin, SessionLogout
}