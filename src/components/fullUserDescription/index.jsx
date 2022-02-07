import { useState, useRef } from 'react';
import './style.scss';
import img from '../../images/none-user.webp';
import ImageModal from '../imageModal';

export default function FullUserDescrition({ user, toggleUser }) {
    const [image, setimage] = useState(false);
    const [copy, setcopy] = useState(false);

    const toggle = () => { setimage(!image) }

    return (<div className='user-description'>
        <div className="img-overlay"
            style={{ background: `url(${user.img ? user.img : img}` }}
        >
            {user.img && <div className="overlay flex-center" onClick={toggle}><img src="https://img.icons8.com/ios-filled/50/ffffff/plus.png" /></div>}
        </div>
        <div className="title">
            <div className="name">{user.name}</div>
            <div className="email">{user.email}</div>
            <div className="email"><small>joined in {user.createdAt.toDate().toDateString()}</small></div>
        </div>
        <div className="social-media">
            <a href={`tel:${user.phone}`} className="call">
                <img src="https://img.icons8.com/glyph-neue/64/020b11/phone.png" />
            </a>
            <a href={`mailto:${user.email}`} className="call">
                <img src="https://img.icons8.com/external-tal-revivo-bold-tal-revivo/24/020b11/external-gmail-is-a-free-email-service-developed-by-google-logo-bold-tal-revivo.png" />
            </a>
            <a className={`call ${copy ? 'copied' : ''}`} onClick={async () => {
                navigator.clipboard.writeText("Example.com\nSafely messenger!");
                setcopy(true)
            }}>
                <img src="https://img.icons8.com/ios-glyphs/60/020b11/share--v1.png" />
            </a>
        </div>
        <div className="btn" onClick={toggleUser}>Close</div>
        <ImageModal close={toggle} open={image}><img src={user.img || null}/></ImageModal>
    </div>);
}
