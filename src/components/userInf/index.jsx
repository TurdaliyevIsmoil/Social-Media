import { useState, useRef } from 'react';
import Moment from 'react-moment';
import './style.scss';

export default function UserInf({ user }) {
    console.log(user)
    return (<div className='user-information'>
        <div className="title">
            <h2 className="name">{user.name}</h2>
            <div className="last-seen">{user.isOnline === true ? "online" : <Moment fromNow>{user.isOnline.toDate()}</Moment>}</div>
        </div>
    </div>);
}
