import css from './ImageGalleryItem.module.css';

const ImageGalleryItem = ({ item, handleImageClick }) => {
  return (
    <li className={css['gallery-item']} onClick={() => handleImageClick(item.largeImageURL)}>
      <img className={css['gallery-image']} src={item.webformatURL} alt={item.tags} />
    </li>
  );
};

export default ImageGalleryItem;
