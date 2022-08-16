const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const app = express();
const fs = require('fs');
const port = 1337;
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.yourdomain.com/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.yourdomain.com/fullchain.pem', 'utf8')
};
const api = new ParseServer({
    appName: 'APP_NAME',
    databaseURI: 'mongodb://admin:password@localhost:27017/admin',
    appId: 'APP_ID',
    masterKey: 'MASTER_KEY',
    restAPIKey: 'REST_API_KEY',
    serverURL: 'https://api.yourdomain.com:1337/parse',
    publicServerURL: 'https://api.yourdomain.com',
    verifyUserEmails: true,
    revokeSessionOnPasswordReset: true,
    preventLoginWithUnverifiedEmail: true,
    emailVerifyTokenValidityDuration: 4 * 60 * 60,
    emailVerifyTokenReuseIfValid: false,
    enableAnonymousUsers: false,
    cloud: __dirname + '/cloud/main.js',
    emailAdapter: {
        module: 'parse-smtp-template',
        options: {
            port: 587,
            host: 'SMTP_HOST',
            user: 'SMTP_USER',
            password: 'SMTP_PASS',
            fromAddress: 'FROM_NAME <FROM_EMAIL>',
            passwordOptions: {
                subject: "Forgot your password?",
                body: "Don't worry, it happens to all of us!<br /><br />Click on the button below and you'll be able to change it to something new.",
                bth: "Reset Password"
            },
            confirmOptions: {
                subject: "Verify your Email",
                body: "Please confirm this is your email address by clicking on the button below.",
                btn: "Verify Email"
            },
        }
    },
    accountLockout: {
        // Lock the account for 5 minutes.
        duration: 5,
         // Lock an account after 3 failed log-in attempts
        threshold: 3,
        // Unlock the account after a successful password reset
        unlockOnPasswordReset: true,
    },
    passwordPolicy: {
        // Do not allow the username as part of the password
        doNotAllowUsername: true,
        // Do not allow to re-use the last 5 passwords when setting a new password
        maxPasswordHistory: 3,
    },
    liveQuery: {
     classNames: ["User"]
    },
    maxUploadSize: "20mb",
    }
);
app.use('/parse', api);
const httpsServer = require('https').createServer(options, app);
httpsServer.listen(port, () => {
    console.log('parse-server is running on port ', port);
});
ParseServer.createLiveQueryServer(httpsServer);
