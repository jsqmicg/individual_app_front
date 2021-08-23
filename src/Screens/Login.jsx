import React, { useState } from "react";
import maps from "../images/maps.jpg";
import { ToastContainer, toast } from "react-toastify";
import { authenticate, isAuth } from "../helpers/auth";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { Store } from "@material-ui/icons";
import { GoogleLogin } from "react-google-login";
import { Button } from "@material-ui/core";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Facebook } from "@material-ui/icons";
import { GTranslate } from "@material-ui/icons";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
  });
  const { email, password1 } = formData;
  //handle change from inputs

  const handleChange = (text) => (e) => {
    console.log(email, password1);
    setFormData({ ...formData, [text]: e.target.value });
  };

  const sendGoogleToken = (tokenId) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        informParent(res);
      })
      .catch((err) => {
        toast.error("google login error");
      });
  };

  //get response from google
  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/map");
    });
  };

  const sendFacebookToken = (userID, accessToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        console.log(res.data);
        informParent(res);
      })
      .catch((err) => {
        toast.error("Facebook login failed");
      });
  };

  const responseFacebook = (response) => {
    console.log(response.data);
    sendFacebookToken(response.userID, response.accessToken);
  };

  //submit data to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password1) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
            });
            console.log(res.data);
          });
          history.push("/map");
          toast.success(`Hey ${res.data.user.name}, welcome back`);
        })
        .catch((err) => {
          toast.error(err.response.data.error);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-400 to-pink-200 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-100 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign in to Rock Out
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs space-y-2 relative">
                <br />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={handleChange("email")}
                  value={email}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white "
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-purple-400 text-gray-100 w-full py-4 rounded-lg hover:bg-purple-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  Sign in
                </button>
                <Link
                  to="/users/passwords/forget"
                  className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
                >
                  Forget password?
                </Link>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2 flex items-center justify-center space-y-7">
                  Or sign up
                </div>
              </div>
              <div className="flex flex-col items-center">
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-purple-400 hover:bg-purple-500 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    >
                      <div className=" p-2 rounded-full ">
                        <GTranslate />
                      </div>
                      <span className="ml-4">Sign In with Google</span>
                    </button>
                  )}
                ></GoogleLogin>
                <FacebookLogin
                  appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-purple-400 hover:bg-purple-500 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                    >
                      <div className=" p-2 rounded-full ">
                        <Facebook />
                      </div>
                      <span className="ml-4 ">Sign In with Facebook</span>
                    </button>
                  )}
                />
                <a
                  href="/register"
                  className="mt-3 w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-purple-400 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5' hover:bg-purple-500"
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-purple-200 w-full h-full bg-opacity-50 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain rounded bg-center bg-no-repeat rounded-lg "
            style={{ backgroundImage: `url(${maps})`, borderRadius: "5" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
