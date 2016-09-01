var docs = require('./docs');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/docs/:doc_name', docs.index);
}