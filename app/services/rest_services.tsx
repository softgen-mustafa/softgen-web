"use client";

import KeyStore from "@/keys";
import axios from "axios";
import http from "http";
var CryptoJS = require("crypto-js");
import Cookies from "js-cookie";

let _key = KeyStore.secret_key;
let _iv = KeyStore.iv;

const postAsync = async (url: string, requestBody: any) => {
  const encryptedBody = _wrap(requestBody);
  let appHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    token: Cookies.get("authToken") ?? "",
    companyid: Cookies.get("companyId") ?? 1,
  };

  //  console.log("----------- This is my Headers Value look. ----------------",appHeaders)
  //  console.log("----------- This is my url Value look. ----------------",url)

  return axios
    .post(url, encryptedBody, { headers: appHeaders })
    .then((response) => {
      // console.log(`POST ${url}`);

      // console.log("received from server ", response.status);

      return response.data;
    })
    .then((data) => {
      // console.log("data is ", data);
      return _unwrap(data);
    });
};

const putAsync = async (url: string, requestBody: any) => {
  const encryptedBody = _wrap(requestBody);
  let appHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    token: Cookies.get("authToken") ?? "",
    companyid: Cookies.get("companyId") ?? 1,
  };

  //  console.log("----------- This is my Headers Value look. ----------------",appHeaders)
  //  console.log("----------- This is my url Value look. ----------------",url)

  return axios
    .put(url, encryptedBody, { headers: appHeaders })
    .then((response) => {
      // console.log(`POST ${url}`);

      // console.log("received from server ", response.status);

      return response.data;
    })
    .then((data) => {
      // console.log("data is ", data);
      return _unwrap(data);
    });
};

const getAsync = async (url: string) => {
  let appHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    token: Cookies.get("authToken") ?? "",
    companyid: Cookies.get("companyId") ?? 1,
  };

  return axios
    .get(url, { headers: appHeaders, withCredentials: false })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return null;
    })
    .then((data) => {
      return _unwrap(data);
    });
};

const _wrap = (serializedData: string) => {
  const serializedString = JSON.stringify(serializedData);
  const parsedKey = CryptoJS.enc.Base64.parse(_key);
  const parsedIv = CryptoJS.enc.Base64.parse(_iv);

  const encryptedData = CryptoJS.AES.encrypt(serializedString, parsedKey, {
    iv: parsedIv,
  });

  const encodedData = CryptoJS.enc.Base64.stringify(encryptedData.ciphertext);

  return JSON.stringify({
    data: encodedData,
  });
};

const _unwrap = (encryptedData: any) => {
  //  console.log(`[UNWRAP: ${JSON.stringify(encryptedData)}]`);
  const parsedKey = CryptoJS.enc.Base64.parse(_key);
  const parsedIv = CryptoJS.enc.Base64.parse(_iv);
  if (
    encryptedData === null ||
    encryptedData === "" ||
    encryptedData["data"] === null ||
    encryptedData["data"] === ""
  ) {
    return null;
  }
  // console.log(`encrypted Data: ${JSON.stringify(encryptedData)}`);
  const decodedString = CryptoJS.enc.Base64.parse(encryptedData["data"]);
  let decryptedData = CryptoJS.AES.decrypt(
    { ciphertext: decodedString },
    parsedKey,
    {
      iv: parsedIv,
    }
  );
  if (!decryptedData) {
    return null;
  }
  let output = decryptedData.toString(CryptoJS.enc.Utf8);
  //  console.log(`decrypted Data: ${JSON.stringify(output , 0 , index=3)}`);

  return JSON.parse(output);
};
const getBmrmBaseUrl = () => {
  return `${getBaseUrl()}/bmrm/api`;
};

const getUmsBaseUrl = () => {
  return `${getBaseUrl()}/ums/api`;
};

const getSgBizBaseUrl = () => {
  return `${getBaseUrl()}/sg-bizz/api`;
};

const getBaseUrl = () => {
  //Local
  // return "http://192.168.1.2:5000";
  //GoDadddddddy
  return "http://118.139.167.125:45400";
  // return "https://softgensolutions.in/service";
};

export {
  postAsync,
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
  getSgBizBaseUrl,
  putAsync,
};
