import 'dotenv/config';

export default {
    origin: (origin, callback) => {
        console.log('origin', origin);
        if (!origin || process.env.CORS_ORIGINS.split(',').includes(origin)) {
            console.log('allowed by CORS');
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS'));
        }
    },
    methods: ['GET', 'POST'],
};
