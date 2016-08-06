module.exports = OAuth => class ClientCredentialsGrant extends OAuth {
    /*jshint -W098 */ //todo remove upon implement
    getUserFromClient(clientId, clientSecret, callback) {
        callback("Unsupported grant type");
    }
    /*jshint +W098 */ //todo remove upon implement
};
