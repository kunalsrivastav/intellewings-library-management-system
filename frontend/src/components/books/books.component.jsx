import React, { useEffect, useState, useContext } from "react";
import './books.css';
import CircularProgress from '@mui/material/CircularProgress';
import { SnackbarContext } from '../../App';
import { getRequest } from "../../api-service";
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import ModeIcon from '@mui/icons-material/Mode';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

const noCoverURI = 'https://storage.googleapis.com/library-mgmt-system-intelle.appspot.com/no-cover.png';

const Books = () => {

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [open, setOpen] = useState(false);
    const [bookInfo, setBookInfo] = useState({});
    const { snack, setSnack } = useContext(SnackbarContext);

    const handleDialogClose = () => {
        setOpen(false);
        setBookInfo({});
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await getRequest('/api/books/all/');
                const data = response?.data;
                setBooks(data);
                setFilteredBooks(data);
                setLoader(false);
                setSnack({ ...snack, message: 'Books Loaded!', open: true, severity: 'success' });
            } catch (error) {
                setLoader(false);
                setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
            };
        })();
    }, []);

    const handleSearch = () => {
        if (searchValue?.length) {
            let tempData = [];
            books?.map((item) => {
                if (item?.title?.toLowerCase()?.includes(searchValue) || item?.author?.toLowerCase()?.includes(searchValue) || item?.category_name?.toLowerCase()?.includes(searchValue)) {
                    tempData.push(item);
                }
            });
            setFilteredBooks(tempData);
        } else {
            setFilteredBooks(books);
        }
    };

    return (
        <div className="books">
            <h1>Available Books</h1>
            {
                loader
                ? <CircularProgress />
                : <div>
                    <div className="search-wrapper">
                        <input value={searchValue} placeholder="book/author/category name" onChange={(event) => setSearchValue(event?.target?.value?.toLowerCase())}/>
                        <button onClick={handleSearch}>Search</button>
                    </div>
                    <div className="books-info">
                        {
                            filteredBooks?.map((book) => {
                                return <div className="book-card clickable" key={book?.book_id} onClick={() => {setBookInfo(book); setOpen(true); }}>
                                    <img src={book?.cover_image || noCoverURI} alt="cover-image" />
                                    <p title={'Title: ' + book?.title} ><ModeIcon /> <span>{book?.title}</span></p>
                                    <p title={'Author: ' + book?.author} ><PersonIcon /> <span>{book?.author}</span></p>
                                    <p title={'Category: ' + book?.category_name} ><CategoryIcon /> <span>{book?.category_name}</span></p>
                                    <p title={'Description: ' + book?.description} className="desc"><DescriptionIcon /> <span>{book?.description}</span></p>
                                </div>
                            })
                        }
                        {
                            !books?.length
                            ? <span>No Book Found!</span>
                            : !filteredBooks?.length && <span>No search Found!</span> 
                        }
                    </div>
                </div>
            }
            <Dialog className='view-book-box' open={open} onClose={handleDialogClose}>
                <DialogTitle>{bookInfo?.title}</DialogTitle>
                <div className='book-info'>
                    <div className="img-box">
                        <img src={bookInfo?.cover_image || noCoverURI} alt="cover-image" />
                    </div>
                    <p><strong>Author: </strong><span>{bookInfo?.author || 'NA'}</span></p>
                    <p><strong>Category: </strong><span>{bookInfo?.category_name || 'NA'}</span></p>
                    <p><strong>Description: </strong><span>{bookInfo?.description || 'NA'}</span></p>
                    <p><strong>Added By: </strong><span>{bookInfo?.added_by || 'NA'}</span></p>
                </div>
                <DialogActions>
                    <button className='cancel' onClick={handleDialogClose}>Close</button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default Books;