import React, { useState } from "react";
import { Preview } from "../Preview";
import { Questionnaire, QuestionDef } from "../../../../packages/core/src/components/Questionnaire";


const RISK_QUESTIONS: QuestionDef[] = [
  {
    id: "horizon",
    prompt: "When do you expect to start withdrawing from this account?",
    description: "This shapes how much time your investments have to recover from a downturn.",
    options: [
      { value: "lt5", label: "Less than 5 years" },
      { value: "5to15", label: "5–15 years" },
      { value: "gt15", label: "More than 15 years" },
    ],
  },
  {
    id: "reaction",
    prompt: "If your balance dropped 15% in a month, what would you do?",
    options: [
      { value: "sell", label: "Move to safer investments" },
      { value: "hold", label: "Hold and wait it out" },
      { value: "buy", label: "See it as a buying opportunity" },
    ],
  },
  {
    id: "experience",
    prompt: "How would you describe your investing experience?",
    options: [
      { value: "new", label: "New to investing" },
      { value: "some", label: "Some experience" },
      { value: "experienced", label: "Experienced" },
    ],
  },
];

export default function QuestionnairePage() {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <h1 className="site-h1">Questionnaire</h1>
      <p className="site-lede">
        A single-question-per-step assessment flow — e.g. a retirement risk-tolerance questionnaire. Composed
        entirely from existing primitives (<code>Progress</code> + <code>RadioGroup</code> + <code>Button</code>),
        not a new interaction model — every accessibility property (labeling, focus, keyboard) is inherited from
        those, not reinvented.
      </p>

      <h2 className="site-section-title" id="preview">Interactive preview</h2>
      <div className="site-panel site-panel--flush">
        <div className="preview-surface" data-theme="core" data-mode="light" style={{ background: "var(--core-color-bg-page)", padding: 24 }}>
          <div style={{ width: 360, padding: 20, border: "1px solid var(--core-color-border-subtle)", borderRadius: "var(--core-card-radius)", background: "var(--core-card-bg)" }}>
            <Questionnaire
              title="Risk tolerance"
              questions={RISK_QUESTIONS}
              answers={answers}
              currentIndex={i}
              onAnswer={(id, v) => setAnswers((prev) => ({ ...prev, [id]: v }))}
              onBack={() => setI((n) => Math.max(0, n - 1))}
              onNext={() => setI((n) => Math.min(RISK_QUESTIONS.length - 1, n + 1))}
              onSubmit={() => setSubmitted(true)}
            />
          </div>
        </div>
      </div>

      {submitted && (
        <div className="site-panel site-panel--flush" style={{ padding: 20 }}>
          <strong>Submitted:</strong> {JSON.stringify(answers)}
        </div>
      )}
    </div>
  );
}
