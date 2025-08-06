export function saveAuthToken(token) {
  localStorage.setItem("auth_token", token);
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function removeAuthToken() {
  localStorage.removeItem("auth_token");
}

// USER
export function saveUserInfo(data) {
  localStorage.setItem("user", JSON.stringify(data));
}

export function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || null;
  } catch (error) {
    console.error("Failed to parse user data from localStorage:", error);
    return null;
  }
}

export function removeUserInfo() {
  localStorage.removeItem("user");
}

//

export async function login(url, credentials) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...credentials,
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    console.log(data);

    saveAuthToken(data.access_token);
    console.log(data.user, "???????");

    saveUserInfo(data.user);
  }
  return { response, data };
}

export async function signup(url, credentials) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...credentials,
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    saveAuthToken(data.access_token);
    saveUserInfo(data.user);
  }
  return { response, data };
}

export async function handleGoogleAuth(e) {
  e.preventDefault();
  fetch(`${process.env.REACT_APP_API_URL_GOOGLE}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Something went wrong!");
    })
    .then((data) => (window.location.href = data.url))
    .catch((error) => console.error(error));
}
