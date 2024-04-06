import { useRef, useEffect } from 'react';
import css from './Modal.module.css';

const Modal = ({ handleLoader, handleCloseModal, imageUrl, alt }) => {
  const overlayRef = useRef();

  useEffect(() => {
    const handleKeyEvent = event =>
      event.key === 'Escape' && handleCloseModal();

    window.addEventListener('keydown', handleKeyEvent);
    console.log('-0- mounted -0-');

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      console.log('-0- cleanup -0-');
    };
  }, [handleCloseModal]);

  const handleClose = ({ target }) => {
    if (target === overlayRef.current) {
      handleCloseModal();
    }
  };

  const handleImageLoaded = () => handleLoader(false);

  return (
    <div className={css.overlay} onClick={handleClose} ref={overlayRef}>
      <div className={css.modal}>
        <img
          src={imageUrl}
          alt={alt}
          onLoad={handleImageLoaded}
          onError={handleImageLoaded}
        />
      </div>
    </div>
  );
};

export default Modal;
