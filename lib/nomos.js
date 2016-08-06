const request = require('superagent');

module.exports = (options) => {
    class Nomos {
        constructor(options) {
            this.log = options.log;

            this.baseUri = options.baseUri;
            this.token = options.token;
        }

        post(service, method, data) {

            return new Promise((resolve, reject) => {
                request.post(`${this.baseUri}/services/web/${service}.svc/${method}`)
                    .send(data)
                    .set('X-Api-Key', this.token)
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (err) return reject(err);

                        resolve(JSON.parse(res.text));
                    });
            });
        }
    }

    return new Nomos(options);
};
