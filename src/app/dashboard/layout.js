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
import { userActions } from '@/lib/features/slice/userSlice';
import { storage } from '@/lib/store';
import { userCompanyList } from '@/lib/features/thunk/user';

export default function RootLayout({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reset, setReset] = useState(false);

  const { selectedCompany, userDetails, companyList } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(Array.isArray(companyList) && (companyList.length > 0)){
      setOpen(true);
    }
  }, [companyList])

  useEffect(() => {
    const path = window?.location?.pathname;
    if(!selectedCompany && !reset && (!path.includes("/dashboard/settings"))){
      getCompanyList();
    }
  }, [])

  useEffect(() => {
    async function exit(){
      router.push("/");
      toast.success('Logout successfully.');
      await storage.removeItem("token");
      dispatch(userActions.setAuthentication())
      setReset(false);
    }
    if(reset){
      exit();
    }
  }, [reset]);

  const logoutUser = (e) => {
    // window.location.replace("/");
    e.preventDefault();
    setReset(true);
  }

  const onCloseModal = () => {
    setOpen(false);
  };

  const getCompanyList = () => {
    // e.preventDefault();
    const details = JSON.parse(userDetails);
    const user = details?.user;
    if (user?.id) {
      dispatch(userCompanyList(user?.id));
    }
  }

  const pathname = usePathname()

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container p-3">
        <div className='layout-left'>
            <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme rounded-[10px]" style={{ max: '550px', overflow: 'hidden' }}>
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

                <ul className="menu-inner py-1 overflow-y-scroll h-32" style={{ maxWidth: '100%' ,overflowX: 'hidden' }}>

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

                  <li className={(pathname == '/dashboard/master_csv' ? 'active' : '') + ' menu-item'}>
                    <Link href={'/dashboard/master_csv'} className="menu-link">
                      <FeatherIcon icon="file-text" className='menu-icon' />
                      <div data-i18n="Dashboards">Master CSV</div>
                    </Link>
                  </li>

                  <li className={(pathname == '/dashboard/concession' ? 'active' : '') + ' menu-item'}>
                    <Link href={'/dashboard/concession'} className="menu-link">
                      <FeatherIcon icon="percent" className='menu-icon' />
                      <div data-i18n="Dashboards">Concession</div>
                    </Link>
                  </li>

                  <li className={(pathname == '/dashboard/settings' ? 'active' : '') + ' menu-item'}>
                    <Link href={'/dashboard/settings'} className="menu-link">
                      <FeatherIcon icon="settings" className='menu-icon' />
                      <div data-i18n="Dashboards">Settings</div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link  href={''} onClick={(e) => getCompanyList()} className="menu-link">
                      <FeatherIcon icon="briefcase" className='menu-icon' />
                      <div data-i18n="Dashboards">{selectedCompany?.name || "Select company"}</div>
                    </Link>
                  </li>

                  <li className="menu-item">
                    <Link href={'/'} onClick={(e) => { logoutUser(e) }} className="menu-link">
                      <FeatherIcon icon="log-out" className='menu-icon' />
                      <div data-i18n="Dashboards">Logout</div>
                    </Link>
                  </li>

                </ul>
              </aside>
        </div>
          <div className="layout-page">
            <div className="content-wrapper">
              <div className="container" style={{paddingRight:"10px"}}>
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

