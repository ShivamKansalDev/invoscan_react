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

export default function RootLayout({ children }) {
  const router = useRouter();

  const [company, setCompany] = useState({});
  const [companyList, setCompanyList] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : null;
    if (token === null && user === null) {
      toast.error('Your session is expired, Please login again');
      router.push('/');
    }
    setCurrentUser(user)
    let company = localStorage.getItem('company') !== null ? JSON.parse(localStorage.getItem('company')) : null;
    if (company === null) {
      fetchCurrentCompaies(user.id);
      setOpen(true);
      setCompany({ id: '' });
    } else {
      setCompany(company);
    }
  }, [])

  const openModalPopup = () => {
    fetchCurrentCompaies(currentUser.id);
    setOpen(true);
  }

  const fetchCurrentCompaies = async (userId) => {
    let response = await Request.get(`company/user/${userId}`);
    if (response.data) {
      setCompanyList(response.data)
    }
  }
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    toast.error('Logout successfully.');
    router.push('/');
  }
  const onCloseModal = () => setOpen(false);
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
                <div data-i18n="Dashboards">{company.name}</div>
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
      <Modal open={open} onClose={onCloseModal} classNames={{ modal: 'company-select-modal' }} center>
        <div className=" mb-4">
          <h2 className="card-header">Select company</h2>
          <small>You must select a company before you create delivery.</small>
          <div className="card-body mt-4">
            {
              companyList && companyList.map((selCompany, index) => {
                return (
                  <div className="form-check form-radio-check mb-2" key={index}>
                    <input className="form-check-input" onChange={() => {
                      setCompany(selCompany)
                      localStorage.setItem('company', JSON.stringify(selCompany))
                    }} name='companyId' type="radio" id={`flexSwitchCheckChecked-${index}`} checked={company.id == selCompany.id} />
                    <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${index}`}>{selCompany.name}</label>
                  </div>
                )
              })
            }
            <div className="mt-2">
              <button type="button" disabled={!company.id} onClick={() => { window.location.reload() }} className="btn btn-green me-2 width-100">Save</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
