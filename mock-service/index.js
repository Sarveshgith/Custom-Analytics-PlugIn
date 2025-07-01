const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

app.get('/s/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.ip ||
            'unknown';

        const ua = req.headers['user-agent'] || 'unknown';
        const referer = req.headers['referer'] || 'direct';

        await axios.post('http://localhost:3000/track', {
            slug,
            ip,
            referer,
            userAgent: ua
        });

        res.status(200).json({
            message: 'Tracking data sent successfully',
            slug,
            ip,
            referer,
            userAgent: ua
        });
    } catch (error) {
        console.error('Error in mock service:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(4000, () => {
    console.log('Mock service is running on port 4000');
})