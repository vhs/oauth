module.exports = OAuth => class RefreshTokenGrant extends OAuth {
    saveRefreshToken(refreshToken, clientId, expires, user, callback) {
        var self = this;
        this.nomos.post("AuthService1", "SaveRefreshToken", { userId: user.id, refreshToken: refreshToken, clientId: clientId, expires: expires })
            .then((/*token*/) => {
                callback(null);
            }, (err) => {
                self.log.error(err, "Error saving refresh token");
                callback("Error saving refresh token");
            });
    }

    getRefreshToken(refreshToken, callback) {
        var self = this;
        this.nomos.post("AuthService1", "GetRefreshToken", { refreshToken: refreshToken })
            .then((token) => {
                if (!token) {
                    self.log.error("Null refresh token");
                    callback("Invalid or expired refresh token");
                } else {
                    callback(null, {
                        clientId: token.client.id,
                        expires: token.expires,
                        userId: token.user.id
                    });
                }
            }, (err) => {
                self.log.error(err, "Error getting refresh token");
                callback("Invalid or expired refresh token");
            });
    }

    revokeRefreshToken(refreshToken, callback) {
        var self = this;
        this.nomos.post("AuthService1", "RevokeRefreshToken", { refreshToken: refreshToken })
            .then(() => {
                callback(null);
            }, (err) => {
                self.log.error(err, "Error revoking refresh token");
                callback("Invalid or expired refresh token");
            });
    }
};
