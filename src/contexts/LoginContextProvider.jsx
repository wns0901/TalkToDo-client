import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import api from "../apis/baseApi";
import * as auth from "../apis/auth";

import * as Swal from "../apis/alert";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const { isLoginData, userInfoData, rolesData } = JSON.parse(
    localStorage.getItem("data")
  ) || { isLoginData: null, userInfoData: null, rolesData: null };

  const [isLogin, setIsLogin] = useState(isLoginData || false);

  const [userInfo, setUserInfo] = useState(userInfoData || {});

  const [roles, setRoles] = useState(
    rolesData || { isMember: false, isAdmin: false }
  );

  const loginCheck = async (isAuthPage = false) => {
    const accessToken = Cookies.get("accessToken");
    console.log(`accessToken : ${accessToken}`);
    let response;
    let data;

    if (!accessToken) {
      console.log(`쿠키에 JWT(accessToken) 이 없음`);
      logoutSetting();
      navigate("/login");
      return;
    }

    console.log("쿠키에 JWT(accessToken) 이 저장되어 있음");
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      response = await auth.userInfo();
    } catch (error) {
      console.log(`error: ${error}`);
      console.log(`status: ${response.status}`);
      return;
    }

    if (!response) return;

    console.log(`JWT(accessToken) 으로 사용자 인증 정보 요청 성공.`);

    data = response.data;
    console.log(`data: ${data}`);

    if (data === "UNAUTHORIZED" || response.status === 401) {
      console.error("JWT(accessToken)이 만료되었거나 인증에 실패하였습니다");
      return;
    }

    loginSetting(data, accessToken);
  };

  useEffect(() => {
    loginCheck();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await auth.login(username, password);
      const { status, headers } = response;
      const { authorization } = headers;

      const accessToken = authorization.replace("Bearer ", "");

      if (status === 200) {
        Cookies.set("accessToken", accessToken);

        loginCheck();

        navigate("/");
      }
    } catch (error) {
      console.error(`로그인 error: ${error}`);
    }
  };

  const logout = (force = false) => {
    if (force) {
      logoutSetting();
      navigate("/");
      return;
    }

    Swal.confirm(
      "로그아웃하시겠습니까?",
      "로그아웃을 진행합니다.",
      "warning",
      (result) => {
        if (result.isConfirmed) {
          logoutSetting();
          navigate("/");
        }
      }
    );
  };

  const loginSetting = (userData, accessToken) => {
    const { id, username } = userData;

    console.log(`
      loginSetting()
      id : ${id}
      username : ${username}
    `);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setIsLogin(true);

    const updateUserInfo = { id, username };
    setUserInfo(updateUserInfo);

    const updatedRoles = { isMember: false, isAdmin: false };

    localStorage.setItem(
      "data",
      JSON.stringify({
        isLoginData: true,
        userInfoData: updateUserInfo,
        rolesData: updatedRoles,
      })
    );
  };

  const logoutSetting = () => {
    setIsLogin(false);
    setUserInfo(null);

    Cookies.remove("accessToken");
    api.defaults.headers.common.Authorization = undefined;

    localStorage.removeItem("data");
  };

  return (
    <LoginContext.Provider
      value={{ isLogin, userInfo, roles, loginCheck, login, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
