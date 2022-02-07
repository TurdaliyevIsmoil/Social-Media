import React from 'react';
import './style.scss';

const ImageModal = ({children, open, close}) => {
    return (
        <div className={`image-modal flex-center ${open ? 'open' : 'close'}`} onClick={close}>
            {children}
        </div>
    );
}

export default ImageModal;

