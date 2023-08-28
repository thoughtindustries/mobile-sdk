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
import { useQuizContext } from "../context";
import { AssessmentAttemptStatus } from "../graphql/global-types";
import { fonts, scaleDimension, theme } from "../utils";

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
            status: AssessmentAttemptStatus.started,
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
            status: AssessmentAttemptStatus.finished,
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
      {questionType === "imageComparison" ||
      questionType === "multipleChoice" ||
      questionType === "booleanChoice" ? (
        <>
          {question?.preText && <Text>{striptags(question?.preText)}</Text>}
          <Text style={styles.questionTitle}>{striptags(question?.body)}</Text>
          {question?.postText && (
            <Text style={styles.questionText}>
              {striptags(question?.postText)}
            </Text>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            {question?.choices.map((choice: QuestionChoice, idx: number) => (
              <TouchableOpacity
                key={choice.choiceId}
                onPress={() => handleAttempt(choice.value, idx)}
                disabled={attempt.correct !== undefined}
                style={[
                  styles.choice,
                  {
                    backgroundColor:
                      attempt.correct === true && attempt.idx === idx
                        ? theme.surface["surface-success"]
                        : attempt.correct === false && attempt.idx === idx
                        ? theme.surface["surface-error"]
                        : theme.surface["surface-200"],
                    borderColor:
                      attempt.correct === true && attempt.idx === idx
                        ? theme.border["border-success"]
                        : attempt.correct === false && attempt.idx === idx
                        ? theme.border["border-error"]
                        : theme.border["border-100"],
                  },
                ]}
              >
                {questionType === "imageComparison" && (
                  <ImageBackground
                    source={{ uri: choice.asset }}
                    resizeMode="cover"
                    style={styles.image}
                  />
                )}
                <Text style={styles.choiceValue}>{`${idx + 1}. ${
                  choice.value
                }`}</Text>
                {attempt.correct !== undefined &&
                  attempt.idx === idx &&
                  choice.response && (
                    <Text style={styles.rejoinder}>
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
            <View style={styles.questionButton}>
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
        </>
      ) : (
        <View>
          <Text>{`The ${questionType} quiz type is currently not supported.`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  answerText: {
    fontFamily: fonts.inter.regular,
    fontSize: scaleDimension(14, true),
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
  },
  choice: {
    paddingVertical: scaleDimension(20, true),
    paddingHorizontal: scaleDimension(20, true),
    marginBottom: scaleDimension(20, true),
    borderRadius: scaleDimension(8, true),
    borderWidth: 1,
    borderColor: theme.border["border-100"],
  },
  choiceValue: {
    margin: scaleDimension(-4, true),
  },
  rejoinder: {
    color: theme.text["text-primary"],
    opacity: 0.5,
    marginBottom: scaleDimension(-16, true),
  },
  image: {
    height: scaleDimension(50, false),
    width: "100%",
    marginBottom: scaleDimension(10, true),
  },
  questionText: {
    fontFamily: fonts.poppins.regular,
    fontSize: scaleDimension(16, true),
    color: theme.text["text-secondary"],
  },
  questionTitle: {
    fontFamily: fonts.inter.bold,
    fontSize: scaleDimension(20, true),
    color: theme.text["text-primary"],
    marginBottom: scaleDimension(15, false),
  },
  questionButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

export default QuizQuestion;
