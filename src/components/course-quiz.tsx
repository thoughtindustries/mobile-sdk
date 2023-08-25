import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, LoadingBanner, QuizQuestion, QuizResults } from ".";
import {
  useLoadAssessmentAttemptWithQuestionsQuery,
  useLoadAssessmentAttemptsByTopicOrCourseQuery,
} from "../graphql";
import { useQuizContext } from "../context";
import { fonts, scaleDimension, theme } from "../utils";

interface CourseQuizProps {
  courseid: string;
  quiz: any;
}

const CourseQuiz = ({ quiz, courseid }: CourseQuizProps) => {
  const [query, setQuery] = useState<boolean>(false);
  const { initQuiz, setInitQuiz, setAttemptId, result, setQuiz, setResult } =
    useQuizContext();

  const { data, loading: assessmentLoading } =
    useLoadAssessmentAttemptWithQuestionsQuery({
      skip: !query,
      variables: {
        courseId: courseid,
        id: quiz?.id,
        topicType: "quiz",
      },
    });

  const {
    loading: assessmentDataLoading,
    data: assessmentData,
    error: assessmentDataError,
    refetch,
  } = useLoadAssessmentAttemptsByTopicOrCourseQuery({
    variables: {
      courseId: courseid,
      topicId: quiz.id,
    },
  });

  useEffect(() => {
    refetch();
    if (
      !assessmentDataLoading &&
      !assessmentDataError &&
      assessmentData &&
      assessmentData.LoadAssessmentAttemptsByTopicOrCourse.length > 0
    ) {
      assessmentData.LoadAssessmentAttemptsByTopicOrCourse.every((item) => {
        if (item.status === "finished") {
          setResult({
            grade: item.grade,
            answered: item.answeredQuestionsCount,
            correct: item.correctQuestionsCount,
          });
          return false;
        }

        return true;
      });
    } else {
      setQuery(true);
    }
  }, [assessmentDataLoading, assessmentDataError, assessmentData, refetch]);

  const startQuiz = () => {
    setInitQuiz(true);
    setAttemptId(data?.LoadAssessmentAttemptWithQuestions.id || "");
  };

  useEffect(() => {
    setQuiz(quiz);
  }, [quiz]);

  const QuizHeader: FC = () => (
    <View style={styles.quizHeader}>
      <Text style={styles.heading}>{quiz?.title}</Text>
      {quiz?.startMessage && (
        <Text style={styles.startMessage}>
          {quiz?.startMessage.replace(/(<([^>]+)>)/gi, "")}
        </Text>
      )}
      <View style={styles.quizButton}>
        <Button
          title={`${assessmentLoading ? "Loading..." : "Start Quiz"}`}
          onPress={() => startQuiz()}
          disabled={assessmentLoading}
        />
      </View>
    </View>
  );

  return (
    <View>
      {result ? (
        <QuizResults />
      ) : initQuiz ? (
        <View>
          <QuizQuestion quiz={quiz} />
        </View>
      ) : assessmentDataLoading ? (
        <LoadingBanner />
      ) : (
        <QuizHeader />
      )}
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
    fontFamily: fonts.poppins.bold,
    fontSize: scaleDimension(12, false),
    textAlign: "center",
    padding: scaleDimension(6, false),
  },
  startMessage: {
    fontFamily: fonts.poppins.regular,
    fontSize: scaleDimension(8, false),
    textAlign: "center",
    color: theme.text["text-secondary"],
    paddingBottom: scaleDimension(6, false),
  },
  quizHeader: {
    height: "100%",
  },
  quizButton: {
    position: "absolute",
    bottom: scaleDimension(10, true),
    width: "100%",
  },
});

export default CourseQuiz;
