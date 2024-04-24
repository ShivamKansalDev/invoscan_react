'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from "next/link";
import { toast } from 'react-toastify';
import FeatherIcon from 'feather-icons-react';
import { useDispatch } from 'react-redux';

import 'react-responsive-modal/styles.css';
import "../assets/vendor/css/pages/page-account-settings.css";
import { SelectCompany } from './SelectCompany';
import { logout } from '../lib/features/thunk/logout';

function CustomDashboard({ 
  children,
  dashboardItems = []
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [company, setCompany] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [reset, setReset] = useState(false);
  const [selectedSupplier, setSupplier] = useState(null);
  const [open, setOpen] = useState(false);

  const logoutUser = (e) => {
    e.preventDefault();
    setReset(true);
  }

  useEffect(() => {
    if(reset){
        if(window?.location?.pathname){
            const path = window.location.pathname.includes("/admin")
            if(path){
                console.log("^^^^ ADMIN LOGOUT", path)
                router.replace("/admin");
            }else{
                console.log("**** ADMIN LOGOUT", path)
                // window.location.replace("/");
                router.replace("/")
            }
        }
        toast.error('Logout successfully.');
        dispatch(logout());
        setReset(false);
    }
  }, [reset])
  
  const onCloseModal = () => {
    setOpen(false);
    setSelectedCompany(null);
  };
  const pathname = usePathname()

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">

        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
          <div className="app-brand demo">
            <Link href="/dashboard" className="app-brand-link">
              <span className="app-brand-logo dashboard">
                <img src="/INVO.svg" />
              </span>
            </Link>

            <a className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
              <i className="bx bx-chevron-left bx-sm align-middle"></i>
            </a>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1">

            {dashboardItems.map((item,  index) => {
              return (
                <li key={`item${index}`} className={(pathname == item?.pathName ? 'active' : '') + ' menu-item'}>
                <Link href={item?.pathName} className="menu-link">
                    {item?.icon}
                    <div data-i18n="Dashboards">{item?.title}</div>
                  </Link>
                </li>
              );
            })}            

            <li className="menu-item">
              <Link href={'/'} onClick={(e) => { logoutUser(e)}} className="menu-link">
                <FeatherIcon icon="log-out" className='menu-icon' />
                <div data-i18n="Dashboards">Logout</div>
              </Link>
            </li>

          </ul>
        </aside>

        <div className="layout-page">

          <div className="content-wrapper">

            <div className="container-xxl flex-grow-1 container-p-y">
              <div className='row'>
                {children}
              </div>
            </div>

            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>

      <div className="layout-overlay layout-menu-toggle"></div>
      <SelectCompany 
        open={open}
        onCloseModal={onCloseModal}
        companyList={companyList}
        selectedCompany={selectedCompany}
        setSelectedCompany={(item) => setSelectedCompany(item)}
        setCompany={() => setCompany(selectedCompany)}
      />
    </div>
  );
}

export {CustomDashboard}

