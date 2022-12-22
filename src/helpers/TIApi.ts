import axios from "axios";
import { pick, get } from "lodash";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import { UserDetailType } from "../../types";
import _ from "lodash";

class TIApi {
  headers(headers = {}) {
    return {
      headers: {
        Authorization: "Bearer " + TI_API_KEY,
        ...headers,
      },
    };
  }

  apiUrl(url: string) {
    return TI_API_INSTANCE + url;
  }

  userDetails(email: string): Promise<UserDetailType> {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiUrl(`/incoming/v2/users/${email}`), this.headers())
        .then((res) => {
          if (get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data);
          }
        })
        .catch(reject);
    });
  }

  createUser(userDetail: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<UserDetailType> {
    const uData = {
      ...pick(userDetail, ["firstName", "lastName", "email"]),
      externalCustomerId: userDetail.email,
      sendInvite: true,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(this.apiUrl("/incoming/v2/users"), uData, this.headers())
        .then((res) => {
          if (get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data);
          }
        })
        .catch(reject);
    });
  }

  updateUser(udata: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<UserDetailType> {
    return new Promise((resolve, reject) => {
      axios
        .put(
          this.apiUrl(`/incoming/v2/users/${udata.id}`),
          _.omit(udata, "id"),
          this.headers()
        )
        .then((res) => {
          if (get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data);
          }
        })
        .catch(reject);
    });
  }
}

export default new TIApi();
