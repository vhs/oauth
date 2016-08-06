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
            this.nomos.post("AuthService1", "GetAccessToken", { bearerToken: bearerToken })
                .then((token) => {
                    callback(null, token);
                }, () => {
                    callback("Invalid or expired access token");
                });
        }

        getClient(clientId, clientSecret, callback) {
            //todo implement restricting by client
            callback(null, {
                clientId: clientId,
                redirectUri: "https://membership.hackspace.ca"
            });
        }

        grantTypeAllowed(clientId, grantType, callback) {
            //todo filter grant types perhaps
            callback(null, true);
        }

        saveAccessToken(accessToken, clientId, expires, user, callback) {
            this.nomos.post("AuthService1", "SaveAccessToken", { userId: user.id, accessToken: accessToken })
                .then((/*token*/) => {
                    callback(null);
                }, () => {
                    callback("Error saving access token");
                });
        }
    }

    /*jshint -W064 */
    class VHSOauth extends Grants(options.types, OAuthBase) {}
    /*jshint +W064 */

    return new VHSOauth(options);
};
