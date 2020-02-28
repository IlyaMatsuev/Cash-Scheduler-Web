const errorDefinitions = require('./error-definitions');

module.exports = {
    throwHttpError: (response, error = -1, statusCode = 500) => {
        response.status(statusCode);

        let errors = [];
        if (Array.isArray(error)) {
            errors.push(...error);
        } else if (Number.isInteger(error)) {
            errors.push(errorDefinitions[error.toString()]);
        } else {
            errors.push(error);
        }

        if (!error) {
            response.end();
        } else {
            response.json({errors: errors});
            console.log('\nError: ' + JSON.stringify(errors, null, ' '));
        }
    }
};
