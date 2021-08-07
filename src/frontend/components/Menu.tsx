import React, { useState, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

import IconButton from '@material-ui/core/IconButton';
import MenuMaterial from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      color: 'white',
    },
  })
);

function Menu({ path }: { path: string }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => setAnchorEl(null), []);
  const handleShowItemInFolder = useCallback(
    (path) => window.api.send('show-item-in-folder', path),
    []
  );
  const handleOpenInNew = useCallback((path) => window.api.send('open-in-new', path), []);

  return (
    <>
      <IconButton className={classes.icon} onMouseEnter={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <MenuMaterial
        id="more-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          onMouseLeave: handleMenuClose,
        }}
      >
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleMenuClose();
            handleShowItemInFolder(path);
          }}
        >
          <FolderOpenIcon />
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleMenuClose();
            handleOpenInNew(path);
          }}
        >
          <OpenInNewIcon />
        </MenuItem>
      </MenuMaterial>
    </>
  );
}

export default React.memo(Menu);
