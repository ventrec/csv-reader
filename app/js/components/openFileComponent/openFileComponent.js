'use strict';

const fs = require('fs');
const {dialog} = require('electron').remote;
const Baby = require('babyparse');

module.exports = {
  template: fs.readFileSync(__dirname + '/openFileComponent.html', 'utf-8'),

  data() {
    return require('../../store')
  },

  methods: {
    chooseFile() {
      // Prevent further action if dialog is already open
      if (this.file.dialog.open) {
        return;
      }

      this.file.dialog.open = true;
      this.resetFile();

      dialog.showOpenDialog({
        filters: [
          { name: 'CSV files', extensions: ['csv'] }
        ],
        properties: ['openFile']
      }, file => {
        this.file.dialog.open = false;

        if (file) {
          let filePath = file[0];

          this.readFile(filePath);
        }
      });
    },

    readFile(filePath) {
      let singleFile = fs.readFileSync(filePath, 'utf-8');
      let parsed = Baby.parse(singleFile, {
        newline: '\n',
        header: true,
        // Checks type in column and converts to boolean or numeric if column value matches either
        dynamicTyping: true
      });
      
      this.file.path = filePath;
      this.file.parsed = {
        headerItems: parsed.meta.fields,
        bodyItems: parsed.data
      }
    },

    resetFile() {
      this.displayer.sort = {
        key: null,
        asc: true
      }

      this.displayer.selected = {
        row: null,
        column: null
      }
    }
  }
}