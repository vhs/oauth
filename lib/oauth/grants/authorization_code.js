module.exports = OAuth => class AuthorizationCodeGrant extends OAuth {
    /*jshint -W098 */ //todo remove upon implement
    getAuthCore(authCode, callback) {
        callback("Unsupported grant type");
    }

    saveAuthCore(authCode, clientId, expires, user, callback) {
        callback("Unsupported grant type");
    }
    /*jshint +W098 */ //todo remove upon implement
};
