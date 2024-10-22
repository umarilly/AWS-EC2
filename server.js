import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World from my Node.js app');
});

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});