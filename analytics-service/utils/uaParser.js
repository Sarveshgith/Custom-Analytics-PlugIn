const UAParser = require('ua-parser-js');

exports.parseUserAgent = (uaString) => {
    try {
        const parser = new UAParser(uaString);

        return {
            device: parser.getDevice().type || 'unknown',
            os: parser.getOS().name || 'unknown',
            browser: parser.getBrowser().name || 'unknown',
        }
    } catch (error) {
        console.error('Error parsing user agent:', error);
        return {
            device: 'unknown',
            os: 'unknown',
            browser: 'unknown',
        }
    }
}