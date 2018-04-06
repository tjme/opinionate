// require('handlebars');

module.exports = function () {
  return (!this.isType
    && this.name.toLowerCase() !== 'nodeid'
    && this.name.toLowerCase() !== 'operator'
    && this.name.toLowerCase() !== 'lastupdated'
    && this.name.toLowerCase() !== 'created');
};
