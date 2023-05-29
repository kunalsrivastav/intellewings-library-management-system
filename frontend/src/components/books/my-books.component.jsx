import React, { useState, useEffect, useContext } from 'react';
import './books.css';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarContext } from '../../App';
import { getRequest, deleteRequest } from "../../api-service";
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import ModeIcon from '@mui/icons-material/Mode';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

const noCoverURI = 'https://storage.googleapis.com/library-mgmt-system-intelle.appspot.com/no-cover.png';

const MyBooks = () => {

    const [books, setBooks] = useState([]);
    const [loader, setLoader] = useState(true);
    const { snack, setSnack } = useContext(SnackbarContext);
    const [open, setOpen] = useState(false);
    const [bookInfo, setBookInfo] = useState({});
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    const handleDialogClose = () => {
        setOpen(false);
        setBookInfo({});
        setDeleteConfirmationText('');
    }

    const loadBooks = async (flag) => {
        try {
            const response = await getRequest('/api/books/mybooks/');
            const data = response?.data;
            setBooks(data);
            setLoader(false);
            !flag && setSnack({ ...snack, message: 'Books Loaded!', open: true, severity: 'success' });
        } catch (error) {
            setLoader(false);
            setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
        };
    }

    useEffect(() => {
        loadBooks();
    }, []);

    const handleDeleteBook = async (bookId) => {
        handleDialogClose();
        setLoader(true);
        try {
            const response = await deleteRequest('/api/books/delete/', { book_id: bookId });
            const data = response?.data;
            loadBooks(true);
            setSnack({ ...snack, message: data?.message, open: true, severity: 'success' });
        } catch (error) {
            setLoader(false);
            setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
        };
    }

    return (
        <div className='books'>
            <h1>My Books</h1>
            {
                loader
                ? <CircularProgress />
                : <div>
                    <div className="books-info">
                        {
                            books?.map((book) => {
                                return <div className="book-card" key={book?.book_id}>
                                    <img src={book?.cover_image || noCoverURI} alt="cover-image" />
                                    <p title={'Title: ' + book?.title} ><ModeIcon /> <span>{book?.title}</span></p>
                                    <p title={'Author: ' + book?.author} ><PersonIcon /> <span>{book?.author}</span></p>
                                    <p title={'Category: ' + book?.category_name} ><CategoryIcon /> <span>{book?.category_name}</span></p>
                                    <p title={'Description: ' + book?.description} className="desc"><DescriptionIcon /> <span>{book?.description}</span></p>
                                    <button onClick={() => {setBookInfo(book); setOpen(true);}}>Delete this book</button>
                                </div>
                            })
                        }
                        { !books?.length && <span>You haven't Added a book yet!</span> }
                    </div>
                </div>
            }
            <Dialog className='confirm-box' open={open} onClose={handleDialogClose}>
                <DialogTitle>Delete Book: {bookInfo?.title}</DialogTitle>
                <div className='info'>
                    <p>To delete the book, write <span>delete</span> in below input box.</p>
                    <input value={deleteConfirmationText} placeholder='delete' onChange={(event) => setDeleteConfirmationText(event?.target?.value)} />
                </div>
                <DialogActions>
                    <button className='cancel' onClick={handleDialogClose}>Cancel</button>
                    { (deleteConfirmationText === 'delete') && <button className='confirm' onClick={() => handleDeleteBook(bookInfo?.book_id)}>Delete</button> }
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default MyBooks;