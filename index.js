import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Eyego');
});

app.get('/hello/:name', (req, res) => {
    // Extract the name from the URL parameters
    // req.params.name contains the name parameter
    res.send(`Hello ${req.params.name}`);
});

try {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
} catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
}