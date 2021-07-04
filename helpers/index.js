const hbs = require("hbs");

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
