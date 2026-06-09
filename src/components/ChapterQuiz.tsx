import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { cn } from "../lib/utils";

type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    prompt: "En F19, ¿cuál es el resultado de 11 + 17?",
    options: ["28", "9", "17", "0"],
    answer: 1,
    explanation: "Primero sumas como enteros y luego aplicas modulo: 28 % 19 = 9.",
  },
  {
    prompt: "¿Por qué se usa un modulo primo para estos campos?",
    options: [
      "Porque garantiza inversos multiplicativos para todo elemento no cero.",
      "Porque hace que todas las operaciones sean mas rapidas que la suma normal.",
      "Porque evita que existan elementos negativos.",
      "Porque Bitcoin solo acepta numeros menores que 19.",
    ],
    answer: 0,
    explanation:
      "En un campo de orden primo, cada elemento distinto de cero tiene inverso multiplicativo.",
  },
  {
    prompt: "¿Qué significa dividir a / b dentro de un campo finito?",
    options: [
      "Calcular un decimal y redondearlo.",
      "Restar b repetidas veces hasta llegar a a.",
      "Multiplicar a por el inverso multiplicativo de b.",
      "Usar division entera de Python.",
    ],
    answer: 2,
    explanation: "La division se define como a * b^(-1), siempre que b no sea cero.",
  },
  {
    prompt: "Según el pequeño teorema de Fermat, si p es primo y n no es cero, ¿qué vale n^(p-1) % p?",
    options: ["0", "1", "p - 1", "n"],
    answer: 1,
    explanation: "Ese resultado permite calcular inversos con n^(p-2) dentro de Fp.",
  },
  {
    prompt: "En la clase FieldElement, ¿qué se debe validar antes de sumar dos elementos?",
    options: [
      "Que tengan el mismo prime.",
      "Que ambos numeros sean pares.",
      "Que el resultado no use modulo.",
      "Que el exponente sea positivo.",
    ],
    answer: 0,
    explanation:
      "Sumar elementos de campos distintos no tiene significado dentro de esta abstraccion.",
  },
];

export function ChapterQuiz() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      return total + (answers[index] === question.answer ? 1 : 0);
    }, 0);
  }, [answers]);

  const complete = answeredCount === questions.length;

  return (
    <section
      id="test-final"
      className="mt-14 rounded-lg border border-amber-200/70 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-200/70 pb-4 dark:border-amber-900/50">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Test final
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-950 dark:text-stone-50">
            Comprueba si ya dominas los campos finitos
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-700 dark:text-stone-300">
            Responde sin mirar las formulas. Si fallas una, usa la explicacion como pista y vuelve al subtema correspondiente.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-stone-800 shadow-sm dark:border-amber-900/60 dark:bg-stone-950 dark:text-stone-100">
          <span data-testid="chapter-quiz-score">
          {score}/{questions.length}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === question.answer;

          return (
            <div key={question.prompt} className="rounded-lg bg-white p-4 shadow-sm dark:bg-stone-900">
              <p className="text-sm font-semibold leading-6 text-stone-900 dark:text-stone-100">
                {questionIndex + 1}. {question.prompt}
              </p>

              <div className="mt-3 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const selectedOption = selected === optionIndex;
                  const correctOption = question.answer === optionIndex;

                  return (
                    <button
                      key={option}
                      type="button"
                      data-testid={`quiz-option-${questionIndex}-${optionIndex}`}
                      onClick={() =>
                        setAnswers((current) => ({
                          ...current,
                          [questionIndex]: optionIndex,
                        }))
                      }
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-all",
                        selectedOption
                          ? isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100"
                            : "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100"
                          : "border-stone-200 bg-stone-50 text-stone-700 hover:border-amber-300 hover:bg-amber-50 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:border-amber-800 dark:hover:bg-amber-950/20",
                      )}
                    >
                      <span>{option}</span>
                      {hasAnswered && selectedOption && isCorrect ? (
                        <CheckCircle2 className="size-4 shrink-0" />
                      ) : null}
                      {hasAnswered && selectedOption && !isCorrect ? (
                        <XCircle className="size-4 shrink-0" />
                      ) : null}
                      {hasAnswered && !selectedOption && correctOption ? (
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {hasAnswered ? (
                <p
                  className={cn(
                    "mt-3 rounded-lg px-3 py-2 text-sm leading-6",
                    isCorrect
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100"
                      : "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-100",
                  )}
                >
                  {question.explanation}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/70 pt-4 dark:border-amber-900/50">
        <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {complete
            ? score === questions.length
              ? "Perfecto: ya puedes pasar al capitulo 2 con buena base."
              : "Buen intento: repasa las preguntas fallidas y vuelve a intentarlo."
            : `Has respondido ${answeredCount} de ${questions.length}.`}
        </p>
        <button
          type="button"
          onClick={() => setAnswers({})}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-250 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-850"
        >
          <RotateCcw className="size-4" />
          Reiniciar
        </button>
      </div>
    </section>
  );
}
