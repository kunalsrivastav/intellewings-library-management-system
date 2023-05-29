import React, { useEffect, useState, useContext } from 'react';
import './books.css';
import { getRequest, postRequest } from '../../api-service';
import { SnackbarContext } from '../../App';
import { CircularProgress } from '@mui/material';

const CreateBook = () => {

    const [loader, setLoader] = useState(true);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [formData, setFormData] = useState({ title: '', author: '', description: '', category: '' });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const { snack, setSnack } = useContext(SnackbarContext);

    useEffect(() => {
        (async () => {
            try {
                const response = await getRequest('/api/books/categories');
                const data = response?.data;
                setCategoryOptions(data);
                setLoader(false);
                setFormData({ ...formData, category: data[0]?.category_name });
                setSnack({ ...snack, message: 'Category data Loaded!', open: true, severity: 'success' });
            } catch (error) {
                setLoader(false);
                setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
            };
        })();
    }, []);

    const handleAddBook = async () => {
        try {
            setLoader(true);
            const tempFormData = new FormData();
            Object.entries(formData)?.map(([key, value]) => {
                tempFormData.append(key, value);
            })
            tempFormData.append('cover_photo', selectedPhoto);
            const response = await postRequest('/api/books/create', tempFormData);
            const data = response?.data;
            setFormData({ title: '', author: '', description: '', category: '' });
            setLoader(false);
            setSnack({ ...snack, message: data?.message, open: true, severity: 'success' });
        } catch (error) {
            setLoader(false);
            setSnack({ ...snack, message: error?.response?.data?.error, open: true, severity: 'error' });
        };
    }

    return (
        <div className='books'>
            <h1>Add new book to Library!</h1>
            {
                loader
                ? <CircularProgress />
                : <div className='add-book-wrapper'>
                    <div>
                        <div>
                            <label>Enter title</label>
                            <input value={formData?.title} onChange={(event) => setFormData({ ...formData, title: event?.target?.value })}/>
                        </div>
                        <div>
                            <label>Enter Author</label>
                            <input value={formData?.author} onChange={(event) => setFormData({ ...formData, author: event?.target?.value })}/>
                        </div>
                        <div>
                            <label>Select Category</label>
                            <select onChange={(event) => setFormData({ ...formData, category: event?.target?.value })}>
                                {
                                    categoryOptions?.map((category) => {
                                        return <option key={category?.category_id} value={category?.category_name}>{category?.category_name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div>
                            <label>Enter Description</label>
                            <textarea value={formData?.description} onChange={(event) => setFormData({ ...formData, description: event?.target?.value })}/>
                        </div>
                    </div>
                    <div>
                        <label>Add Cover Image</label>
                        <div className='upload-area'>
                            <input type='file' accept="image/jpeg, image/png" onChange={(event) => setSelectedPhoto(event?.target?.files[0])}/>
                        </div>
                    </div>
                    <button onClick={handleAddBook}>Add Book</button>
                </div>
            }
        </div>
    )
};

export default CreateBook;