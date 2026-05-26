class Validator {
    static isCommand(body, command) {
        return body === command || body.startsWith(command + ' ');
    }
    
    static extractArgs(body, command) {
        return body.slice(command.length).trim().split(' ').filter(arg => arg.length > 0);
    }
    
    static isValidNumber(number) {
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        return phoneRegex.test(number);
    }
    
    static isValidId(id) {
        return !isNaN(parseInt(id)) && parseInt(id) > 0;
    }
    
    static sanitizeInput(input) {
        // Prevent injection and bad characters
        return input.replace(/[<>]/g, '').trim();
    }
}

module.exports = Validator;
