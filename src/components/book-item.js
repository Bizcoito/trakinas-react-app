import React from 'react';
import BookActionButton from './book-action-button';

const BookItem = ({ book }) => {
  return (
    <div className="list-group-item media row">
      <div className="media-left book-thumbnail">
        <img className="media-object" src={book.thumbnail} alt="book cover" />
      </div>
      <div className="media-body">
        <div className="media-heading">
          <h4>{book.name}</h4>
          <p>{book.description}</p>
          <div><BookActionButton book={book} /></div>
        </div>
      </div>
    </div>
  );
};

export default BookItem;
