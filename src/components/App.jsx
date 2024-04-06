import { useRef, useCallback, useEffect, useState } from 'react';

import { fetchImages, PER_PAGE } from '../services/api';

import ImageGallery from './ImageGallery';
import SearchBar from './Searchbar';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [largeImageUrl, setLargeImageUrl] = useState(null);
  const galleryRef = useRef();

  const isLastPage = Math.ceil(totalHits / PER_PAGE) === page;
  const isShowButton = !!images.length && !isLastPage;

  const handleSearch = e => {
    e.preventDefault();
    setQuery(e.target.elements.search.value);
    setPage(1);
  };

  const handleLoadMore = () => setPage(page => page + 1);

  const handleImageClick = url => {
    setLargeImageUrl(url);
    setIsloading(true);
  };

  const handleCloseModal = useCallback(() => setLargeImageUrl(null), []);

  const handleLoader = useCallback(isLoading => {
    setIsloading(isLoading);
  }, []);

  const scrollDown = useCallback(() => {
    setTimeout(() => {
      if (!galleryRef.current) return;
      const { clientHeight } = galleryRef.current.firstElementChild;

      window.scrollBy({
        top: clientHeight * 2,
        behavior: 'smooth',
      });
    }, 0);
  }, [galleryRef]);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setIsloading(true);
        const imagesData = await fetchImages(query, page);

        setTotalHits(imagesData.totalHits);
        setImages(prevImages =>
          page === 1 ? imagesData.hits : [...prevImages, ...imagesData.hits]
        );

        page > 1 && scrollDown();
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, [query, page, scrollDown]);

  return (
    <section className="app">
      <SearchBar onSubmit={handleSearch} />
      {!!totalHits && (
        <ImageGallery
          images={images}
          ref={galleryRef}
          handleImageClick={handleImageClick}
        />
      )}
      {isShowButton && <Button onClick={handleLoadMore} />}
      {isLoading && <Loader />}
      {largeImageUrl && (
        <Modal
          imageUrl={largeImageUrl}
          alt={query}
          handleCloseModal={handleCloseModal}
          handleLoader={handleLoader}
        />
      )}
    </section>
  );
};
