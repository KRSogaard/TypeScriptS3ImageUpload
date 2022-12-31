import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Header from './Header';
import axios from 'axios';
import FormData from 'form-data'

function Home() {

  // Create a reference to the file input element
  const fileInput = React.useRef<HTMLInputElement>(null);

  // Create a function to handle the file upload
  const handleUpload = () => {
    // Get the file from the file input element
    const file = fileInput.current!.files![0];

    // Create a FileReader to read the file contents
    const reader = new FileReader();

    // Set up an event handler to be called when the file has been read
    reader.onload = (event) => {
      // Get the file contents from the event
      const fileContents = event.target!.result;

      let data = new FormData();
      data.append('file', file, file.name);

      // Send the file contents to the API in an HTTP request
      axios.post("http://localhost:3080/api/upload", data, {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${data.getBoundary}`,
        }
      })
        .then(response => {
          console.info(response);
        })
        .catch(error => {
          console.error(error);
        });
    };

    // Read the file contents
    reader.readAsBinaryString(file);
  };

  return (
    <div className="App">
      <Header></Header>
      <h1>Hello</h1>

      <input type="file" ref={fileInput} />
      <button onClick={() => handleUpload()}>UPLOAD</button>
  </div>
  );
}

export default Home;
