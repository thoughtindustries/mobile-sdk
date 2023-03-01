import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { Button } from "../components";
import {
  get,
  filter,
  includes,
  set,
  isUndefined,
  remove,
  isEmpty,
} from "lodash";
import striptags from "striptags";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface CourseQuizProps {
  quiz: any;
}

const CourseQuiz = ({ quiz }: CourseQuizProps) => {
  const [qIndex, setQIndex] = useState<number>(5);
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
    const question = get(quiz, `quiz.questions.${qIndex - 1}`, {});
    return (
      <View>
        {attempts.length === 0 && renderQuizInfo()}
        <View style={styles.questionBox}>
          {get(question, "preText", "") !== "" && (
            <Text style={styles.questionText}>
              {striptags(get(question, "preText", ""))}
            </Text>
          )}
          <Text style={styles.questionTitle}>
            {striptags(get(question, "body", ""))}
          </Text>

          {question.type === "multipleChoice" && (
            <View style={{ marginTop: 16 }}>
              {renderChoice(question.choices, true)}
            </View>
          )}

          {question.type === "booleanChoice" && (
            <View style={{ marginTop: 16 }}>
              {renderChoice(question.choices, false)}
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

          {get(question, "postText", "") !== "" && (
            <Text style={styles.questionText}>
              {striptags(get(question, "postText", ""))}
            </Text>
          )}

          {get(attempts, qIndex, []).length > 0 && (
            <Button
              title="Next Question"
              onPress={() => setQIndex(qIndex + 1)}
            />
          )}
        </View>
      </View>
    );
  };

  const renderChoice = (choices, isMulti: boolean) => {
    return (
      <>
        {choices.map((choice, idx: number) => (
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
              }}
            >
              <Text style={styles.answerTextBold}>
                {String.fromCharCode(65 + idx)}.
              </Text>
              <Text style={styles.answerText}>
                {isEmpty(choice.altText) ? choice.value : choice.altText}
              </Text>
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

  const isTimeBound: boolean = get(quiz, "quiz.timeLimitInSeconds", 0) > 0;
  const isAttemptBound: boolean = get(quiz, "quiz.maxAttempts", 0) > 0;

  return (
    <View>
      {qIndex === 0 && (
        <>
          <Text style={styles.heading}>{get(quiz, "quiz.title", "Quiz")}</Text>
          {!isEmpty(get(quiz, "quiz.startMessage", "")) && (
            <Text style={styles.startMessage}>
              {striptags(quiz.startMessage)}
            </Text>
          )}

          {renderQuizInfo()}

          {get(quiz, "quiz.questions.length", 0) > 0 && (
            <Button title="Start Quiz" onPress={() => setQIndex(1)} />
          )}
        </>
      )}

      {qIndex > 0 && renderQuestion()}
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
});

export default CourseQuiz;
