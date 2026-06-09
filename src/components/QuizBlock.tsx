import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "../lib/utils";

export type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export function QuizBlock({ questions }: { questions: Question[] }) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const complete = answeredCount === questions.length;
  const progressValue = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  if (questions.length === 0) return null;

  return (
    <Card
      id="test-final"
      className="mt-14 border-warning/30 bg-warning/5 not-prose"
    >
      <CardHeader className="border-b border-warning/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-warning-foreground">
              {t("quiz.finalTest")}
            </p>
            <CardTitle className="mt-1 text-2xl">{t("quiz.title")}</CardTitle>
            <CardDescription className="mt-2 max-w-2xl text-sm leading-6">
              {t("quiz.description")}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold">
            {score}/{questions.length}
          </Badge>
        </div>
        <Progress className="mt-4" value={progressValue} />
      </CardHeader>

      <CardContent className="space-y-5 pt-5">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === question.answer;

          return (
            <Card key={question.prompt}>
              <CardContent className="p-4">
                <p className="text-sm font-semibold leading-6 text-foreground">
                  {questionIndex + 1}. {question.prompt}
                </p>

                <div className="mt-3 grid gap-2">
                  {question.options.map((option, optionIndex) => {
                    const selectedOption = selected === optionIndex;
                    const correctOption = question.answer === optionIndex;

                    return (
                      <Button
                        key={option}
                        type="button"
                        onClick={() =>
                          setAnswers((current) => ({
                            ...current,
                            [questionIndex]: optionIndex,
                          }))
                        }
                        className={cn(
                          "h-auto w-full justify-between gap-3 px-3 py-2 text-left text-sm font-normal",
                          selectedOption
                            ? isCorrect
                              ? "border-success/40 bg-success/10 text-success-foreground hover:bg-success/10"
                              : "border-destructive/40 bg-destructive/10 text-destructive-foreground hover:bg-destructive/10"
                            : hasAnswered && correctOption
                              ? "border-success/30 bg-success/5 text-success-foreground"
                              : undefined,
                        )}
                        variant="outline"
                      >
                        <span>{option}</span>
                        {hasAnswered && selectedOption && isCorrect ? (
                          <CheckCircle2 className="size-4 shrink-0" />
                        ) : null}
                        {hasAnswered && selectedOption && !isCorrect ? (
                          <XCircle className="size-4 shrink-0" />
                        ) : null}
                        {hasAnswered && !selectedOption && correctOption ? (
                          <CheckCircle2 className="size-4 shrink-0 text-success" />
                        ) : null}
                      </Button>
                    );
                  })}
                </div>

                {hasAnswered ? (
                  <Alert
                    className="mt-3"
                    variant={isCorrect ? "success" : "error"}
                  >
                    <AlertDescription className="text-sm leading-6 text-foreground">
                      {question.explanation}
                    </AlertDescription>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </CardContent>

      <CardContent className="flex flex-wrap items-center justify-between gap-3 border-t border-warning/20 pt-4">
        <p className="text-sm font-medium text-muted-foreground">
          {complete
            ? score === questions.length
              ? t("quiz.perfect")
              : t("quiz.good")
            : t("quiz.progress", {
                answered: answeredCount,
                total: questions.length,
              })}
        </p>
        <Button onClick={() => setAnswers({})} type="button" variant="outline">
          <RotateCcw className="size-4" />
          {t("quiz.restart")}
        </Button>
      </CardContent>
    </Card>
  );
}
