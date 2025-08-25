import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  palette: {
    primary: { main: "#e9456f" },
    secondary: { main: "#eceff1", dark: "#09f" },
  },
});

export default theme;