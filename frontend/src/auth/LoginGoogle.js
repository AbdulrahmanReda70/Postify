import { GoogleLogin } from "@react-oauth/google";

const LoginGoogle = () => {
  const handleSuccess = async (response) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}auth/google/callback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token: response.credential }),
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("User Data:", data);
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default LoginGoogle;
