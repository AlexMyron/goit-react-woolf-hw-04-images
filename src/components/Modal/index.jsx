import { Component, createRef } from 'react';
import css from './Modal.module.css';

export default class Modal extends Component {
  state = {
    isLoading: true,
  };
  overlayRef = createRef();

  componentDidMount = () =>
    window.addEventListener('keydown', this.handleKeyEvent);

  componentDidUpdate = (_, prevState) => {
    if (prevState.isLoading) this.props.handleLoader();
  };

  componentWillUnmount = () =>
    window.removeEventListener('keydown', this.handleKeyEvent);

  handleKeyEvent = ({ key }) =>
    key === 'Escape' && this.props.handleCloseModal();

  handleClose = ({ target }) =>
    target === this.overlayRef.current && this.props.handleCloseModal();

  handleImageLoaded = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const { imageUrl, alt } = this.props;
    return (
      <div
        className={css.overlay}
        onClick={this.handleClose}
        ref={this.overlayRef}
      >
        <div className={css.modal}>
          <img
            src={imageUrl}
            alt={alt}
            onLoad={this.handleImageLoaded}
            onError={this.handleImageLoaded}
          />
        </div>
      </div>
    );
  }
}
