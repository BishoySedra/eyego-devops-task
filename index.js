import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Eyego');
});

// endpoint to say hello to a user given in the query string
app.get('/hello', (req, res) => {
    const name = req.query.name || 'World';
    res.send(`Hello ${name}`);
});

try {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
} catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
}