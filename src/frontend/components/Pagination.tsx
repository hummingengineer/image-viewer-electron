import React, { useState, useEffect, useCallback } from 'react';

import Grid from '@material-ui/core/Grid';
import PaginationMaterial from '@material-ui/lab/Pagination';

export default function Pagination() {
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [page, setPage] = useState(1);

  const handlePage = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    window.api.send('page-changed', value);
    setPage(value);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.api.receive(
      'total-page-count',
      (event: Electron.IpcRendererEvent, totalPageCount: number) => {
        window.api.send('page-changed', 1);
        setTotalPageCount(totalPageCount);
      }
    );

    return function cleanup() {
      window.api.remove('total-page-count');
    };
  }, []);

  return (
    <>
      {totalPageCount !== 0 && (
        <Grid container justifyContent="center">
          <PaginationMaterial
            count={totalPageCount}
            page={page}
            size="large"
            color="primary"
            onChange={handlePage}
          />
        </Grid>
      )}
    </>
  );
}
