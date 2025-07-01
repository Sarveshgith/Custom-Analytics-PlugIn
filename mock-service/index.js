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

app.get('/analytics/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const response = await axios.get(`http://localhost:3000/analytics/${slug}`);

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/analytics', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/analytics');

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching overview analytics:', error);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(4000, () => {
    console.log('Mock service is running on port 4000');
})