import 'dotenv/config';

export default {
    origin: (origin, callback) => {
        if (
            !origin ||
            (process.env.NODE_ENV === 'development' &&
                origin === process.env.CORS_ORIGIN_DEVELOPMENT) ||
            (process.env.NODE_ENV === 'production' &&
                origin === process.env.CORS_ORIGIN_PRODUCTION)
        ) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS'));
        }
    },
    methods: ['GET', 'POST'],
};
