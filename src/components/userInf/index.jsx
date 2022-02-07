import { useState, useRef } from 'react';
import Moment from 'react-moment';
import './style.scss';

export default function UserInf({ user, toggle }) {
    return (<div className='user-information'>
        <div className="title">
            <div className="name">{user.name}</div>
            <div className="last-seen">{user.isOnline === true ? "online" : <Moment fromNow>{user.isOnline.toDate()}</Moment>}</div>
        </div>
        <div className="toggle">
            <img width='25px' onClick={toggle} src="https://img.icons8.com/ios-filled/50/ffffff/menu--v1.png" />
        </div>
    </div>);
}
