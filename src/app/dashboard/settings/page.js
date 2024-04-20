'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Settings() {
    const router = useRouter();
    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem("companyList");
        localStorage.removeItem("company");
        toast.error('Logout successfully.');
        router.push('/');
    }
    const [currentUser, setUser] = useState({});

    useEffect(() => {
        let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
        setUser(user);
    }, []);
    return (
        <div className="card mb-4">
            <h5 className="card-header">Settings</h5>
            <div className="card-body">
                <div className="d-flex align-items-start align-items-sm-center gap-4">
                    <i className='bx bx-user menu-icon menu-icon-profile'></i>
                    <div className="button-wrapper">
                        <h5 className="card-title">{currentUser.firstName + ' ' + currentUser.lastName}</h5>
                        <h6 className="card-subtitle text-muted mb-4">{currentUser.email}</h6>
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