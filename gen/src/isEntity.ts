// require('handlebars');

module.exports = function () {
  return (this.interfaces[0] === 'Node' && this.name !== 'Query');
};
