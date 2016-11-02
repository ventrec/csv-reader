'use strict';

module.exports = {
  title: 'Simple CSV reader',

  file: {
    path: null,
    parsed: {
      headerItems: [],
      bodyItems: []
    },
    dialog: {
      open: false
    }
  },
  
  displayer: {
    menu: null,
    
    sort: {
      key: null,
      asc: true
    },
    
    selected: {
      row: null,
      column: null
    }
  }
}