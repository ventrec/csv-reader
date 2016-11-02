'use strict';

const fs = require('fs');

module.exports = {
  template: fs.readFileSync(__dirname + '/navigation.html', 'utf-8'),

  components: {
    openFile: require('../openFileComponent/openFileComponent')
  }
}