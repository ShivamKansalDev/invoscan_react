'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from "next/link";
import { toast } from 'react-toastify';
import FeatherIcon from 'feather-icons-react';

import { SelectCompany } from '@/components/SelectCompany';
import { logout } from '../../lib/features/thunk/logout';
import { useDispatch, useSelector } from 'react-redux';;
import 'react-responsive-modal/styles.css';
import "../../assets/vendor/css/pages/page-account-settings.css";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { userDetails, selectedCompany, companyList } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!selectedCompany){
      setOpen(true);
    }
  }, [selectedCompany])

  const openModalPopup = () => {
    // fetchCurrentCompanies(currentUser.id);
    setOpen(true);
  }

  const logoutUser = () => {
    // window.location.replace("/");
    // e.preventDefault();
    router.push("/");
    toast.success('Logout successfully.');
    dispatch(logout());
  }
  const onCloseModal = () => {
    setOpen(false);
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
              <Link href={'/'} onClick={(e) => { logoutUser(e) }} className="menu-link">
                <FeatherIcon icon="log-out" className='menu-icon' />
                <div data-i18n="Dashboards">Logout</div>
              </Link>
            </li>

            <li className="menu-item">
              <Link  href={''} onClick={(e) => { openModalPopup() }} className="menu-link">
                <FeatherIcon icon="briefcase" className='menu-icon' />
                <div data-i18n="Dashboards">{selectedCompany?.name || "Select company"}</div>
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
      />
    </div>
  );
}

