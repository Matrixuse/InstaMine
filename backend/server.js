// server.js
const app = require('./src/app');
const config = require('./src/config/config');

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log('------------------------------------------');
    console.log(`Mini-Instagram Backend running on http://localhost:${PORT}`);
    console.log('------------------------------------------');
    console.log('[INFO] Mock DB is active (data is non-persistent).');
    console.log('[INFO] API Endpoints available under /api');
});