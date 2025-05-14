import React, { useRef, useState } from 'react';
import './ImageInput.css';

export default function ImageInput({ name, id, onImageLoad, resetTrigger }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageLoad(true);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageLoad(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        fileInputRef.current.files = event.dataTransfer.files;
        onImageLoad(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  React.useEffect(() => {
  if (resetTrigger) {
    setPreview(null);
    fileInputRef.current.value = null; 
  }
  }, [resetTrigger]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div >
      <input
        type="file"
        accept="image/*"
        name={name}
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div
        className="drop-zone"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div>
            <img src="/iconUpload.png" className="img" alt="Icône upload" />   
            <p className="drop-text">Glissez-déposez votre image ici</p>
            <p className="or-text">ou</p>
            <div className="upload-button">Choisir un fichier depuis votre appareil</div>
          </div>
        )}
      </div>
    </div>
  );
}