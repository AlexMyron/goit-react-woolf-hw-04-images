import { Puff } from 'react-loader-spinner';

import css from './Loader.module.css';

const Loader = () => {
  return (
    <Puff
      visible={true}
      height="80"
      width="80"
      color="#3f51b5"
      ariaLabel="puff-loading"
      wrapperClass={css.loader}
    />
  );
};

export default Loader;
