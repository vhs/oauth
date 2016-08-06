module.exports = OAuth => class ExtensionGrant extends OAuth {
    /*jshint -W098 */ //todo remove upon implement
    extendedGrant(grantType, req, callback) {
        //todo check grantType

        callback("Unsupported grant type");
    }
    /*jshint +W098 */ //todo remove upon implement
};
