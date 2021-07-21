import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import AppBar from './components/AppBar';
import SpeedDial from './components/SpeedDial';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    offset: theme.mixins.toolbar,
  })
);

export default function App() {
  const classes = useStyles();

  return (
    <>
      <AppBar />
      <div className={classes.offset} />
      <SpeedDial />
    </>
  );
}
