//const dotenv = require('dotenv');
//const assert = require('assert');

//dotenv.config();

//const {
//    PORT,
//    HOST,
//    HOST_URL,
//    API_KEY,
//    AUTH_DOMAIN,
//    PROJECT_ID,
//    STORAGE_BUCKET,
//    MESSAGING_SENDER_ID,
//    APP_ID,
//} = process.env;

//assert(PORT, 'Port is required');
//assert(HOST, 'Host is required');

module.exports = {
    port: 5000,
    host: "localhost",
    hostUrl: "http://localhost:5000",
    firebaseConfig: {
        apiKey: "AIzaSyArSJdBYmbe5DCm-GPIiI6pQhST3339y2Y",
        authDomain: "money-2d647.firebaseapp.com",
        projectId: "money-2d647",
        storageBucket: "money-2d647.appspot.com",
        messagingSenderId: "1:500868205949:web:b1e09ab66cb9e4150a1014",
        appId: "G-EXEY5KVSWP",
    }
};