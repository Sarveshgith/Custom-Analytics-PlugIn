const express = require('express');
const LogModel = require('./logModel');
const { syncDB, sequelize } = require('./config/database');
const { parseUserAgent } = require('./utils/uaParser');
const { findLocation } = require('./utils/locationFinder');
const app = express();
require('dotenv').config();
app.use(express.json());

syncDB();

app.post('/track', async (req, res) => {
    try {
        const { slug, ip, referer, userAgent } = req.body;

        let device = 'unknown', os = 'unknown', browser = 'unknown';
        let city = 'unknown', country = 'unknown';

        if (userAgent != 'unknown') {
            const parsed = parseUserAgent(userAgent);
            device = parsed.device;
            os = parsed.os;
            browser = parsed.browser;
        }

        if (ip != 'unknown') {
            const location = findLocation(ip);
            city = location.city;
            country = location.country;
        }

        const newLog = await LogModel.create({
            slug,
            ip,
            referer,
            device,
            os,
            browser,
            location: {
                city,
                country
            }
        });

        res.status(200).json({
            message: 'Tracking data recorded successfully',
            id: newLog.id
        });
    } catch (error) {
        console.error('Error tracking log:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/analytics/:slug', async (req, res) => {
    try {
        const { slug } = req.params;

        const logs = await LogModel.findAll({
            where: { slug },
            order: [['timeStamp', 'DESC']]
        });

        if (logs.length === 0) {
            return res.status(404).json({
                message: 'No analytics data found for this slug',
                slug
            });
        }

        const totalViews = logs.length;
        const uniqueVisitors = [...new Set(logs.map(log => log.ip))].length;

        // Most common device
        const devices = logs.reduce((acc, log) => {
            acc[log.device] = (acc[log.device] || 0) + 1;
            return acc;
        }, {});
        const topDevice = Object.entries(devices).sort((a, b) => b[1] - a[1])[0];

        // Most common browser
        const browsers = logs.reduce((acc, log) => {
            acc[log.browser] = (acc[log.browser] || 0) + 1;
            return acc;
        }, {});
        const topBrowser = Object.entries(browsers).sort((a, b) => b[1] - a[1])[0];

        // Most common country
        const countries = logs.reduce((acc, log) => {
            const country = log.location?.country || 'unknown';
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {});
        const topCountry = Object.entries(countries).sort((a, b) => b[1] - a[1])[0];

        const analytics = {
            slug,
            totalViews,
            uniqueVisitors,
            topDevice: topDevice ? { device: topDevice[0], count: topDevice[1] } : null,
            topBrowser: topBrowser ? { browser: topBrowser[0], count: topBrowser[1] } : null,
            topCountry: topCountry ? { country: topCountry[0], count: topCountry[1] } : null,
            firstVisit: logs[logs.length - 1]?.timeStamp,
            lastVisit: logs[0]?.timeStamp
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/analytics', async (req, res) => {
    try {
        const slugStats = await LogModel.findAll({
            attributes: [
                'slug',
                [sequelize.fn('COUNT', sequelize.col('id')), 'views'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('ip'))), 'uniqueVisitors']
            ],
            group: ['slug'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
        });

        const totalViews = await LogModel.count();

        const overview = {
            totalViews,
            totalSlugs: slugStats.length,
            topSlugs: slugStats.map(stat => ({
                slug: stat.slug,
                views: parseInt(stat.dataValues.views),
                uniqueVisitors: parseInt(stat.dataValues.uniqueVisitors)
            }))
        };

        res.status(200).json(overview);
    } catch (error) {
        console.error('Error fetching overview analytics:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Analytics service is running on port 3000');
})