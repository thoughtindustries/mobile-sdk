import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ImageBackground,
} from "react-native";
import { Button } from "../components";
import {
  get,
  filter,
  includes,
  set,
  isUndefined,
  remove,
  isEmpty,
  padStart,
} from "lodash";
import striptags from "striptags";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { questionChoice } from "../../types";

interface CourseQuizProps {
  quiz: any;
}

const CourseQuiz = ({ quiz }: CourseQuizProps) => {
  console.log(JSON.stringify(quiz));
  const [qIndex, setQIndex] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<string[]>([]);

  const saveAttempt = (answer: string, isMulti: boolean) => {
    let temp = [...attempts];

    if (isMulti) {
      let answers: string[] = [];
      if (includes(get(temp, qIndex, []), answer)) {
        answers = filter(get(temp, qIndex, []), (a) => a !== answer);
      } else {
        answers.push(answer);
      }
      set(temp, qIndex, answers);
    } else {
      if (!isUndefined(temp[qIndex]) && temp[qIndex] === answer) {
        remove(temp, (v, idx) => idx === qIndex);
      } else {
        set(temp, qIndex, answer);
      }
    }
    setAttempts([...temp]);
  };

  const renderQuestion = () => {
    const question = get(quiz, `questions.${qIndex - 1}`, {});

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
        {attempts.length === 0 && renderQuizInfo()}
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
                defaultValue={get(attempts, qIndex, "")}
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

          {question.type === "fileSubmission" && (
            <View style={{ marginTop: 16 }}>
              <Button
                title="Upload File"
                mode={2}
                onPress={() => setQIndex(qIndex + 1)}
              />
            </View>
          )}

          {qIndex < quiz.questions.length && (
            <View
              style={
                quiz.questionSkipEnabled && get(attempts, qIndex, []).length > 0
                  ? styles.row
                  : {}
              }
            >
              {quiz.questionSkipEnabled && (
                <Button
                  title="Skip Question"
                  mode={2}
                  onPress={() => setQIndex(qIndex + 1)}
                />
              )}

              {get(attempts, qIndex, []).length > 0 && (
                <Button
                  title="Next Question"
                  onPress={() => setQIndex(qIndex + 1)}
                />
              )}
            </View>
          )}

          {postText()}

          {qIndex >= quiz.questions.length && (
            <Button title="See Results" onPress={() => setShowResult(true)} />
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
                ...(get(attempts, qIndex, []).length > 0 &&
                get(attempts, qIndex, []).includes(choice.value)
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

                {get(attempts, qIndex, []).includes(choice.value) &&
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
      {isTimeBound && (
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
      )}

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
      <View style={styles.questionBox}>
        <Text style={styles.heading}>Quiz Results</Text>

        <View style={{ ...styles.row, marginLeft: -20 }}>
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

        <View style={{ ...styles.row, marginLeft: -20 }}>
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
      {qIndex === 0 && (
        <>
          <Text style={styles.heading}>{get(quiz, "title", "Quiz")}</Text>
          {!isEmpty(get(quiz, "startMessage", "")) && (
            <Text style={styles.startMessage}>
              {striptags(quiz.startMessage)}
            </Text>
          )}

          {renderQuizInfo()}

          {get(quiz, "questions.length", 0) > 0 && (
            <Button title="Start Quiz" onPress={() => setQIndex(1)} />
          )}
        </>
      )}

      {qIndex > 0 && !showResult && renderQuestion()}

      {showResult && renderResult()}
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
});

export default CourseQuiz;
