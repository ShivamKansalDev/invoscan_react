'use client';
import { login } from "@/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/lib/features/slice/userSlice";
import storage, { logout, makeStore } from "@/lib/store";
import { persistStore } from "redux-persist";

const CustomForm = ()=>{
    const router = useRouter();
    const store = makeStore();
    const persistor = persistStore(store);
    const { userDetails, selectedCompany } = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { setUserDetails } = userActions;

    const dispatch = useDispatch();

    useEffect(() => {
        if(selectedCompany){
            persistor.purge().then(() => {
                console.log("^^^ PURGE SUCCESS: ", selectedCompany);
            }).catch((error) => {
                console.log("!!!! PURGE ERROR: ", error);
            })
        }else{
            console.log("@@@@ REDUX RESET SUCCESS: ", selectedCompany);
        }
    }, [selectedCompany]);

    const doLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await login({email, password});
            const data = response.data?.data;
            dispatch(setUserDetails(JSON.stringify(data)));
            storage.setItem('token', data.accessToken);
            if(data?.user?.role?.toLowerCase() === "admin"){
                router.push('/admin/dashboard/users');
            }else if(data?.user?.role?.toLowerCase() !== "admin"){
                router.push('/dashboard/bookings');
            }
        }catch(error){
          console.log("@#@#@ LOGIN ERROR: ", error);
        }
      } 

    return(
        <div>
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
                        <h4 className="mb-2 text-center">Welcome to Invoscan</h4>

                            <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email or Username</label>
                            <input
                                type="email"
                                className="form-control"
                                onChange={(e) => { setEmail(e.target.value.trim()) }}
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
                                id="password"
                                onChange={(e) => { setPassword(e.target.value.trim()) }}
                                className="form-control"
                                name="password"
                                required
                                value={password}
                                type={
                                    showPassword ? "text" : "password"
                                }
                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                aria-describedby="password" />
                                <span className="input-group-text cursor-pointer"
                                onClick={() => setShowPassword(prevState => !prevState)}>
                                {showPassword ? <i className="bx bx-show"></i> : <i className="bx bx-hide"></i>}
                                </span>
                            </div>
                            </div>
                            <div className="mb-3">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="remember-me" />
                                <label className="form-check-label" htmlFor="remember-me"> Remember Me </label>
                            </div>
                            </div>
                            <div className="mb-3">
                            <button disabled={(!email || !password)} onClick={doLogin} className="btn btn-green d-grid w-100" type="submit">Sign in</button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
        </div>
    )
}
export default CustomForm;