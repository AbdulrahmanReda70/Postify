export async function fetch_u(url, method = "GET", credentials) {
  const auth_token = localStorage.getItem("auth_token");

  if (!auth_token) {
    return { error: true, message: "No auth token found" };
  }

  let options = {
    credentials: "include",
    method,
    headers: {
      Authorization: `Bearer ${auth_token}`,
      Accept: "application/json",
    },
    body:
      credentials instanceof FormData
        ? credentials
        : JSON.stringify(credentials),
  };

  if (!(credentials instanceof FormData)) {
    options.headers["Content-Type"] = "application/json";
  }

  try {
    let response = await fetch(url, options);

    if (!response.ok) {
      let res = await response.json();
      return { error: true, message: res.message };
    }

    let data = await response.json();
    return { error: false, data: data };
  } catch (error) {
    console.log(error);
    return null;
  }
}
