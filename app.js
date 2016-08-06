process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; //todo lazy

const nconf = require("nconf");

nconf.argv({
    'verbose': {
        boolean: true,
        describe: 'Verbose logging'
    },
    'loglevel': {
        type: 'string',
        describe: 'debug | info | warn* | error'
    },
    'port': {
        alias: 'p',
        type: 'number',
        describe: 'Service listener port. Defaults to 3000'
    },
    'nomos': {
        type: 'string',
        describe: 'Nomos Root URL'
    },
    'nomostoken': {
        type: 'string',
        describe: 'Nomos authtoken'
    },
    'grants': {
        type: 'array',
        describe: 'Supported grant types. authorization_code, client_credentials, extension, password, refresh_token'
    }
})
.env()
.file('config.json')
.defaults({
    'nomos': 'https://membership.hackspace.ca',
    'nomostoken': 'invalid',
    'port': 3000,
    'loglevel': 'debug',
    'verbose': false,
    'grants': ["authorization_code", "client_credentials", "extension", "password", "refresh_token"]
});

if (nconf.get('help')) {
    console.log(nconf.stores.argv.help());
    return;
}

let logLevel = (nconf.get('verbose')) ? 'debug' : nconf.get('loglevel');

const bunyan = require('bunyan');

let logStreams = [];

logStreams.push({
    stream: process.stdout
});

logStreams.push({
    type: 'rotating-file',
    path: 'server.log',
    period: '1d',
    count: 3
});

var log = bunyan.createLogger({
    name: 'vhs-oauth',
    streams: logStreams,
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res
    },
    level: logLevel
});

var express = require('express'),
    bodyParser = require('body-parser'),
    oauthserver = require('oauth2-server');
 
var app = express();
 
app.use(bodyParser.urlencoded({ extended: true }));
 
app.use(bodyParser.json());

const nomos = require('./lib/nomos')({
    log: log,
    baseUri: nconf.get('nomos'),
    token: nconf.get('nomostoken')
});

const vhsoauth = require('./lib/oauth/base')({
    nomos: nomos,
    log: log,
    types: nconf.get('grants')
});
 
app.oauth = oauthserver({
  model: vhsoauth, // See below for specification
  grants: ['password'],
  debug: true
});
 
app.all('/oauth/token', app.oauth.grant());
 
app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

app.get('/login', (req, res) => {
    res.send(`
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script>
function login(){
    $.ajax({
        type: 'POST',
        url: "/oauth/token",
        //Add the request header
        headers: {
            Authorization: 'Basic ' + window.btoa('someclientid:someclientsecret base64')
        },
        contentType: 'application/x-www-form-urlencoded',
        data: {
            grant_type: "password",
            username: $("#username").val(),
            password: $("#password").val()
        },
        success: function(response) {
            console.log(response);
        },
        error: function(xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            console.log(err);
        }
    });
}
</script>
</head>
<body>
<form>
<input type="text" id="username"/>
<input type="password" id="password"/>
<input type="button" onclick="login()" value="Submit">
</form>
</body>
</html>
`);
});

app.get('/health', (req, res) => {
    res.send('Everything is awesome!');
});
 
app.use(app.oauth.errorHandler());
 
app.listen(nconf.get('port'));
