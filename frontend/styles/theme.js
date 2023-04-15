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
  backgroundSecondary: '#262640',
  backgroundPrimary: '#0E121D',
  backgroundPrimaryGradient: '#262640',
  backgroundSecondaryGradient: '#262645',
  accentPrimary: '#6F47EF',
  accentPrimaryGradient: '#6F47DA',
  accentSecondary: '#7c57e8',
  accentSecondaryGradient: '#7e5ddc',
  navGray: '#121528',
  navGrayGradient: '#0d1221',
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

