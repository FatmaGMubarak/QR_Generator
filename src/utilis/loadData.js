import Cookies from "js-cookie";

export const loadData = () => {
  const token = Cookies.get("token");

  const superAdmin = sessionStorage.getItem("superAdmin");

  try {
    return {
      token,
      superAdmin: superAdmin ? JSON.parse(superAdmin) : null,
    };
  } catch (err) {
    return {
      token,
      superAdmin: null,
    };
  }
};
