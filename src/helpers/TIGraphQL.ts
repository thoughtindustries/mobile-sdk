import axios from "axios";
import { get } from "lodash";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import { courseListType } from "../../types";
import _ from "lodash";
import Utils from "../helpers/Utils";

interface LoginProps {
  email: string;
  password: string;
}

class TIGraphQL {
  gurl = `${TI_API_INSTANCE}/helium?apiKey=${TI_API_KEY}`;

  goLogin(params: LoginProps): Promise<string> {
    const gql = {
      query: `mutation Login($email: String!, $password: String!){
                Login(email: $email,password: $password)
            }`,
      variables: params,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(this.gurl, gql)
        .then((res) => {
          if (get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            //console.log('Login token:', res.data.data.Login);
            resolve(res.data.data.Login);
          }
        })
        .catch(reject);
    });
  }

  getTopCategories(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve(Utils.topCategoriesArray);
    });
  }

  fetchCourses(params: {
    sortBy: string;
    duration: string;
    difficulty: string;
    tag: string;
    page: number;
  }): Promise<courseListType[]> {
    let gql1 = `query CatalogContent(
      $page: Int!,
      $sortColumn: SortColumn,
      $sortDirection: SortDirection`;

    let gql2 = `page: $page,
      sortColumn: $sortColumn,
      sortDirection: $sortDirection
      `;

    let vars: {
      [key: string]: string | number | string[];
    } = {
      page: params.page,
      sortColumn: "title",
      sortDirection: params.sortBy,
    };

    if (!_.isEmpty(params.tag)) {
      gql1 = `${gql1},
      $query: String`;

      gql2 = `${gql2},
      query: $query`;

      vars["query"] = `tags:${params.tag}`;
    }

    if (!_.isEmpty(params.duration) || !_.isEmpty(params.difficulty)) {
      gql1 = `${gql1},
      $labels: [String!],
      $values: [String!]`;

      gql2 = `${gql2},
      labels: $labels,
      values: $values`;

      vars["labels"] = [];
      vars["values"] = [];

      if (!_.isEmpty(params.duration)) {
        vars["labels"].push("Duration");
        vars["values"].push(params.duration);
      }

      if (!_.isEmpty(params.difficulty)) {
        vars["labels"].push("Level of Difficulty");
        vars["values"].push(params.difficulty);
      }
    }

    const gql = {
      query: `${gql1},
      ) {
        CatalogContent(
          ${gql2}
        ) {
          contentItems {
            asset
            authors
            title
            displayCourse
          }
        }
      }`,
      variables: vars,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(this.gurl, gql)
        .then((res) => {
          if (get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data.data.CatalogContent.contentItems);
          }
        })
        .catch(reject);
    });
  }
}

export default new TIGraphQL();
