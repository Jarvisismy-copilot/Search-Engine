import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../queries';
import { REMOVE_BOOK } from '../mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { data, loading, refetch } = useQuery(GET_ME, {
    skip: !Auth.loggedIn(), // Skip the query if the user is not logged in
  });
  
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId) => {
    if (!Auth.loggedIn()) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId } });
      removeBookId(bookId); // Remove from local storage
      refetch(); // Refresh the data from the server
    } catch (err) {
      console.error('Error removing book', err);
    }
  };

  // Show loading message if data is not yet fetched
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Return early if there's no user data
  if (!data || !data.me) {
    return <h2>Something went wrong!</h2>;
  }

  const savedBooks = data.me.savedBooks;

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {savedBooks.length
            ? `Viewing ${savedBooks.length} saved ${savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {savedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
