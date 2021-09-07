import React, { useState, useEffect } from "react";
import travelers from "../images/travelers.jpg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authenticate, isAuth } from "../helpers/auth";
import { Link, Redirect } from "react-router-dom";

const Activate = ({ match }) => {
  const [formData, setFormData] = useState({
    name: "",
    token: "",
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }

    console.log(token, name);
  }, [match.params]);
  const { name, token, show } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/activation`, {
        token,
      })
      .then((res) => {
        setFormData({
          ...formData,
          show: false,
        });

        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error("your link has expired, try to sign up again.");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-700 to-yellow-400 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Welcome {name.split(" ")[0]}
            </h1>

            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-orange-400 text-gray-100 w-full py-4 p-10 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className="ml-3">Activate your Account</span>
                </button>
                <Link
                  to="/"
                  className="no-underline hover:underline text-yellow-600 text-md text-right absolute right-0  mt-4"
                >
                  Sign in
                </Link>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2 ">
                  Or sign up again
                </div>
              </div>
              <div className="flex flex-col items-center">
                <a
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5 bg-orange-400 hover:bg-orange-700"
                  href="/register"
                  target="_self"
                >
                  <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">Sign Up</span>
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-b from-yellow-300 to-yellow-100 text-center hidden lg:flex rounded-t-lg rounded-b-lg">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat "
            style={{ backgroundImage: `url(${travelers})` }}
          ></div>
        </div>
      </div>
      ;
    </div>
  );
};

export default Activate;
