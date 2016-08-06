module.exports = OAuth => class PasswordGrant extends OAuth {
    getUser(username, password, callback) {
        this.nomos.post("AuthService1", "GetUser", { username: username, password: password })
            .then((user) => {
                callback(null, user);
            }, (/*err*/) => {
                callback("Invalid or expired user");
            });
    }
};
