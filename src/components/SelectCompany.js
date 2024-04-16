'use client'
import React, { useEffect, useState } from 'react'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function SelectCompany({
  open = false,
  onCloseModal = () => {},
  companyList = [],
  selectedCompany = null,
  setSelectedCompany = () => {},
  setCompany = () => {}
}) {
    return (
        <Modal open={open} onClose={onCloseModal} classNames={{ modal: 'company-select-modal' }} center>
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
      </Modal>
    )
}

export {SelectCompany};