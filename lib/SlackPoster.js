const request = require("request"); 

class SlackPoster {
  static get levelOfStudy() {
    return [ "bachelor", "master" ];
  }
  
  static validateKTHEmail(mail) {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)*(?:kth\.se)$/.test(mail);
  }


  static send(message) {
    return new Promise((resolve, reject) => {
      const webhookURL = SlackPoster.configuration.webhookURL;
      request
        .post({
          url: webhookURL, 
          form: { payload: JSON.stringify(message) } 
        }, function optionalCallback(err, httpResponse, body) {
          if (err) {
            return reject(err);
          }
          resolve();
        })
        .on("error", function(err) {
          return reject(err);
        });
    });
  }

  static parseInterestedUser(
    name,
    email,
    programOfStudy,
    yearsLeft, 
    levelOfStudy
  ) {
    yearsLeft = parseInt(yearsLeft);
    if(!name) return Promise.reject(new Error("name was not defined"));
    if(!email) return Promise.reject(new Error("email was not defined"));
    if(!SlackPoster.validateKTHEmail(email)) return Promise.reject(new Error("email was not valid"));
    if(!programOfStudy) return Promise.reject(new Error("program of study was not defined"));
    if(!isFinite(yearsLeft) || yearsLeft < 0) return Promise.reject(new Error("years left was invalid"));
    if(!levelOfStudy) return Promise.reject(new Error("level of study was not defined"));
    if(SlackPoster.levelOfStudy.indexOf(levelOfStudy) < 0) return Promise.reject(new Error("level of study was not valid"));

    let isMostLikelyInvalid = [
      name.length < 2,
      yearsLeft > 5,
      programOfStudy.length < 5
    ].some(val => !!val);

    name = name || "";
    email = email || "";
    programOfStudy = programOfStudy || "";
    levelOfStudy = levelOfStudy || "";
    let data = {
      mostLikelyInvalid: isMostLikelyInvalid,
      name: name,
      email: email,
      programOfStudy: programOfStudy,
      yearsLeft: yearsLeft,
      levelOfStudy: levelOfStudy
    };
    return Promise.resolve(data);
  }

  static postInterestedUser(
    name,
    email,
    programOfStudy,
    yearsLeft, 
    levelOfStudy
  ) {
    return SlackPoster.parseInterestedUser(name, email, programOfStudy, yearsLeft, levelOfStudy)
    .then(data => {
      return SlackPoster.send({
        text: "Someone have submitted themselves as interested in being recruited.",
        attachments: [
          {
            fallback: "The user",
            "fields": [
              {
                "title": "Name",
                "value": data.name,
                "short": false
              },
              {
                "title": "Email",
                "value": data.email,
                "short": false
              },
              {
                "title": "Program of study",
                "value": data.programOfStudy,
                "short": true
              },
              {
                "title": "Years left",
                "value": data.yearsLeft,
                "short": true
              },
              {
                "title": "Level of study",
                "value": data.levelOfStudy,
                "short": true
              }
            ]
          }
        ]
      });
    });
  }
}

module.exports = SlackPoster;