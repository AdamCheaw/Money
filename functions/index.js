
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const config = require('./config.js');
const { engine } = require('express-handlebars');
const port = config.port;
const billAPIRoutes = require('./routes/api/billAPI_route.js');
const billController = require('./controllers/page/bill_controller.js');
const { CheckIsAllowedAPI, CheckIsAllowedPage, SessionLogin, SessionLogout } = require('./routes/middleware.js');
const app = express();

// 設置 view engine
app.engine('handlebars', engine({
    extname: '.handlebars',
    helpers: require('./utils/handlebars-helpers')
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/bill', billAPIRoutes);
app.get('/test', CheckIsAllowedAPI, (req, res) => { res.send('Hello, test!') });
app.get('/', CheckIsAllowedPage, billController.RenderIndexPage); 
app.get('/login', (req, res) => { res.render('google_login', {}) })
app.get('/sessionLogout', CheckIsAllowedAPI, SessionLogout);
app.get('/sessionLogin', SessionLogin);

// for deploy to firebase functions
//exports.app = onRequest(app);

// for local test
app.listen(port, () => {
    console.log(`Server is running on ${config.hostUrl}`);
    console.log(`Firebase project id ${config.firebaseConfig.projectId}`);
});