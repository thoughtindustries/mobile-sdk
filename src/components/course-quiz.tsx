import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, LoadingBanner, QuizQuestion, QuizResults } from ".";
import {
  useLoadAssessmentAttemptWithQuestionsQuery,
  useLoadAssessmentAttemptsByTopicOrCourseQuery,
} from "../graphql";
import { useQuizContext } from "../context";

interface CourseQuizProps {
  courseid: string;
  quiz: any;
}

const CourseQuiz: FC<CourseQuizProps> = ({ quiz, courseid }) => {
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
      topicId: quiz?.id,
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
    setAttemptId(data?.LoadAssessmentAttemptWithQuestions.id);
  };

  useEffect(() => {
    setQuiz(quiz);
  }, [quiz]);

  const QuizHeader: FC = () => (
    <View style={{ height: "100%" }}>
      <Text style={styles.heading}>{quiz?.title}</Text>
      {quiz?.startMessage && (
        <Text style={styles.startMessage}>
          {quiz?.startMessage.replace(/(<([^>]+)>)/gi, "")}
        </Text>
      )}
      <View style={{ position: "absolute", bottom: 10, width: "100%" }}>
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
    marginBottom: 20,
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
});

export default CourseQuiz;
