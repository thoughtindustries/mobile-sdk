import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { Button } from "../components";
import _ from "lodash";
import striptags from "striptags";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface CourseQuizProps {
  quiz: any;
}

const CourseQuiz = (props: CourseQuizProps) => {
  const [qIndex, setQIndex] = useState<number>(5);
  const [attempts, setAttempts] = useState<string[]>([]);

  //useEffect(() => console.log(JSON.stringify(props.quiz)), []);

  const saveAttempt = (ans: string, isMulti: boolean) => {
    let tmp = [...attempts];

    if (isMulti) {
      let ary: string[] = [];
      if (_.includes(_.get(tmp, qIndex, []), ans)) {
        ary = _.filter(_.get(tmp, qIndex, []), (a) => a !== ans);
      } else {
        ary.push(ans);
      }
      _.set(tmp, qIndex, ary);
    } else {
      if (!_.isUndefined(tmp[qIndex]) && tmp[qIndex] === ans) {
        _.remove(tmp, (v, idx) => idx === qIndex);
      } else {
        _.set(tmp, qIndex, ans);
      }
    }
    setAttempts([...tmp]);
  };

  const renderQuestion = () => {
    const question = _.get(props, `quiz.questions.${qIndex - 1}`, {});
    return (
      <View>
        {attempts.length === 0 && renderQuizInfo()}
        <View style={styles.questionBox}>
          {_.get(question, "preText", "") !== "" && (
            <Text style={styles.questionText}>
              {striptags(_.get(question, "preText", ""))}
            </Text>
          )}
          <Text style={styles.questionTitle}>
            {striptags(_.get(question, "body", ""))}
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
                defaultValue={_.get(attempts, qIndex, "")}
                style={styles.textArea}
                multiline={true}
                numberOfLines={6}
                placeholder="Fill in your answer"
              />
            </View>
          )}

          {_.get(question, "postText", "") !== "" && (
            <Text style={styles.questionText}>
              {striptags(_.get(question, "postText", ""))}
            </Text>
          )}

          {_.get(attempts, qIndex, []).length > 0 && (
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
                ...(_.get(attempts, qIndex, []).length > 0 &&
                _.get(attempts, qIndex, []).includes(choice.value)
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
                {_.isEmpty(choice.altText) ? choice.value : choice.altText}
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
                {getFormattedTime(props.quiz.timeLimitInSeconds)}
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
              <Text style={styles.boldnote}>{props.quiz.maxAttempts}</Text>
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

  const isTimeBound: boolean = _.get(props, "quiz.timeLimitInSeconds", 0) > 0;
  const isAttemptBound: boolean = _.get(props, "quiz.maxAttempts", 0) > 0;

  return (
    <View>
      {qIndex === 0 && (
        <>
          <Text style={styles.heading}>
            {_.get(props, "quiz.title", "Quiz")}
          </Text>
          {!_.isEmpty(_.get(props, "quiz.startMessage", "")) && (
            <Text style={styles.startMessage}>
              {striptags(props.quiz.startMessage)}
            </Text>
          )}

          {renderQuizInfo()}

          {_.get(props, "quiz.questions.length", 0) > 0 && (
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
