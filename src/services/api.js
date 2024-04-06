const KEY = '22046149-41a2515b5a783e6a5f4bfbfcc';
const PER_PAGE = 12;

  const fetchImages = async (query, page = 1) => {
  const url = `https://pixabay.com/api/?q=${query}&page=${page}&key=${KEY}&image_type=photo&orientation=horizontal&per_page=${PER_PAGE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Something went wrong. Try a bit later.');
  return await res.json();
};

export { PER_PAGE, fetchImages };
