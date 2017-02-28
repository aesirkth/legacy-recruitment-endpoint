const spdy = require("spdy");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const SlackPoster = require("./lib/SlackPoster");
SlackPoster.configuration = require("./configuration.json").slack.recruitment;

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/recruitment", function(req, res, next) {
  SlackPoster.postInterestedUser(req.body.name, req.body.email, req.body.describeYourself, req.body.programOfStudy, req.body.yearsLeft, req.body.levelOfStudy)
  .then(() => {
    res.status(200);
    res.write("ok");
    res.end();
  })
  .catch((err) => next(err));
});

require("http").createServer(app).listen(8080);
console.log("Server listening on port 8080");