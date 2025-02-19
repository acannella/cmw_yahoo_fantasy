const express = require('express');
const fantasyRouter = require('./routes/fantasyRouter');
var cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/', fantasyRouter);
app.use(express.static(__dirname + '/public'));

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
