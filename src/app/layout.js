import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import "../assets/vendor/css/core.css";
import "../assets/vendor/css/theme-default.css";
import "../assets/css/demo.css";
import "../assets/css/style.css";
import "../assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "../assets/vendor/css/pages/page-auth.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Invoscan",
  description: "Invoscan",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="light-style layout-wide customizer-hide"
      dir="ltr">
        <head>
          <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
        </head>
      <body className={inter.className}>
        {children}
        <ToastContainer />
        <div id="ajax-loader">
          <img src="/loader.gif" />
        </div>
      </body>
    </html>
  );
}
