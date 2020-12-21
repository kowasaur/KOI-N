const { shell } = require("electron")
// Modified from here: https://stackoverflow.com/a/62171641/14746108
document.body.addEventListener('click', event => {
  if (event.target.tagName.toLowerCase() === 'a' && event.target.protocol != 'file:') {
    event.preventDefault();
    shell.openExternal(event.target.href);
  }
});