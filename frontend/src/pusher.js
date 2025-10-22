// src/pusher.js
import Pusher from "pusher-js";

const pusher = new Pusher("d00e6779a30dbba68e0f", {
  cluster: "eu",
  authEndpoint: process.env.REACT_APP_AUTH_END_POINT,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      // Let Pusher set the correct Content-Type for form data.
      // Keep minimal headers to avoid breaking Laravel's parameter parsing.
      "X-Requested-With": "XMLHttpRequest",
    },
  },
  // Enable CSRF token if needed
  enabledTransports: ["ws", "wss"],
});

export default pusher;
