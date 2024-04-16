'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from "next/link";
import { toast } from 'react-toastify';
import FeatherIcon from 'feather-icons-react';

import Request from "@/Request";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

import "../../assets/vendor/css/pages/page-account-settings.css";
import { SelectCompany } from '@/components/SelectCompany';

export default function RootLayout({ children }) {
  const router = useRouter();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [company, setCompany] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedSupplier, setSupplier] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
    if (token === null && user === null) {
      toast.error('Your session is expired, Please login again');
      router.push('/');
    }
    setCurrentUser(user)
    let companyDetails = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : null;
    if (companyDetails === null) {
      fetchCurrentCompanies(user.id);
      setOpen(true);
      setCompany({ id: '' });
    } else {
      setCompany(companyDetails);
    }
  }, [])

  useEffect(() => {
    if(open){
      let companyDetails = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : null;
      if(companyDetails){
        setSelectedCompany(companyDetails)
      }
    }else{
      setSelectedCompany(null);
    }
  }, [open]);

  const openModalPopup = () => {
    fetchCurrentCompanies(currentUser.id);
    setOpen(true);
  }

  const fetchCurrentCompanies = async (userId) => {
    let response = await Request.get(`company/user/${userId}`);
    if (response.data) {
      setCompanyList(response.data);
      localStorage.setItem("companyList", JSON.stringify(response.data));
    }
  }
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    toast.error('Logout successfully.');
    router.push('/');
  }
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

            <li className={(pathname == '/dashboard/bookings' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/bookings'} className="menu-link">
                <FeatherIcon icon="aperture" className='menu-icon' />
                <div data-i18n="Dashboards">Book In</div>
              </Link>
            </li>

            <li className={(pathname == '/dashboard/invoices' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/invoices'} className="menu-link">
                <FeatherIcon icon="file" className='menu-icon' />
                <div data-i18n="Dashboards">Invoices</div>
              </Link>
            </li>

            <li className={(pathname == '/dashboard/credits' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/credits'} className="menu-link">
                <FeatherIcon icon="hard-drive" className='menu-icon' />
                <div data-i18n="Dashboards">Credits</div>
              </Link>
            </li>

            <li className={(pathname == '/dashboard/statements' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/statements'} className="menu-link">
                <FeatherIcon icon="calendar" className='menu-icon' />
                <div data-i18n="Dashboards">Statements</div>
              </Link>
            </li>

            <li className={(pathname == '/dashboard/analytics' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/analytics'} className="menu-link">
                <FeatherIcon icon="codesandbox" className='menu-icon' />
                <div data-i18n="Dashboards">Analytics</div>
              </Link>
            </li>

            <li className={(pathname == '/dashboard/settings' ? 'active' : '') + ' menu-item'}>
              <Link href={'/dashboard/settings'} className="menu-link">
                <FeatherIcon icon="settings" className='menu-icon' />
                <div data-i18n="Dashboards">Settings</div>
              </Link>
            </li>

            <li className="menu-item">
              <button onClick={(e) => { logoutUser() }} className="menu-link">
                <FeatherIcon icon="log-out" className='menu-icon' />
                <div data-i18n="Dashboards">Logout</div>
              </button>
            </li>

            <li className="menu-item">
              <button onClick={(e) => { openModalPopup() }} className="menu-link">
                <FeatherIcon icon="briefcase" className='menu-icon' />
                <div data-i18n="Dashboards">{company?.name}</div>
              </button>
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
      {/* <Modal open={open} onClose={onCloseModal} classNames={{ modal: 'company-select-modal' }} center>
        <div className=" mb-4">
          <h2 className="card-header">Select company</h2>
          <small>You must select a company before you create delivery.</small>
          <div className="card-body mt-4">
            {
              companyList && companyList.map((item, index) => {
                if(selectedCompany?.id === item?.id){
                  return (
                      <div>
                          <div 
                          id={selectedCompany?.id === item?.id ? "bgColor": ""}
                          onClick={() => {}}
                          className="d-flex form-check form-radio-check mb-2 py-2" key={index}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle" color="rgba(11, 201, 147, 1)" pointer-events="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                              <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${index}`}>{item.name}</label>
                          </div>
                      </div>
                  )
              }
              return (
                 <div>
                       <div  
                       id={selectedCompany?.id === item?.id ? "bgColor": ""}
                       onClick={() => {
                        setSelectedCompany(item)
                        }} className="d-flex form-check form-radio-check mb-2 py-2" key={index}>
                          <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle" color="rgba(11, 201, 147, 1)" pointer-events="none"><circle cx="12" cy="12" r="10"></circle></svg>
                          </div>
                          <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${index}`}>{item.name}</label>
                      </div>
                 </div>
              )
              })
            }
            <div className="mt-2">
              <button 
                type="button" 
                disabled={!selectedCompany?.id} 
                onClick={() => { 
                  window.location.reload();
                  setCompany(selectedCompany); 
                  localStorage.setItem('company', JSON.stringify(selectedCompany))
                }} 
                className="btn btn-green me-2 width-100">
                  Save
                </button>
            </div>
          </div>
        </div>
      </Modal> */}
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

