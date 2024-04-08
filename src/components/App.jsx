import { useRef, useCallback, useEffect, useState } from 'react';

import { fetchImages, PER_PAGE } from '../services/api';
import { scrollSmoothlyTo } from 'services/helpers';

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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
  };

  const handleCloseModal = useCallback(() => setLargeImageUrl(null), []);

  const handleLoader = useCallback(isLoading => {
    setIsLoading(isLoading);
  }, []);

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const imagesData = await fetchImages(query, page);

        setTotalHits(imagesData.totalHits);
        setImages(prevImages =>
          page === 1 ? imagesData.hits : [...prevImages, ...imagesData.hits]
        );

        scrollSmoothlyTo({ isToTop: page === 1, ref: galleryRef });
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query, page]);

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
