import React, { useState } from "react";
import { handleGoogleAuth, signup } from "../../api/authService";
import signupImg from "../../images/chuttersnap-u-vmeJcJ-Z4-unsplash.jpg";
import { Link, useNavigate } from "react-router-dom";
import AlertPopup from "../../components/popup/AlertPopup";
import { FcGoogle } from "react-icons/fc";
import { useMediaQuery } from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

let apiUrl = process.env.REACT_APP_API_URL;

function SignUp() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [username, setUsername] = useState(""); // New state for username
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_confirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [is_open, setIs_open] = useState(false);
  const [res, setRes] = useState(null);
  const nav = useNavigate();

  async function submit_form(e) {
    e.preventDefault();

    if (password !== password_confirm) {
      setRes({ error: true, message: "Passwords should match" });
      setIs_open(true);
      return null;
    }

    let { response, data } = await signup(`${apiUrl}register`, {
      username,
      password,
      password_confirm,
      email,
    });

    if (!response.ok) {
      setRes({ error: true, message: data.message || data.error });
      setIs_open(true);
      return null;
    }

    nav("/", { replace: true });
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
          {/* Username Field */}
          <div>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              onChange={(e) => setUsername(e.target.value)}
              className='w-[100%]'
            />
          </div>

          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              onChange={(e) => setEmail(e.target.value)}
              className='w-[100%]'
            />
          </div>

          <div className='relative'>
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                onChange={(e) => setPassword(e.target.value)}
                className='w-[100%] m-0'
              />
              <div
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            </div>
          </div>

          <div className='relative mt-3'>
            <label htmlFor='password_confirm'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id='password_confirm'
                onChange={(e) => setPassword_confirm(e.target.value)}
                className='w-[100%] m-0'
              />
              <div
                className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </div>
            </div>
          </div>

          <button
            type='submit'
            onClick={submit_form}
            className='btn font-bold bg-green !mt-4'
          >
            Signup
          </button>
          <div className='w-[100%] h-[1px] bg-white mt-[30px]'></div>
          <div className='flex gap-x-[9px]'>
            <button
              onClick={handleGoogleAuth}
              className='btn justify-center items-center flex gap-x-[5px] hover:bg-[#ea4335] hover:duration-[.5s]'
            >
              <FcGoogle className='w-[20px]' />
              <p>Google</p>
            </button>
          </div>
          <Link
            to={"/signin"}
            className='block text-center mt-[15px] font-bold text-green'
          >
            Have an account?
          </Link>
        </div>
      </form>
      {!isMobile && (
        <div className='w-[50%] h-[100%]'>
          <img className='w-[100%] h-[100%]' src={signupImg} alt='' />
        </div>
      )}
    </div>
  );
}

export default SignUp;
