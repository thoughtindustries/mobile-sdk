import axios from "axios";
import { TI_API_INSTANCE, TI_API_KEY } from "@env";
import {
  courseListType,
  pageType,
  contentListType,
  userRecentContentType,
} from "../../types";
import _ from "lodash";
import Utils from "../helpers/Utils";
import * as SecureStore from "expo-secure-store";

interface LoginProps {
  email: string;
  password: string;
}

class TIGraphQL {
  gurl = `${TI_API_INSTANCE}/helium?apiKey=${TI_API_KEY}`;

  headers(headers = {}) {
    return Utils.fetch("logintoken").then((authToken) => ({
      headers: {
        authToken: authToken.token,
        ...headers,
      },
    }));
  }

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
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            //console.log('Login token:', res.data.data.Login);
            resolve(res.data.data.Login);
          }
        })
        .catch(reject);
    });
  }

  fetchCourses(params: {
    sortBy?: string;
    sortDir?: string;
    duration?: string;
    difficulty?: string;
    tag?: string;
    page?: number;
  }): Promise<courseListType[]> {
    let gql1 = `query CatalogContent(
      $page: Int!,
      $sortColumn: SortColumn,
      $sortDirection: SortDirection,
      $contentTypes: [String!]`;

    let gql2 = `page: $page,
      sortColumn: $sortColumn,
      sortDirection: $sortDirection
      contentTypes: $contentTypes
      `;

    let vars: {
      [key: string]: string | number | string[];
    } = {
      page: _.get(params, "page", 1),
      sortColumn: _.get(params, "sortBy", "title"),
      sortDirection: _.get(params, "sortDir", "asc"),
    };

    vars["contentTypes"] = ["Course"];

    if (!_.isEmpty(_.get(params, "tag", ""))) {
      gql1 = `${gql1},
      $query: String`;

      gql2 = `${gql2},
      query: $query`;

      vars["query"] = `tags:${_.get(params, "tag", "")}`;
    }

    if (
      !_.isEmpty(_.get(params, "duration", "")) ||
      !_.isEmpty(_.get(params, "difficulty", ""))
    ) {
      gql1 = `${gql1},
      $labels: [String!],
      $values: [String!]`;

      gql2 = `${gql2},
      labels: $labels,
      values: $values`;

      vars["labels"] = [];
      vars["values"] = [];

      if (!_.isEmpty(_.get(params, "duration", ""))) {
        vars["labels"].push("Duration");
        vars["values"].push(_.get(params, "duration", ""));
      }

      if (!_.isEmpty(_.get(params, "difficulty", ""))) {
        vars["labels"].push("Level of Difficulty");
        vars["values"].push(_.get(params, "difficulty", ""));
      }
    }

    const gql = {
      query: `${gql1},
      ) {
        CatalogContent(
          ${gql2}
        ) {
          contentItems {
            id
            asset
            authors
            title
            displayCourse
            contentTypeLabel
          }
        }
      }`,
      variables: vars,
    };

    return new Promise((resolve, reject) => {
      this.headers()
        .then((headers) => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data.data.CatalogContent.contentItems);
          }
        })
        .catch(reject);
    });
  }

  myLearnings(params: {
    sortBy?: string;
    sortDir?: string;
    tag?: string;
  }): Promise<{ items: courseListType[]; recent: courseListType[] }> {
    let gql1 = `query MyLearning(
      $sortColumn: SortColumn,
      $sortDirection: SortDirection`;

    let gql2 = `sortColumn: $sortColumn,
      sortDirection: $sortDirection
      `;

    let vars: {
      [key: string]: string | number | string[];
    } = {
      sortColumn: _.get(params, "sortBy", "title"),
      sortDirection: _.get(params, "sortDir", "asc"),
    };

    if (!_.isEmpty(_.get(params, "tag", ""))) {
      gql1 = `${gql1},
      $query: String`;

      gql2 = `${gql2},
      query: $query`;

      vars["query"] = `tags:${_.get(params, "tag", "")}`;
    }

    const gql = {
      query: `${gql1},
      ) {
        UserContentItems(
          ${gql2}
        ) {
          id
          title
          asset
          contentTypeLabel
        }
        UserRecentContent(limit:1) {
          id
          title
          asset
          contentTypeLabel
        }
      }`,
      variables: vars,
    };

    return new Promise((resolve, reject) => {
      this.headers()
        .then((headers) => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve({
              items: res.data.data.UserContentItems,
              recent: res.data.data.UserRecentContent,
            });
          }
        })
        .catch(reject);
    });
  }

  courseProgress(cid: string) {
    const gql = {
      query: `query CourseProgress($id: ID!) {
        UserCourseProgress(id: $id) {
          percentComplete
        }
      }`,
      variables: { id: cid },
    };

    return new Promise((resolve, reject) => {
      this.headers()
        .then((headers) => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data.data.UserCourseProgress.percentComplete);
          }
        })
        .catch(reject);
    });
  }

  fetchCourseDetails(cid: string) {
    const gql = {
      query: `query CourseById($id: ID!) {
        CourseById(id: $id) {
            sections {
                lessons {
                    topics {
                        ... on ArticlePage {
                            id
                          }
                    }
                }
            }
        }
    }`,
      variables: { id: cid },
    };

    let gql2 = {
      query: `query Pages($identifiers: [String!]!) {
        Pages(identifiers: $identifiers) {
            ... on ArticlePage {
            videoAsset
            languages {
              language
              label
              title
              subtitle
              body
              copyright
              allowAudioDownload
              audioAsset
              audioAssetUrl
              externalUrl
              externalUrlCallToAction
              pdfAsset
              pdfAssetSecondary
              pdfAssetSecondaryUrl
              pdfAssetTitle
              pdfAssetTitleSecondary
              pdfAssetUrl
            }
          }
        }
      }`,
      variables: { identifiers: [] },
    };

    return new Promise<pageType>((resolve, reject) => {
      let headers: { headers: { authToken: string } };
      this.headers()
        .then((h) => (headers = h))
        .then(() => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            gql2.variables.identifiers = _.flattenDeep(
              _.map(res.data.data.CourseById.sections, (s) =>
                _.map(s.lessons, (l) => _.map(l.topics, (t) => t.id))
              )
            );
          }
        })
        .then(() => axios.post(this.gurl, gql2, headers))
        .then((res) => resolve(_.get(res, "data.data.Pages[0]", [])))
        .catch(reject);
    });
  }

  fetchContentDetails(cid: string) {
    const gql = {
      query: `query CourseById($id: ID!) {
        CourseById(id: $id) {
            id
            title
            courseGroup{
              description
              authors
              asset
            }
            sections {
              id
              title
              lessons {
                id
                title
                topics {
                  ... on TextPage {
                    id
                    type
                  }
                  ... on ArticlePage {
                    id
                    type
                  }
                  ... on QuizPage{
                    id
                    type
                  }
                  ... on VideoPage{
                    id
                    type
                  }
                }
              }
            }
        }
    }`,
      variables: { id: cid },
    };

    const gql2 = {
      query: `query CourseProgress($id: ID!) {
        PagesCompletedByCourse(courseId: $id) {
          ... on TextPage {
              id
          }
        }
      }`,
      variables: { id: cid },
    };

    const content: contentListType = { course: [], progress: [] };

    return new Promise<contentListType>((resolve, reject) => {
      let headers: { headers: { authToken: string } };
      this.headers()
        .then((h) => (headers = h))
        .then(() => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            content.course = _.get(res, "data.data.CourseById", {});
          }
        })
        .then(() => axios.post(this.gurl, gql2, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            content.progress = _.get(
              res,
              "data.data.PagesCompletedByCourse",
              []
            ).map((pc: { id: String }) => pc.id);
            resolve(content);
          }
        })
        .catch(reject);
    });
  }

  fetchTopicPage(tid: string, type: string) {
    const gqlAry: { [key: string]: string } = {
      ArticlePage: `... on ArticlePage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        catalogAsset
        clientId
        companyId
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        createdAt
        editableByChildren
        id
        indentationLevel
        
        lessonId
        publishDate
        title
        type
        updatedAt
        videoAsset
      }`,
      quiz: `... on QuizPage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        allowToResume
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        continueAfterTimerExpires
        displayAllHints
        displayAttemptNumbers
        editableByChildren
        failMessage
        hintControlEnabled
        id
        indentationLevel
        instructorAssessment
        isGraded
        maxAttempts
        minPassingPercent
        navigationDisabled
        questions{
          additionalContent
          body
          choices{
            altText
            asset
            choiceId
            correct
            points
            response
            value
          }
          fileSubmissionAsset
          gradedAsCorrect
          hasChoices
          isBooleanChoice
          isEssay
          isFileSubmission
          isImageComparison
          isLikert
          isMultipleChoice
          isOpenEnded
          isSelectBoxes
          isTable
          mustSelectAllCorrectChoices
          openEndedResponse
          parentQuestion
          placeholder
          postText
          postText2
          preText
          preText2
          preselectedChoices{
            choiceId
          }
          questionId
          questionCategoryId
          questionType
          required
          response
          selectedChoice{
            choiceId
          }
          shouldCheckAnswers
          shouldDisplayOnResults
          table{
            headers{
              locked
              value
              weight
            }
            rows{
              locked
              value
              weight
            }
          }
          tableResponse{
            headers{
              locked
              value
              weight
            }
            rows{
              locked
              value
              weight
            }
          }
          type
        }
        passMessage
        preventProgression
        questionSkipEnabled
        showAnswerAfterPass
        startMessage
        timeLimitInSeconds
        timePerQuestionInSeconds
        timerEnabled
        title
        type
      }`,
      text: `... on TextPage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        body
        catalogAsset
        clientId
        companyId
        completionTimeSeconds
        contentDescription
        contentEstimate
        contentTime
        createdAt
        editableByChildren
        id
        indentationLevel
        lessonId
       
       
        title
        type
        updatedAt
      }`,
      video: `... on VideoPage {
        accessibilityAudioAsset
        accessibilityAudioAssetTitle
        accessibilityAudioAssetUrl
        body
        asset
        postAsset
        posterImageAsset
        preAsset
        preTextBlock
        title
        type
      }`,
    };

    const gql = {
      query: `query Pages($identifiers: [String!]!) {

      Pages(identifiers: $identifiers) {
        ${gqlAry[type]}
      }
    }`,
      variables: { identifiers: [tid] },
    };

    return new Promise((resolve, reject) => {
      this.headers()
        .then((headers) => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(res.data.errors[0].message);
          } else {
            resolve(res.data.data.Pages[0]);
          }
        })
        .catch(reject);
    });
  }

  fetchRecentCourses(limit: number) {
    const gql = {
      query: `query UserRecentContent{
          UserRecentContent(limit: ${limit}) {
            id
            title
            description
            asset  
          }
      }`,
      variables: {},
    };
    return new Promise<userRecentContentType[]>((resolve, reject) => {
      let headers: { headers: { authToken: string } };
      this.headers()
        .then((h) => (headers = h))
        .then(() => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(_.get(res, "data.errors.0.message", ""));
          } else {
            resolve(_.get(res, "data.data.UserRecentContent", []));
          }
        })
        .catch(reject);
    });
  }

  createAssessmentAttempt(courseId: string, topicId: string) {
    const gql = {
      query: `query LoadAssessmentAttemptWithQuestions(
        $courseId: ID,
        $id: ID!,
        $topicType: AssessmentTopicType!
      ) {
        LoadAssessmentAttemptWithQuestions(
          courseId: $courseId,
          id: $id,
          topicType:$topicType
        ) {
          id
          status
          grade
        }
      }`,
      variables: {
        courseId: courseId,
        id: topicId,
        topicType: "quiz",
      },
    };
    return new Promise<string>((resolve, reject) => {
      let headers: { headers: { authToken: string } };
      this.headers()
        .then((h) => (headers = h))
        .then(() => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(_.get(res, "data.errors.0.message", ""));
          } else {
            resolve(
              _.get(res, "data.data.LoadAssessmentAttemptWithQuestions.id", "")
            );
          }
        })
        .catch(reject);
    });
  }

  saveAssessmentAttempt(
    attemptId: string,
    qbody: string,
    msacc: boolean,
    selectedChoice: { value: string; correct: boolean }
  ) {
    const gql = {
      query: `mutation UpdateAssessmentAttempt(
        $activeQuestion: QuestionInput,
        $assessmentAttempt: AssessmentAttemptInput
      ) {
        UpdateAssessmentAttempt(
          activeQuestion: $activeQuestion,
          assessmentAttempt: $assessmentAttempt
        ) {
            id
            grade
        }
      }`,
      variables: {
        assessmentAttempt: {
          id: attemptId,
          status: "started",
        },
        activeQuestion: {
          body: qbody,
          mustSelectAllCorrectChoices: msacc,
          selectedChoice: {
            value: selectedChoice.value,
            correct: selectedChoice.correct,
          },
        },
      },
    };

    return new Promise<string>((resolve, reject) => {
      let headers: { headers: { authToken: string } };
      this.headers()
        .then((h) => (headers = h))
        .then(() => axios.post(this.gurl, gql, headers))
        .then((res) => {
          if (_.get(res, "data.errors.length", 0) > 0) {
            reject(_.get(res, "data.errors.0.message", ""));
          } else {
            resolve(_.get(res, "data.data.UpdateAssessmentAttempt.id", ""));
          }
        })
        .catch(reject);
    });
  }

  submitAssessmentAttempt(attemptId: string) {
    const gql = {
      query: `mutation UpdateAssessmentAttempt(
        $assessmentAttempt: AssessmentAttemptInput
      ) {
        UpdateAssessmentAttempt(
          assessmentAttempt: $assessmentAttempt
        ) {
            id
            grade
            answeredQuestionsCount
            correctQuestionsCount
        }
      }`,
      variables: {
        assessmentAttempt: {
          id: attemptId,
          status: "finished",
        },
      },
    };

    return new Promise<{ grade: number; answered: number; correct: number }>(
      (resolve, reject) => {
        let headers: { headers: { authToken: string } };
        this.headers()
          .then((h) => (headers = h))
          .then(() => axios.post(this.gurl, gql, headers))
          .then((res) => {
            if (_.get(res, "data.errors.length", 0) > 0) {
              reject(_.get(res, "data.errors.0.message", ""));
            } else {
              resolve({
                grade: _.get(res, "data.data.UpdateAssessmentAttempt.grade", 0),
                answered: _.get(
                  res,
                  "data.data.UpdateAssessmentAttempt.answeredQuestionsCount",
                  0
                ),
                correct: _.get(
                  res,
                  "data.data.UpdateAssessmentAttempt.correctQuestionsCount",
                  0
                ),
              });
            }
          })
          .catch(reject);
      }
    );
  }
}

export default new TIGraphQL();
