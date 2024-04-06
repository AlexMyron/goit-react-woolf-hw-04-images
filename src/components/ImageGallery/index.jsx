import ImageGalleryItem from 'components/ImageGalleryItem';
import { forwardRef } from 'react';

import css from './ImageGallery.module.css';

const ImageGallery = forwardRef((props, ref) => {
  return (
    <ul className={css.gallery} ref={ref}>
      {!!props.images.length &&
        props.images.map(image => <ImageGalleryItem key={image.id} item={image} handleImageClick={props.handleImageClick} />)}
    </ul>
  );
});

export default ImageGallery;
