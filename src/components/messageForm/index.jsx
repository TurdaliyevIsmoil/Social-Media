import { useState, useRef } from 'react';
import './style.scss';

export default function MessageForm({value, setvalue, handleSubmit, setimg}) {
    const [selectedFile, setselectedFile] = useState(false);
    function selectFileHandler(e){
        setimg(e.target.files[0]);
        setselectedFile(true)
    }
    function submitHandler(e){
        e.preventDefault();
        handleSubmit()
        setselectedFile(false)
    }
    return (<form className='message-form' autoComplete='off' onSubmit={submitHandler}>
        <label className=''>
        <img className='uploader' src={`https://img.icons8.com/external-kiranshastry-lineal-kiranshastry/64/${selectedFile ? 'ff6913' : 'ffffff'}/external-link-multimedia-kiranshastry-lineal-kiranshastry.png`}/>

        <input type="file" accept='image/*' style={{display: 'none'}} onChange={selectFileHandler} />
        </label>
        <input type="text" value={value} className="form-control" placeholder='Typing...' name="text" onChange={e=>setvalue(e.target.value)} />
        <button type='submit'><img  src="https://img.icons8.com/material-sharp/48/ffffff/sent.png"/></button>
    </form>);
}
