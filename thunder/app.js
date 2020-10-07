const express = require('express');
const app = express();
const port = 5000;

app.use(express.static("public"));

app.get("/", function(req, res) {

});

app.get('/auth/spotify/callback', function(req, res) {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
