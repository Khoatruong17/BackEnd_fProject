const express = require('express');
const app = express();
const port = 8386;

app.get('/', (req, res) => {
  res.send('Hello My!');
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
