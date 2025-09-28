// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('<div style="background: red">Hwllo</div>');
});

// Start server
const PORT= 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
