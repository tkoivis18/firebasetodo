import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import AddBook from './AddBook';

import './App.css';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const [columnDefs] = useState([
    { field: 'title', suppressMovable: true },
    { field: 'author', suppressMovable: true },
    { field: 'year', suppressMovable: true },
    { field: 'isbn', suppressMovable: true },
    { field: 'price', suppressMovable: true },
  ]);

  const fetchItems = () => {
    fetch(
      'https://bookstore-e9ea7-default-rtdb.europe-west1.firebasedatabase.app/books/.json'
    )
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const addBook = (newBook) => {
    fetch(
      'https://bookstore-e9ea7-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
      {
        method: 'POST',
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(
      `https://bookstore-e9ea7-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: 'DELETE',
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div
        className="ag-theme-material"
        style={{ height: 400, width: 600, margin: 'auto' }}
      >
        <AgGridReact
          rowData={books}
          columnDefs={columnDefs}
          animateRows={true}
          suppressDragLeaveHidesColumns={true}
        />
      </div>
    </div>
  );
}

export default App;
