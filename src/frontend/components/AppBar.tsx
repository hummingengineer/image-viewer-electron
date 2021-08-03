import React, { useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

import AppBarMaterial from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MinimizeIcon from '@material-ui/icons/Minimize';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      WebkitAppRegion: 'drag',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    title: {
      WebkitUserSelect: 'none',
    },
    sectionDesktop: {
      WebkitAppRegion: 'no-drag',
      display: 'flex',
    },
  })
);

export default function AppBar() {
  const classes = useStyles();

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleAppMinimize = useCallback(() => window.api.send('minimize-app'), []);
  const handleAppMaximizeUnmaximize = useCallback(
    () => window.api.send('maximize-unmaximize-app'),
    []
  );
  const handleAppClose = useCallback(() => window.api.send('close-app'), []);

  useEffect(() => {
    window.api.receive('app-maximized', () => {
      setIsFullScreen(true);
    });
    window.api.receive('app-unmaximized', () => {
      setIsFullScreen(false);
    });

    return function cleanup() {
      window.api.remove('app-maximized');
      window.api.remove('app-unmaximized');
    };
  }, []);

  return (
    <AppBarMaterial position="fixed" className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title} variant="h6" noWrap>
          Image Viewer
        </Typography>
        <div className={classes.sectionDesktop}>
          <IconButton color="inherit" edge="end" onClick={handleAppMinimize}>
            <MinimizeIcon />
          </IconButton>
          <IconButton color="inherit" edge="end" onClick={handleAppMaximizeUnmaximize}>
            {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton color="inherit" edge="end" onClick={handleAppClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBarMaterial>
  );
}
