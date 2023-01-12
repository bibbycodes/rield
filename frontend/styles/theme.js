const {createTheme} = require("@mui/material");
const theme = {
  tPrimary: '#FFFFFF',
  tSecondary: '#9597A0',
  backgroundPrimary: '#1F2027',
  backgroundSecondary: '#282930',
  accentPrimary: '#4A77F6',
  accentSecondary: '#3459C5',
}

const muiTheme = createTheme(
  {
    typography: {
      fontFamily: [
        'rld',
      ].join(','),
    },
  },
);


module.exports = {theme, muiTheme}

