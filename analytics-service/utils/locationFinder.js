exports.findLocation = async (ip) => {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();

        return {
            city: data.city || 'unknown',
            country: data.country || 'unknown',
        }
    } catch (error) {
        console.error('Error finding location:', error);
        return {
            city: 'unknown',
            country: 'unknown',
        }
    }
}