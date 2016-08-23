const request = require('superagent');

module.exports = (options) => {
    class Nomos {
        constructor(options) {
            this.log = options.log;

            this.baseUri = options.baseUri;
            this.token = options.token;
        }

        post(service, method, data) {
            var self = this;
            return new Promise((resolve, reject) => {
                let url = `${this.baseUri}/services/web/${service}.svc/${method}`;
                let logdata = Object.assign({}, data);
                if (logdata && logdata.password) logdata.password = "********";
                self.log.info({service:service, method:method, data:logdata, url: url, token:self.token}, "Calling service: " + url);
                request.post(url)
                    .send(data)
                    .set('X-Api-Key', self.token)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (err) {
                            self.log.error(err, "Error " + url);
                            return reject(err);
                        }

                        self.log.info("Success " + url);
                        resolve(JSON.parse(res.text));
                    });
            });
        }
    }

    return new Nomos(options);
};
