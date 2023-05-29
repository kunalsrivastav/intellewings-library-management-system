const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// const serviceAccount = require('../secret/library-mgmt-system-intelle-firebase-adminsdk-zncmq-b875d63c37.json');
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://library-mgmt-system-intelle.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = bucket;