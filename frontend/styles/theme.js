const {createTheme} = require("@mui/material");
// const theme = {
//   tPrimary: '#FFFFFF',
//   tSecondary: '#9597A0',
//   backgroundPrimary: '#1F2027',
//   backgroundSecondary: '#282930',
//   accentPrimary: '#4A77F6',
//   accentSecondary: '#3459C5',
// }

const theme = {
  tPrimary: '#FFFFFF',
  tSecondary: '#9597A0',
  backgroundSecondary: '#37373d',
  backgroundPrimary: '#2c2c2e',
  accentPrimary: '#607EDE',
  accentSecondary: '#7a92df',
}

const muiTheme = createTheme(
  {
    typography: {
      fontFamily: [
        'rld',
      ].join(','),
    },
    palette: {
      primary: {
        main: theme.tPrimary
      },
      secondary: {
        main: theme.tPrimary
      },
      background: {
        default: theme.backgroundPrimary,
        paper: theme.backgroundSecondary
      },
      text: {
        primary: theme.tPrimary,
        secondary: theme.tSecondary
      }
    }
  },
);


module.exports = {theme, muiTheme}

