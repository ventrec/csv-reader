'use strict';

const Vue = require('vue/dist/vue');

new Vue({
  el: '#app',

  data() {
    return require('./store')
  },

  components: {
    navigation: require('./components/navigation/navigation.js'),
    openFile: require('./components/openFileComponent/openFileComponent.js'),
    fileContentDisplayer: require('./components/fileContentDisplayer/fileContentDisplayer')
  }
});