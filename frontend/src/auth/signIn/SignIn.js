import React, { useState } from "react";
import { handleGoogleAuth, login, saveUserInfo } from "../../api/authService";
import { FcGoogle } from "react-icons/fc";
import signinImg from "../../images/chuttersnap-u-vmeJcJ-Z4-unsplash.jpg";
import { Link, useNavigate } from "react-router-dom";
import AlertPopup from "../../components/popup/AlertPopup";
import useMediaQuery from "../../hooks/useMediaQuery";

let apiUrl = process.env.REACT_APP_API_URL;

function SignIn() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const nav = useNavigate();

  async function submit_form(e) {
    e.preventDefault();
    const { response, data } = await login(`${apiUrl}login`, {
      email,
      password,
    });

    if (!response.ok) {
      setRes({ error: true, message: data.message || data.error });
      setIs_open(true);
      return null;
    }
    saveUserInfo(data.user);
    nav("/", { replace: true });
    window.location.reload();
  }

  return (
    <div className='h-[100vh] flex bg-primary'>
      <AlertPopup is_open={is_open} setIs_open={setIs_open} status={res} />
      <form
        className={`p-[5px] ${
          !isMobile ? "w-[50%]" : "w-[100%]"
        } flex flex-col justify-center items-center `}
      >
        <div className='w-[300px]'>
          <div>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              id='email'
              onChange={(e) => setEmail(e.target.value)}
              className='w-[100%]'
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              className='w-[100%]'
            />
          </div>
          <button
            type='submit'
            onClick={submit_form}
            className='btn font-bold bg-green'
          >
            sign In
          </button>
          <div className='w-[100%] h-[1px] bg-white mt-[40px]'></div>
          <div className='flex gap-x-[9px] '>
            <button
              onClick={handleGoogleAuth}
              className='btn justify-center items-center flex gap-x-[5px] hover:bg-[#ea4335] hover:duration-[.5s]'
            >
              <FcGoogle className='w-[20px] ' />
              <p>Google</p>
            </button>
          </div>
          <Link
            to={"/signup"}
            className='block text-center mt-[15px] font-bold text-green'
          >
            don't have an account?
          </Link>
        </div>
      </form>
      {!isMobile && (
        <div className='w-[50%] h-[100%]'>
          <img className='w-[100%] h-[100%]' src={signinImg} alt='' />
        </div>
      )}
    </div>
  );
}

export default SignIn;
