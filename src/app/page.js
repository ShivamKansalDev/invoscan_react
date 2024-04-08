'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import Request from "@/Request";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const doLogin = async (e) => {
    e.preventDefault();
    let response = await Request.post('auth/login', {email, password});
    if(response) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/dashboard/bookings')
    }
  }
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <a className="app-brand-link gap-2">
                  <span className="app-brand-logo">
                    <img src="/INVO.svg" />
                  </span>
                </a>
              </div>
              <h4 className="mb-2 text-center mb-3">Welcome to Invoscan</h4>

              <form id="formAuthentication" method="POST" onSubmit={(e) => { doLogin(e) }} className="mb-3">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email or Username</label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={(e) => { setEmail(e.target.value) }}
                    id="email"
                    name="email"
                    value={email}
                    required
                    placeholder="Enter your email or username"
                    autoFocus />
                </div>
                <div className="mb-3 form-password-toggle">
                  <div className="d-flex justify-content-between">
                    <label className="form-label" htmlFor="password">Password</label>
                    <Link href="/forgot-password">
                      <small>Forgot Password?</small>
                    </Link>
                  </div>
                  <div className="input-group input-group-merge">
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => { setPassword(e.target.value) }}
                      className="form-control"
                      name="password"
                      required
                      value={password}
                      placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                      aria-describedby="password" />
                    <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember-me" />
                    <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-green d-grid w-100" type="submit">Sign in</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
