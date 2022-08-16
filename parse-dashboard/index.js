const express = require('express');
const ParseDashboard = require('parse-dashboard');
const fs = require('fs');
const port = 4040;
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/dashboard.yourdomain.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dashboard.yourdomain.com/fullchain.pem', 'utf8')
};
const dashboard = new ParseDashboard({
    apps: [{
        'serverURL': 'https://api.yourdomain.com/parse',
        'appId': 'APP_ID',
        'masterKey': 'MASTER_KEY',
        'appName': 'APP_NAME',
        'iconName': 'icon.png'
    }],
    users: [{
        'user': 'admin',
        'pass': 'yourPasswordHere'
    }],
    iconsFolder: __dirname + '/icons'
}, false);
const app = express();
app.use('/', dashboard);
const httpsServer = require('https').createServer(options, app);
httpsServer.listen(port, () => {
    console.log('parse-dashboard is running on port ', port);
})
