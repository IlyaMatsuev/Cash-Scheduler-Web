const errorDefinitions = require('./error-definitions');

module.exports = {
    throwHttpError: (response, error = -1, statusCode = 500, logging = true) => {
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

            if (logging) {
                console.log('\nError: ' + JSON.stringify(errors, null, ' '));
            }
        }
    },

    throwWebSocketError: (socket, error = -1, logging = true) => {
        let errorMessage;
        if (error && Number.isInteger(error)) {
            errorMessage = errorDefinitions[error.toString()];
        } else {
            errorMessage = error.message;
        }

        socket.send(JSON.stringify({error: errorDefinitions[error.toString()]}));

        if (logging) {
            console.log('\nError: ' + JSON.stringify(errorMessage, null, ' '));
        }
    }
};
