import React, { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import api from "../apis/baseApi";
import * as auth from "../apis/auth";

import * as Swal from "../apis/alert";

export const LoginContext = createContext();
LoginContext.displayName = "LoginContextName";

const LoginContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarKey, setSidebarKey] = useState(0);

  // localStorage 데이터 파싱 시 에러 처리 추가
  const getLocalStorageData = () => {
    try {
      const data = localStorage.getItem("data");
      return data
        ? JSON.parse(data)
        : { isLoginData: null, userInfoData: null, rolesData: null };
    } catch (error) {
      console.error("localStorage 데이터 파싱 실패:", error);
      return { isLoginData: null, userInfoData: null, rolesData: null };
    }
  };

  const { isLoginData, userInfoData, rolesData } = getLocalStorageData();

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
      if (!isAuthPage) navigate("/login");
      return;
    }

    console.log("쿠키에 JWT(accessToken) 이 저장되어 있음");
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setIsTokenSet(true);

    try {
      response = await auth.userInfo();
      if (!response) {
        console.error("사용자 정보 요청 실패");
        logoutSetting();
        if (!isAuthPage) navigate("/login");
        return;
      }

      data = response.data;
      console.log(`data: ${data}`);

      if (data === "UNAUTHORIZED" || response.status === 401) {
        console.error("JWT(accessToken)이 만료되었거나 인증에 실패하였습니다");
        logoutSetting();
        if (!isAuthPage) navigate("/login");
        return;
      }

      loginSetting(data, accessToken);
    } catch (error) {
      console.error("사용자 정보 요청 중 에러 발생:", error);
      logoutSetting();
      if (!isAuthPage) navigate("/login");
    }
  };

  useEffect(() => {
    loginCheck();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await auth.login(username, password);
      const { headers } = response;
      const { authorization } = headers;

      const accessToken = authorization.replace("Bearer ", "");
      
      console.log(response.status);
      if (response.status === 200) {
        Cookies.set("accessToken", accessToken);
        loginCheck();
        navigate("/");
      }
    } catch (error) {
      console.error(`로그인 error:`, error);
      Swal.alert("로그인 실패", "아이디와 비밀번호를 확인해주세요.", "error");
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
          navigate("/login");
        }
      }
    );
  };

  const loginSetting = (userData, accessToken) => {
    const { id, username, roles: userRoles = [] } = userData;

    console.log(
      `\n      loginSetting()\n      id : ${id}\n      username : ${username}\n      roles : ${userRoles}\n    `
    );

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    setIsTokenSet(true);

    setIsLogin(true);

    const updateUserInfo = { id, username };
    setUserInfo(updateUserInfo);

    // roles 정보 업데이트
    const updatedRoles = {
      isMember: userRoles.includes("MEMBER"),
      isAdmin: userRoles.includes("ADMIN"),
    };
    setRoles(updatedRoles);

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

  const refreshSidebar = () => {
    setSidebarKey((prev) => prev + 1);
  };

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        userInfo,
        roles,
        loginCheck,
        login,
        logout,
        isTokenSet,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        sidebarKey,
        refreshSidebar,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;

export const useLogin = () => useContext(LoginContext);
