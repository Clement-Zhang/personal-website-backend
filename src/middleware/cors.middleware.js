import 'dotenv/config';

export default {
    origin: (origin, callback) => {
        console.log(
            'origin ',
            origin,
            'list ',
            process.env.CORS_ORIGINS.split(',')
        );
        if (!origin || process.env.CORS_ORIGINS.split(',').includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS'));
        }
    },
    methods: ['GET', 'POST'],
};
