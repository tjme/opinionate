import * as handlebars from 'handlebars';
import pluralize from 'pluralize';

module.exports = function (term: string) {
  return new handlebars.SafeString(
    pluralize(term)
  );
};
