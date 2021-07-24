import React from 'react';

import ImageList from './ImageList';
import Pagination from './Pagination';
import Dialog from './Dialog';

export default function Content() {
  return (
    <>
      <ImageList />
      <Pagination />
      <Dialog />
    </>
  );
}
