import { createContext, useContext, useState, ReactNode } from "react";

interface QuizResult {
  grade: number | undefined;
  answered: number | undefined;
  correct: number | undefined;
}

interface QuizProps {
  setInitQuiz: (initQuiz: boolean) => void;
  initQuiz: boolean;
  setAttemptId: (attemptId: string) => void;
  attemptId: string;
  setResult: (result: QuizResult) => void;
  result: QuizResult | undefined;
  setQuiz: (quiz: any) => void;
  quiz: any;
}

interface QuizProviderProps {
  children: ReactNode;
}

const QuizContext = createContext<QuizProps>({
  setInitQuiz: () => undefined,
  initQuiz: false,
  setAttemptId: () => undefined,
  attemptId: "",
  setResult: () => undefined,
  result: {
    grade: 0,
    answered: 0,
    correct: 0,
  },
  setQuiz: () => undefined,
  quiz: {},
});

export const useQuizContext = () => useContext(QuizContext);

export const QuizProvider = ({ children }: QuizProviderProps) => {
  const [initQuiz, setInitQuiz] = useState<boolean>(false);
  const [attemptId, setAttemptId] = useState<string>("");
  const [result, setResult] = useState<QuizResult>();
  const [quiz, setQuiz] = useState<any>({});

  return (
    <QuizContext.Provider
      value={{
        setInitQuiz: setInitQuiz,
        initQuiz: initQuiz,
        setAttemptId: setAttemptId,
        attemptId: attemptId,
        setResult,
        result,
        setQuiz,
        quiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
