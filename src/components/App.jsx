import { Component, createRef } from 'react';

import { fetchImages, PER_PAGE } from '../services/api';

import ImageGallery from './ImageGallery';
import SearchBar from './Searchbar';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';

export class App extends Component {
  state = {
    query: '',
    page: 1,
    totalHits: null,
    images: [],
    isLoading: false,
    largeImageUrl: null,
  };

  galleryRef = createRef();

  componentDidUpdate = async (_, prevState) => {
    const { query, page } = this.state;
    if (!query) return;

    if (query !== prevState.query || page !== prevState.page) {
      try {
        this.setState({ isLoading: true });
        const imagesData = await fetchImages(query, page);

        this.setState(prev => {
          const updatedImages =
            page === 1 ? imagesData.hits : [...prev.images, ...imagesData.hits];

          return {
            ...prev,
            totalHits: imagesData.totalHits,
            images: updatedImages,
          };
        });

        page > 1 && this.scrollDown();
      } catch (err) {
        console.error(err.message);
      } finally {
        setTimeout(() => this.setState({ isLoading: false }), 300);
      }
    }
  };

  handleSearch = e => {
    e.preventDefault();
    this.setState({ query: e.target.elements.search.value, page: 1 });
  };

  handleLoadMore = () => this.setState(({ page }) => ({ page: (page += 1) }));

  handleImageClick = url => this.setState({ largeImageUrl: url, isLoading: true });

  handleCloseModal = () => this.setState({ largeImageUrl: null });

  handleLoader = () => this.setState({isLoading: false});

  scrollDown = () => {
    setTimeout(() => {
      const { clientHeight } = this.galleryRef.current.firstElementChild;

      window.scrollBy({
        top: clientHeight * 2,
        behavior: 'smooth',
      });
    }, 0);
  };

  render() {
    const { query, images, totalHits, page, isLoading, largeImageUrl } = this.state;
    const isLastPage = Math.ceil(totalHits / PER_PAGE) === page;
    const isShowButton = !!images.length && !isLastPage;

    return (
      <section className="app">
        <SearchBar onSubmit={this.handleSearch} />
        {!!totalHits && <ImageGallery
          images={images}
          ref={this.galleryRef}
          handleImageClick={this.handleImageClick}
        />}
        {isShowButton && <Button onClick={this.handleLoadMore} />}
        {isLoading && <Loader />}
        {largeImageUrl && (
          <Modal
            imageUrl={largeImageUrl}
            alt={query}
            handleCloseModal={this.handleCloseModal}
            handleLoader={this.handleLoader}
          />
        )}
      </section>
    );
  }
}
