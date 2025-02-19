const express = require('express');
const fantasyRouter = require('./routes/fantasyRouter');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/', fantasyRouter);

const port = 3000;

app.listen(port, () => {
  console.log(
    `California's Most Wanted Fantasy Site listening on port ${port}`
  );
});
