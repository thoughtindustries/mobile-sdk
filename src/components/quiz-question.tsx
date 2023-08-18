import { useState } from "react";
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
import { useUpdateAssessmentAttemptMutation } from "../graphql";
import { useQuizContext } from "../test";

interface Answer {
  value: string | undefined;
  correct: boolean | undefined;
  idx: number | undefined;
}

interface Quiz {
  quiz: any;
}

const QuizQuestion = ({ quiz }: Quiz) => {
  const { attemptId, setResult } = useQuizContext();
  const [index, setIndex] = useState<number>(0);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<Answer>({
    value: undefined,
    correct: undefined,
    idx: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const { width } = useWindowDimensions();
  const question = quiz?.questions[index];
  const questionType = question?.questionType;

  const [updateAssessmentAttemptMutation] =
    useUpdateAssessmentAttemptMutation();

  const handleAttempt = (value: string, idx: number) => {
    const answer: Answer = {
      correct: question.choices[idx].correct,
      idx: idx,
      value: value,
    };
    setAttempt(answer);
    setAnswers([...answers, answer]);
    setShowButton(true);
  };

  const handleNextQuestion = async () => {
    try {
      setLoading(true);
      await updateAssessmentAttemptMutation({
        variables: {
          assessmentAttempt: {
            id: attemptId,
            status: "started",
          },
          activeQuestion: {
            body: question.body,
            mustSelectAllCorrectChoices: question.mustSelectAllCorrectChoices,
            selectedChoice: {
              value: attempt.value,
              correct: attempt.correct,
            },
          },
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Attempt submission error: ", error);
    }
    setIndex(index + 1);
    setAttempt({ correct: undefined, idx: index, value: undefined });
    setShowButton(false);
  };

  const handleSubmission = async () => {
    try {
      setLoading(true);
      const { data } = await updateAssessmentAttemptMutation({
        variables: {
          assessmentAttempt: {
            id: attemptId,
            status: "finished",
          },
        },
      });
      setResult({
        grade: data?.UpdateAssessmentAttempt.grade,
        answered: data?.UpdateAssessmentAttempt.answeredQuestionsCount,
        correct: data?.UpdateAssessmentAttempt.correctQuestionsCount,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Quiz submission error: ", error);
    }
  };

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
            onPress={() => handleAttempt(choice.value, idx)}
            disabled={attempt.correct !== undefined}
            style={{
              ...styles.imageComparison,
              backgroundColor:
                attempt.correct === true && attempt.idx === idx
                  ? "#DCE5DF"
                  : attempt.correct === false && attempt.idx === idx
                  ? "#F7DADD"
                  : "#FCFCFF",
              borderColor:
                attempt.correct === true && attempt.idx === idx
                  ? "#326D3C"
                  : attempt.correct === false && attempt.idx === idx
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
            {attempt.correct !== undefined &&
              attempt.idx === idx &&
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
                ? loading
                  ? "Loading..."
                  : "Next Question"
                : loading
                ? "Loading..."
                : "See Results"
            }`}
            onPress={
              index < quiz?.questions.length - 1
                ? handleNextQuestion
                : handleSubmission
            }
            disabled={loading}
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
