module.exports = options => {
    const Grants = (types, base) => types.reduce((p, grant) => {
        return require(`./grants/${grant}`)(p);
    }, base);

    class OAuthBase {
        constructor(options) {
            this.log = options.log;
            this.nomos = options.nomos;
            this.storage = [];
        }

        getAccessToken(bearerToken, callback) {
            var self = this;
            this.nomos.post("AuthService1", "GetAccessToken", { bearerToken: bearerToken })
                .then((token) => {
                    if (!token) {
                        self.log.error("Null token");
                        callback("Invalid or expired access token");
                    } else {
                        callback(null, token);
                    }
                }, (err) => {
                    self.log.error(err, "Invalid or expired access token");
                    callback("Invalid or expired access token");
                });
        }

        getClient(clientId, clientSecret, callback) {
            var self = this;
            this.nomos.post("AuthService1", "GetClient", { clientId: clientId, clientSecret: clientSecret })
                .then((client) => {
                    if (!client) {
                        self.log.error("Null client");
                        callback("Invalid client");
                    } else {
                        callback(null, {
                            clientId: client.id,
                            redirectUri: client.redirecturi
                        });
                    }
                }, (err) => {
                    self.log.error(err, "Invalid client");
                    callback("Invalid client");
                });
        }

        grantTypeAllowed(clientId, grantType, callback) {
            //todo filter grant types perhaps
            callback(null, true);
        }

        saveAccessToken(accessToken, clientId, expires, user, callback) {
            var self = this;
            this.nomos.post("AuthService1", "SaveAccessToken", { userId: user.id, accessToken: accessToken, clientId: clientId, expires: expires })
                .then((/*token*/) => {
                    callback(null);
                }, (err) => {
                    self.log.error(err, "Error saving access token");
                    callback("Error saving access token");
                });
        }
    }

    /*jshint -W064 */
    class VHSOauth extends Grants(options.types, OAuthBase) {}
    /*jshint +W064 */

    return new VHSOauth(options);
};
