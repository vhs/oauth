module.exports = OAuth => class RefreshTokenGrant extends OAuth {
    saveRefreshToken(refreshToken, clientId, expires, user, callback) {
        this.nomos.post("AuthService1", "SaveRefreshToken", { userId: user.id, refreshToken: refreshToken, clientId: clientId, expires: expires })
            .then((/*token*/) => {
                callback(null);
            }, () => {
                callback("Error saving refresh token");
            });
    }

    getRefreshToken(refreshToken, callback) {
        this.nomos.post("AuthService1", "GetRefreshToken", { refreshToken: refreshToken })
            .then((token) => {
                callback(null, {
                    clientId: token.client.id,
                    expires: token.expires,
                    userId: token.user.id
                });
            }, () => {
                callback("Invalid or expired refresh token");
            });
    }

    revokeRefreshToken(refreshToken, callback) {
        this.nomos.post("AuthService1", "RevokeRefreshToken", { refreshToken: refreshToken })
            .then(() => {
                callback(null);
            }, () => {
                callback("Invalid or expired refresh token");
            });
    }
};
