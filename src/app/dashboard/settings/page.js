'use client'
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { logout } from '@/lib/store';

export default function Settings() {
    const router = useRouter();
    const { userDetails } = useSelector((state) => state.user);

    const [currentUser, setCurrentUser] = useState({});

    const logoutUser = () => {
        logout();
        toast.error('Logout successfully.');
        router.push('/');
    }
    useLayoutEffect(() => {
        const details = JSON.parse(userDetails);
        console.log("@@@@@@ USER: ", details);
        if((details !== null) && (details !== undefined)){
            setCurrentUser(details?.user);
        }
    }, [userDetails])
    return (
        <div className="card mb-4">
            <h5 className="card-header">Settings</h5>
            <div className="card-body">
                <div className="d-flex align-items-start align-items-sm-center gap-4">
                    <i className='bx bx-user menu-icon menu-icon-profile'></i>
                    <div className="button-wrapper">
                        <h5 className="card-title">{currentUser?.firstName + ' ' + currentUser?.lastName}</h5>
                        <h6 className="card-subtitle text-muted mb-4">{currentUser?.email}</h6>
                        <button onClick={(e) => { logoutUser() }} type="button" className="btn btn-green mb-4">
                            <i className="bx bx-reset d-block d-sm-none"></i>
                            <span className="d-none d-sm-block">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}