import React, { useState, useEffect, useCallback } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';

import ImageListMaterial from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import { ImgItem } from '../../types';

const useStyles = makeStyles(() =>
  createStyles({
    imageList: {
      padding: 4,
      // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
      transform: 'translateZ(0)',
    },
    imageListItem: {
      '&:hover': {
        transition: '0.15s',
        transform: 'scale(1.02)',
        zIndex: 1,
        boxShadow: '5px 5px 15px rgba(0,0,0,0.4)',
        cursor: 'pointer',
      },
    },
    titleBar: {
      background:
        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
      color: 'white',
    },
  })
);

export default function ImageList() {
  const classes = useStyles();

  const [imgItems, setImgItems] = useState<Array<ImgItem>>([]);

  const handleShowItemInFolder = useCallback(
    (path) => window.api.send('show-item-in-folder', path),
    []
  );
  const handleDialogOpen = useCallback(
    (base64) => window.api.send('show-image-dialog', base64),
    []
  );

  useEffect(() => {
    window.api.receive(
      'image-items',
      (event: Electron.IpcRendererEvent, imgItems: Array<ImgItem>) => {
        setImgItems(imgItems);
      }
    );

    return function cleanup() {
      window.api.remove('image-items');
    };
  }, []);

  return (
    <ImageListMaterial className={classes.imageList} gap={1} cols={3}>
      {imgItems.map((imgItem) => (
        <ImageListItem
          className={classes.imageListItem}
          key={imgItem.path}
          rows={2}
          cols={1}
          onClick={() => handleDialogOpen(imgItem.base64)}
        >
          <img src={imgItem.base64} />
          <ImageListItemBar
            className={classes.titleBar}
            position="top"
            actionIcon={
              <>
                <IconButton
                  className={classes.icon}
                  onClick={() => handleShowItemInFolder(imgItem.path)}
                >
                  <FolderOpenIcon />
                </IconButton>
                <IconButton
                  className={classes.icon}
                  onClick={() => handleDialogOpen(imgItem.base64)}
                >
                  <OpenInNewIcon />
                </IconButton>
              </>
            }
          />
        </ImageListItem>
      ))}
    </ImageListMaterial>
  );
}
