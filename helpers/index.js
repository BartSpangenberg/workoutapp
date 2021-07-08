const hbs = require("hbs");
const moment = require('moment');

// in order to create functions that make the conditions I want for the hbs file (checkbox and radio box)
hbs.registerHelper("ifeq", function (a, b, options) {
  if (a == b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper("ifin", function (elem, list, options) {
  if (list === undefined) {
    return options.inverse(this);
  }
  if (list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});


hbs.registerHelper('formatTime', function (date, format) {
          var mmnt = moment(date);
          return mmnt.format(format);
})
