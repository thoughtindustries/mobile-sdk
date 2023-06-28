import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
} from "react-native";
import { Button, Loader } from "../components";
import {
  get,
  filter,
  includes,
  set,
  isUndefined,
  remove,
  isEmpty,
  padStart,
  isArray,
} from "lodash";
import striptags from "striptags";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { questionChoice } from "../../types";
import tiGql from "../helpers/TIGraphQL";
import { VictoryPie } from "victory-native";
import { useLoadAssessmentAttemptWithQuestionsQuery } from "../graphql";

interface CourseQuizProps {
  courseid: string;
  quiz: any;
}

const CourseQuiz: FC<CourseQuizProps> = ({ quiz, courseid }) => {
  const { data } = useLoadAssessmentAttemptWithQuestionsQuery({
    variables: {
      courseId: courseid,
      id: quiz.id,
      topicType: "quiz",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [attemptId, setAttemptId] = useState<string>("");
  const [result, setResult] = useState<{
    grade: number;
    answered: number;
    correct: number;
  }>({ grade: 0, answered: 0, correct: 0 });

  const saveAttempt = (answer: string, isMulti: boolean) => {
    let temp = [...attempts];

    if (isMulti) {
      let answers: string[] = [];
      if (includes(get(temp, index, []), answer)) {
        answers = filter(get(temp, index, []), (a) => a !== answer);
      } else {
        answers.push(answer);
      }
      set(temp, index, answers);
    } else {
      if (!isUndefined(temp[index]) && temp[index] === answer) {
        remove(temp, (v, idx) => idx === index);
      } else {
        set(temp, index, answer);
      }
    }

    setAttempts([...temp]);
  };

  const goNextQuestion = () => {
    let question = quiz.questions[index - 1];
    let answer = attempts[index];
    answer = isArray(answer) ? answer[0] : answer;

    let choice = get(question, "choices", []).filter(
      (c: { value: string }) => c.value === answer
    );
    setLoading(true);
    tiGql
      .saveAssessmentAttempt(
        attemptId,
        question.body,
        question.mustSelectAllCorrectChoices,
        {
          value: answer,
          correct: get(choice, "0.correct", false),
        }
      )
      .then(() => {
        if (index < quiz.questions.length) {
          setLoading(false);
          setIndex(index + 1);
        } else {
          submitQuiz();
        }
      });
  };

  const submitQuiz = () => {
    setLoading(true);
    tiGql
      .submitAssessmentAttempt(attemptId)
      .then(({ grade, answered, correct }) =>
        setResult({ grade: grade, answered: answered, correct: correct })
      )
      .then(() => setLoading(false))
      .then(() => setShowResult(true))
      .catch((error) =>
        console.log("Submit Assessment Attempt Error: ", error.message)
      );
  };

  const renderQuestion = () => {
    const question = get(quiz, `questions.${index - 1}`, {});

    const preText = () => (
      <>
        {get(question, "preText", "") !== "" && (
          <Text style={styles.questionText}>
            {striptags(get(question, "preText", ""))}
          </Text>
        )}
      </>
    );

    const questionBody = () => (
      <Text style={styles.questionTitle}>
        {striptags(get(question, "body", ""))}
      </Text>
    );

    const postText = () => (
      <>
        {get(question, "postText", "") !== "" && (
          <Text style={styles.questionText}>
            {striptags(get(question, "postText", ""))}
          </Text>
        )}
      </>
    );

    const questionEssay = () => {
      return (
        <>
          <View
            style={{
              ...styles.choiceBox,
              flexDirection: "column",
              marginTop: 10,
            }}
          >
            <Text style={styles.subTitle}>Content to Review</Text>
            <Text style={styles.essayText}>
              {striptags(get(question, "body", ""))}
            </Text>
          </View>

          {!isEmpty(get(question, "additionalContent", "")) && (
            <View style={{ ...styles.choiceBox, flexDirection: "column" }}>
              <Text style={styles.subTitle}>Additional Content</Text>
              <Text style={styles.essayText}>
                {striptags(get(question, "additionalContent", ""))}
              </Text>
            </View>
          )}
        </>
      );
    };

    return (
      <View>
        {/* {attempts.length === 0 && renderQuizInfo()} */}
        <View style={styles.questionBox}>
          {preText()}
          {question.type !== "essay" && questionBody()}
          {question.type === "essay" && questionEssay()}

          {question.type === "multipleChoice" && (
            <View style={{ marginTop: 16 }}>
              {renderChoice(question.choices, true, question.type)}
            </View>
          )}

          {question.type === "booleanChoice" && (
            <View style={{ marginTop: 16 }}>
              {renderChoice(question.choices, false, question.type)}
            </View>
          )}

          {(question.type === "openEnded" || question.type === "essay") && (
            <View style={{ marginTop: 16 }}>
              <TextInput
                onChangeText={(txt) => saveAttempt(txt, false)}
                defaultValue={get(attempts, index, "")}
                style={styles.textArea}
                multiline={true}
                numberOfLines={6}
                placeholder="Fill in your answer"
              />
            </View>
          )}

          {question.type === "imageComparison" && (
            <View style={{ marginTop: 16 }}>
              {renderChoice(question.choices, false, question.type)}
            </View>
          )}

          {index < quiz.questions.length && (
            <View
              style={
                quiz.questionSkipEnabled && get(attempts, index, []).length > 0
                  ? styles.row
                  : {}
              }
            >
              {quiz.questionSkipEnabled && (
                <Button
                  title="Skip Question"
                  mode={2}
                  onPress={() => setIndex(index + 1)}
                />
              )}

              {get(attempts, index, []).length > 0 && (
                <Button title="Next Question" onPress={goNextQuestion} />
              )}
            </View>
          )}

          {postText()}

          {index >= quiz.questions.length && (
            <Button title="See Results" onPress={goNextQuestion} />
          )}
        </View>
      </View>
    );
  };

  const renderChoice = (
    choices: questionChoice[],
    isMulti: boolean,
    type: string
  ) => {
    return (
      <>
        {choices.map((choice: questionChoice, idx: number) => (
          <Pressable onPress={() => saveAttempt(choice.value, isMulti)}>
            <View
              key={choice.choiceId}
              style={{
                ...styles.choiceBox,
                ...(get(attempts, index, []).length > 0 &&
                get(attempts, index, []).includes(choice.value)
                  ? choice.correct
                    ? styles.correctBox
                    : styles.incorrectBox
                  : []),
                ...(type === "imageComparison" ? styles.imageComparison : {}),
              }}
            >
              {type !== "imageComparison" && (
                <Text style={styles.answerTextBold}>
                  {String.fromCharCode(65 + idx)}.
                </Text>
              )}
              {type === "imageComparison" && (
                <ImageBackground
                  source={{ uri: get(choice, "asset", "") }}
                  resizeMode="cover"
                  style={{ height: 100, width: "100%", marginBottom: 10 }}
                />
              )}
              <View>
                <Text style={styles.answerText}>
                  {isEmpty(choice.altText) ? choice.value : choice.altText}
                </Text>

                {get(attempts, index, []).includes(choice.value) &&
                  !isEmpty(choice.response) && (
                    <Text style={styles.responseText}>
                      {striptags(get(choice, "response", ""))}
                    </Text>
                  )}
              </View>
            </View>
          </Pressable>
        ))}
      </>
    );
  };

  const renderQuizInfo = () => (
    <View style={styles.row}>
      <View
        style={{
          ...styles.quizBox,
          width: isAttemptBound ? "49%" : "100%",
        }}
      >
        <View style={{ ...styles.row, justifyContent: "flex-start" }}>
          <MaterialCommunityIcons
            name="timer-sand-complete"
            size={24}
            color="#374151"
            style={styles.quizBoxIcon}
          />
          <View>
            <Text style={styles.prenote}>Time Limit</Text>
            <Text style={styles.boldnote}>
              {getFormattedTime(quiz.timeLimitInSeconds)}
            </Text>
          </View>
        </View>
      </View>
      {/* {quiz.timeLimitInSeconds && (
        <View
          style={{
            ...styles.quizBox,
            width: isAttemptBound ? "49%" : "100%",
          }}
        >
          <View style={{ ...styles.row, justifyContent: "flex-start" }}>
            <MaterialCommunityIcons
              name="timer-sand-complete"
              size={24}
              color="#374151"
              style={styles.quizBoxIcon}
            />
            <View>
              <Text style={styles.prenote}>Time Limit</Text>
              <Text style={styles.boldnote}>
                {getFormattedTime(quiz.timeLimitInSeconds)}
              </Text>
            </View>
          </View>
        </View>
      )} */}

      {isAttemptBound && (
        <View
          style={{
            ...styles.quizBox,
            width: isTimeBound ? "49%" : "100%",
          }}
        >
          <View style={{ ...styles.row, justifyContent: "flex-start" }}>
            <MaterialCommunityIcons
              name="arrow-up-right"
              size={24}
              color="#374151"
              style={styles.quizBoxIcon}
            />
            <View>
              <Text style={styles.prenote}>Attempts left</Text>
              <Text style={styles.boldnote}>{quiz.maxAttempts}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const getFormattedTime = (t: number) => {
    let suffix: string = "seconds";
    if (t >= 60) {
      t = Math.round(t / 60);
      suffix = "minutes";
    }
    if (t >= 60) {
      t = Math.round(t / 60);
      suffix = "hours";
    }
    if (t >= 24) {
      t = Math.round(t / 24);
      suffix = "days";
    }

    return `${t} ${suffix}`;
  };

  const getFormattedClock = (t: number) => {
    let tm: { s: number; m: number; h: number } = { s: t, m: 0, h: 0 };
    if (t >= 60) {
      tm.s = t % 60;
      tm.m = Math.floor(t / 60);
      t = tm.m;
    }
    if (t >= 60) {
      tm.m = t % 60;
      tm.h = Math.floor(t / 60);
      t = tm.h;
    }
    if (t >= 60) {
      tm.h = Math.round(t / 60);
    }

    let ts: string = "";

    if (tm.h > 0) {
      ts += padStart(tm.h.toString(), 2, "0") + ":";
    }

    ts += padStart(tm.m.toString(), 2, "0") + ":";
    ts += padStart(tm.s.toString(), 2, "0");
    return ts;
  };

  const renderResult = () => {
    return (
      <View>
        <Text style={styles.heading}>Quiz Results</Text>

        <View style={styles.chartBox}>
          <VictoryPie
            data={[
              { y: Math.round((result.correct * 100) / quiz.questions.length) },
              {
                y: Math.round(
                  ((result.answered - result.correct) * 100) /
                    quiz.questions.length
                ),
              },
              {
                y: Math.round(
                  ((quiz.questions.length - result.answered) * 100) /
                    quiz.questions.length
                ),
              },
            ]}
            width={250}
            height={250}
            innerRadius={87}
            colorScale={["#326D3C", "#DC2626", "#D1D5DB"]}
            style={{
              labels: {
                display: "none",
              },
            }}
          />

          <View style={{ position: "absolute", top: "33%" }}>
            <Text style={styles.midTextTitle}>{result.grade}%</Text>
            <View>
              <Text style={styles.midTextNote}>
                {result.correct}/{quiz.questions.length} Correct
              </Text>
            </View>
          </View>

          <View
            style={{
              ...styles.row,
              width: "100%",
              justifyContent: "space-between",
              padding: 10,
              paddingBottom: 20,
            }}
          >
            <View style={styles.row}>
              <View style={{ ...styles.dot, backgroundColor: "#326D3C" }} />
              <Text>Correct</Text>
            </View>
            <View style={styles.row}>
              <View style={{ ...styles.dot, backgroundColor: "#DC2626" }} />
              <Text>Incorrect</Text>
            </View>
            <View style={styles.row}>
              <View style={{ ...styles.dot, backgroundColor: "#D1D5DB" }} />
              <Text>Unanswered</Text>
            </View>
          </View>
        </View>

        <View style={{ ...styles.row, marginLeft: -10 }}>
          <View style={styles.resultBox}>
            <Text style={styles.resultNote}>Suggested Time per Question</Text>
            <Text style={styles.essayText}>
              {getFormattedClock(quiz.timePerQuestionInSeconds)}
            </Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultNote}>Average Time per Question</Text>
            <Text style={styles.essayText}>{getFormattedClock(10)}</Text>
          </View>
        </View>

        <View style={{ ...styles.row, marginLeft: -10 }}>
          <View style={styles.resultBox}>
            <Text style={styles.resultNote}>Time Limit</Text>
            <Text style={styles.essayText}>
              {getFormattedClock(quiz.timeLimitInSeconds)}
            </Text>
          </View>
          <View style={styles.resultBox}>
            <Text style={styles.resultNote}>Total Time</Text>
            <Text style={styles.essayText}>{getFormattedClock(130)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const isTimeBound: boolean = get(quiz, "imeLimitInSeconds", 0) > 0;
  const isAttemptBound: boolean = get(quiz, "maxAttempts", 0) > 0;

  return (
    <View>
      <Text style={styles.heading}>{quiz.title}</Text>
      {quiz.startMessage && (
        <Text style={styles.startMessage}>
          {quiz.startMessage.replace(/(<([^>]+)>)/gi, "")}
        </Text>
      )}
      {quiz.timeLimitInSeconds && (
        <View style={styles.row}>
          <View style={styles.quizBox}>
            <View style={{ ...styles.row, justifyContent: "flex-start" }}>
              <MaterialCommunityIcons
                name="timer-sand-complete"
                size={24}
                color="#374151"
                style={styles.quizBoxIcon}
              />
              <View>
                <Text style={styles.prenote}>Time Limit</Text>
                <Text style={styles.boldnote}>
                  {getFormattedTime(quiz.timeLimitInSeconds)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
      {quiz.questions?.length !== 0 && index === 0 && (
        <Button title="Start Quiz" onPress={() => setIndex(1)} />
      )}

      {!loading && index > 0 && !showResult && renderQuestion()}

      {loading && (
        <View style={styles.searching}>
          <Text style={styles.searchingText}>Loading results </Text>
          <Loader size={50} />
        </View>
      )}

      {!loading && showResult && renderResult()}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    textAlign: "center",
    padding: 8,
  },
  startMessage: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    paddingBottom: 10,
  },

  quizBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FCFCFF",
    padding: 10,
    width: "100%",
  },

  quizBoxIcon: {
    borderWidth: 1,
    padding: 3,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    backgroundColor: "#F3F4F6",
    marginRight: 5,
  },

  prenote: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: "#6B7280",
  },

  boldnote: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#1F2937",
  },

  questionBox: {
    paddingTop: 20,
  },

  questionText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#6B7280",
  },

  questionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#1F2937",
  },

  subTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#6B7280",
  },

  choiceBox: {
    padding: 16,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: "#FCFCFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
  },

  imageComparison: {
    flexDirection: "column",
    paddingLeft: 16,
    paddingRight: 16,
  },

  correctBox: {
    borderColor: "#326D3C",
    backgroundColor: "#326D3C22",
  },

  incorrectBox: {
    borderColor: "#DC2626",
    backgroundColor: "#DC262622",
  },

  textArea: {
    borderColor: "#D1D5DB",
    textAlignVertical: "top",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  answerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },

  answerTextBold: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    paddingRight: 10,
  },

  responseText: {
    marginTop: 5,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#6B7280",
  },

  essayText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#1F2937",
  },

  resultBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FCFCFF",
    padding: 5,
    width: "50%",
    margin: 5,
  },

  resultNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: "#6B7280",
    flexGrow: 0,
  },

  searching: {
    margin: 32,
    backgroundColor: "#3B1FA3",
    borderRadius: 10,
    paddingBottom: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  searchingText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: "Poppins_700Bold",
    padding: 20,
  },

  chartBox: {
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },

  midTextTitle: {
    marginLeft: 13,
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#1F2937",
  },

  midTextNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000000aa",
  },

  dot: {
    borderRadius: 10,
    width: 10,
    height: 10,
    marginLeft: 10,
    marginRight: 5,
  },
});

export default CourseQuiz;
