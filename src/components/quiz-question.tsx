import { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import striptags from "striptags";
import { QuestionChoice } from "../../types";
import Button from "./button";
import RenderHtml from "react-native-render-html";

const QuizQuestion: FC<{ quiz: any }> = ({ quiz }) => {
  const [index, setIndex] = useState<number>(0);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [answer, setAnswer] = useState<{
    correct: boolean | undefined;
    idx: number;
  }>({ correct: undefined, idx: 0 });
  const { width } = useWindowDimensions();
  const question = quiz?.questions[index];
  const questionType = question?.questionType;

  const handleAnswer = (idx: number) => {
    setAnswer({ correct: question.choices[idx].correct, idx: idx });
    setShowButton(true);
  };

  const handleNextQuestion = () => {
    setIndex(index + 1);
    setShowButton(false);
  };

  const handleSubmission = () => {};

  return (
    <View style={styles.container}>
      {question?.preText && <Text>{striptags(question?.preText)}</Text>}
      <Text style={styles.questionTitle}>{striptags(question?.body)}</Text>
      {question?.postText && (
        <Text style={styles.questionText}>{striptags(question?.postText)}</Text>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: showButton ? 80 : 15 }}
      >
        {question?.choices.map((choice: QuestionChoice, idx: number) => (
          <TouchableOpacity
            key={choice.choiceId}
            onPress={() => handleAnswer(idx)}
            disabled={answer.correct !== undefined}
            style={{
              ...styles.imageComparison,
              backgroundColor:
                answer.correct === true && answer.idx === idx
                  ? "#DCE5DF"
                  : answer.correct === false && answer.idx === idx
                  ? "#F7DADD"
                  : '"#FCFCFF"',
              borderColor:
                answer.correct === true && answer.idx === idx
                  ? "#326D3C"
                  : answer.correct === false && answer.idx === idx
                  ? "#DC2626"
                  : "#E5E7EB",
            }}
          >
            {questionType === "imageComparison" && (
              <ImageBackground
                source={{ uri: choice.asset }}
                resizeMode="cover"
                style={styles.image}
              />
            )}
            <Text style={{ marginLeft: -4 }}>{`${idx + 1}. ${
              choice.value
            }`}</Text>
            {answer.correct !== undefined &&
              answer.idx === idx &&
              choice.response && (
                <Text
                  style={{
                    color: "#737373",
                    opacity: 0.5,
                    marginBottom: -16,
                  }}
                >
                  <RenderHtml
                    source={{
                      html: choice.response,
                    }}
                    contentWidth={width}
                  />
                </Text>
              )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {showButton && (
        <View style={{ position: "absolute", bottom: 50, width: "100%" }}>
          <Button
            title={`${
              index < quiz?.questions.length - 1
                ? "Next Question"
                : "See Results"
            }`}
            onPress={
              index < quiz?.questions.length - 1
                ? handleNextQuestion
                : handleSubmission
            }
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  answerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    height: "88%",
  },
  imageComparison: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    height: 100,
    width: "100%",
    marginBottom: 10,
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
    marginBottom: 30,
  },
});

export default QuizQuestion;
