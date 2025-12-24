// import * as React from 'react';
// import { AppBar, IconButton, makeStyles, Toolbar } from '@material-ui/core';
// import { Menu as MenuIcon } from '@material-ui/icons';
// import { useDrawer } from './drawer-context';

// const useStyles = makeStyles((theme) => ({
//   toolbar: {
//     justifyContent: 'flex-end',
//   },
//   menuButton: {
//     // Push other menu elements to the right
//     marginRight: 'auto',
//     [theme.breakpoints.up('lg')]: {
//       display: 'none',
//     },
//   },
// }));

// function Navbar({ children }) {
//   const classes = useStyles();

//   const { onDrawerToggle } = useDrawer();

//   return (
//     <AppBar position="fixed">
//       <Toolbar className={classes.toolbar}>
//         <IconButton
//           color="inherit"
//           aria-label="open drawer"
//           edge="start"
//           onClick={onDrawerToggle}
//           className={classes.menuButton}
//         >
//           <MenuIcon />
//         </IconButton>
//         {children}
//       </Toolbar>
//     </AppBar>
//   );
// }

// export { Navbar };

import * as React from 'react';
import {
  AppBar,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  Box,
} from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useDrawer } from './drawer-context';
import { useAuth } from 'context/auth-context';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  center: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  welcomeText: {
    fontWeight: 500,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
  },
}));

function Navbar({ children }) {
  const classes = useStyles();
  const { onDrawerToggle } = useDrawer();
  const { user } = useAuth();

  const firstName = React.useMemo(() => {
    if (!user) return null;
    if (user.displayName) return user.displayName.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return 'Friend';
  }, [user]);

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        {/* LEFT */}
        <Box className={classes.left}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* CENTER */}
        <Box className={classes.center}>
          {user && (
            <Typography
              variant="subtitle1"
              className={classes.welcomeText}
            >
              Welcome back, {firstName}
            </Typography>
          )}
        </Box>

        {/* RIGHT */}
        <Box className={classes.right}>
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export { Navbar };
