module.exports = OAuth => class PasswordGrant extends OAuth {
    getUser(username, password, callback) {
        var self = this;
        this.nomos.post("AuthService1", "GetUser", { username: username, password: password })
            .then((user) => {
                if (!user) {
                    self.log.error("Null user");
                    callback("Invalid or expired user");
                } else {
                    callback(null, user);
                }
            }, (err) => {
                self.log.error(err, "Invalid or expired user");
                callback("Invalid or expired user");
            });
    }
};
