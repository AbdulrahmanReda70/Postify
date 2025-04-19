import React, { useState } from "react";
import { handleGoogleAuth, signup } from "../authService";
import signupImg from "../../images/chuttersnap-u-vmeJcJ-Z4-unsplash.jpg";
import { Link, useNavigate } from "react-router-dom";
import AlertPopup from "../../components/AlertPopup";
import LoginGoogle from "../LoginGoogle";
import { FcGoogle } from "react-icons/fc";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useMediaQuery,
} from "@mui/material"; // Import MUI components

function SignUp() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [username, setUsername] = useState(""); // New state for username
  const [password, setPassword] = useState("");
  const [password_confirm, setPassword_confirm] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
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

    if (!gender) {
      setRes({ error: true, message: "Please select your gender" });
      setIs_open(true);
      return null;
    }

    let { response, data } = await signup(
      "http://127.0.0.1:8000/api/register",
      {
        username,
        password,
        password_confirm,
        email,
        gender,
      }
    );

    if (!response.ok) {
      setRes({ error: true, message: data.message || data.error });
      setIs_open(true);
      return null;
    }

    nav("/", { replace: true });
    window.location.reload();
  }

  return (
    <div className="h-[100vh] flex bg-primary">
      <AlertPopup is_open={is_open} setIs_open={setIs_open} status={res} />

      <form
        className={`p-[5px] ${
          !isMobile ? "w-[50%]" : "w-[100%]"
        } flex flex-col justify-center items-center `}
      >
        <div className="w-[300px]">
          {/* Username Field */}
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-[100%]"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-[100%]"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-[100%]"
            />
            <div>
              <label htmlFor="password_confirm">Confirm Password</label>
              <input
                type="password"
                id="password_confirm"
                onChange={(e) => setPassword_confirm(e.target.value)}
                className="w-[100%]"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div className="mt-1  ">
            <FormControl component="fieldset">
              <FormLabel component="legend" className="sr-only">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>
          </div>

          <button
            type="submit"
            onClick={submit_form}
            className="btn font-bold bg-green !mt-[10px] "
          >
            Signup
          </button>
          <div className="w-[100%] h-[1px] bg-white mt-[30px]"></div>
          <div className="flex gap-x-[9px]">
            <button
              onClick={handleGoogleAuth}
              className="btn justify-center items-center flex gap-x-[5px] hover:bg-[#ea4335] hover:duration-[.5s]"
            >
              <FcGoogle className="w-[20px]" />
              <p>Google</p>
            </button>
          </div>
          <Link
            to={"/signin"}
            className="block text-center mt-[15px] font-bold text-green"
          >
            Have an account?
          </Link>
        </div>
      </form>
      {!isMobile && (
        <div className="w-[50%] h-[100%]">
          <img className="w-[100%] h-[100%]" src={signupImg} alt="" />
        </div>
      )}
    </div>
  );
}

export default SignUp;
