'use strict';

const fs = require('fs');
const {remote} = require('electron');
const {Menu, MenuItem} = remote;

module.exports = {
  template: fs.readFileSync(__dirname + '/fileContentDisplayer.html', 'utf-8'),

  data() {
    return require('../../store')
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.displayer.menu = new Menu();

      this.displayer.menu.append(
        new MenuItem({
          label: 'Copy',

          click: this.copyTextToClipboard
        })
      );

      // Global keylistener
      window.addEventListener('keydown', event => {
        // If CMD + C or CTRL + C and column selected
        if (
          (event.keyCode === 67 && (event.metaKey || event.ctrlKey)) &&
          (this.displayer.selected.row && this.displayer.selected.column)
        ) {
          this.copyTextToClipboard();
        }
      });
    },

    sortBy(headerItem) {
      if (this.displayer.sort.key === headerItem) {
        this.displayer.sort.asc = !this.displayer.sort.asc;
      } else {
        // reset order if new key is chosen
        this.displayer.sort.asc = true;
      }

      this.displayer.sort.key = headerItem;

      this.file.parsed.bodyItems.sort((a, b) => {
        if (a[this.displayer.sort.key] < b[this.displayer.sort.key])
          return this.displayer.sort.asc ? -1 : 1;
        if (a[this.displayer.sort.key] > b[this.displayer.sort.key])
          return this.displayer.sort.asc ? 1 : -1;
        return 0;
      });
    },

    selectColumn(rowIndex, columnIndex) {
      this.displayer.selected.row = rowIndex;
      this.displayer.selected.column = columnIndex;
    },

    isActiveColumn(rowIndex, columnIndex) {
      return (this.displayer.selected.row === rowIndex && this.displayer.selected.column === columnIndex);
    },

    rightClick(rowIndex, columnIndex) {
      if (this.isActiveColumn(rowIndex, columnIndex)) {
        this.displayer.menu.popup(remote.getCurrentWindow());
      }
    },

    // Credits: http://stackoverflow.com/a/30810322
    copyTextToClipboard() {
      let text = this.file.parsed.bodyItems[this.displayer.selected.row][this.displayer.selected.column];
      var textArea = document.createElement("textarea");

      //
      // *** This styling is an extra step which is likely not required. ***
      //
      // Why is it here? To ensure:
      // 1. the element is able to have focus and selection.
      // 2. if element was to flash render it has minimal visual impact.
      // 3. less flakyness with selection and copying which **might** occur if
      //    the textarea element is not visible.
      //
      // The likelihood is the element won't even render, not even a flash,
      // so some of these are just precautions. However in IE the element
      // is visible whilst the popup box asking the user for permission for
      // the web page to copy to the clipboard.
      //

      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textArea.style.width = '2em';
      textArea.style.height = '2em';

      // We don't need padding, reducing the size if it does flash render.
      textArea.style.padding = 0;

      // Clean up any borders.
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textArea.style.background = 'transparent';


      textArea.value = text;

      document.body.appendChild(textArea);

      textArea.select();

      try {
        document.execCommand('copy');
      } catch (err) {
        alert('Copy failed.');
      }

      document.body.removeChild(textArea);
    }
  }
}