import axios from "axios";
import { AppStrings } from "../../Utils/AppStrings";

const Api = async (
  url: string,
  method: string,
  body = {},
  isFormData = false
) => {
  let headers: any;
  const { CancelToken } = axios;
  const source = CancelToken.source();
  var apiTimeout = setTimeout(() => {
    source.cancel("Request Timed out");
  }, 30000);

  if (isFormData) {
    headers = {
      "Content-Type": "multipart/form-data",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
    };
  }

  const structure: any = {
    url,
    method,
    headers,
    cancelToken: source.token,
  };

  if (method === "GET") {
    structure.params = body;
  } else {
    structure.data = body;
  }

  return axios(structure)
    .then((resp) => {
      clearTimeout(apiTimeout);
      if (resp?.data?.code == 200) {
        return {
          message: resp?.data?.message,
          data: resp?.data?.data,
          success: true,
        };
      } else {
        return resp.data;
      }
    })
    .catch(async (error) => {
      clearTimeout(apiTimeout);
      return error?.response?.data
        ? error.response.data
        : {
            message: error?.message
              ? error.message
              : AppStrings.Network.someThingError,
            data: null,
            success: false,
          };
    });
};

export default Api;
