import React, { useState, useCallback } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import Zoom from '@material-ui/core/Zoom';
import SpeedDialMaterial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);

const actions = [{ name: 'Open', icon: <FolderOpenIcon />, channel: 'open-folder' }];

export default function SpeedDial() {
  const classes = useStyles();

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

  const handleSpeedDialOpen = useCallback(() => setIsSpeedDialOpen(true), []);
  const handleSpeedDialClose = useCallback(() => setIsSpeedDialOpen(false), []);
  const handleSpeedDialAction = useCallback((channel) => window.api.send(channel), []);

  return (
    <Zoom unmountOnExit in>
      <SpeedDialMaterial
        ariaLabel="SpeedDial"
        className={classes.speedDial}
        direction="up"
        icon={<SpeedDialIcon />}
        open={isSpeedDialOpen}
        onOpen={handleSpeedDialOpen}
        onClose={handleSpeedDialClose}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => handleSpeedDialAction(action.channel)}
          />
        ))}
      </SpeedDialMaterial>
    </Zoom>
  );
}
