switch (process.env.NODE_ENV) {
    case 'prod':
        module.exports = require('./config/webpack.prod');
        break;
    default:
        module.exports = require('./config/webpack.dev');
}