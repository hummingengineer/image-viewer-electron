import React, { useState, useEffect, useCallback } from 'react';

import DialogMaterial from '@material-ui/core/Dialog';

export default function Dialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [img, setImg] = useState('');

  const handleDialogClose = useCallback(() => setIsDialogOpen(false), []);

  useEffect(() => {
    window.api.receive('dialog-image', (event: Electron.IpcRendererEvent, base64: string) => {
      setImg(base64);
      setIsDialogOpen(true);
    });

    return function cleanup() {
      window.api.remove('dialog-image');
    };
  }, []);

  return (
    <DialogMaterial open={isDialogOpen} onClose={handleDialogClose} maxWidth="lg">
      {/* DialogMaterial uses 32px as margin */}
      <img
        src={img}
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 64px)' }}
        onClick={handleDialogClose}
      />
    </DialogMaterial>
  );
}
