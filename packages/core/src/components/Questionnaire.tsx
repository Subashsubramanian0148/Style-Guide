import React from "react";
import { Button } from "./Button";
import { RadioGroup, RadioGroupOption } from "./FormControls";
import { Progress } from "./DataDisplay";

/**
 * A single-question-per-step assessment flow (e.g. a retirement risk
 * tolerance questionnaire) — composed from existing primitives (Progress +
 * RadioGroup + Button), not a new interaction model. One question is shown
 * at a time so a long assessment never reads as one overwhelming form.
 */
export interface QuestionOption extends RadioGroupOption {}
export interface QuestionDef {
  id: string;
  prompt: string;
  description?: string;
  options: QuestionOption[];
}

export interface QuestionnaireProps {
  title: string;
  questions: QuestionDef[];
  answers: Record<string, string>;
  currentIndex: number;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function Questionnaire({ title, questions, answers, currentIndex, onAnswer, onBack, onNext, onSubmit }: QuestionnaireProps) {
  const q = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;
  const canProceed = !!answers[q.id];
  const percent = Math.round(((currentIndex + (canProceed ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="cds-questionnaire" role="form" aria-labelledby="cds-questionnaire-title">
      <div className="cds-questionnaire-header">
        <span id="cds-questionnaire-title" className="cds-questionnaire-title">{title}</span>
        <span className="cds-questionnaire-count">Question {currentIndex + 1} of {questions.length}</span>
      </div>
      <Progress value={percent} label={`${percent}% complete`} />

      <div className="cds-questionnaire-body" key={q.id}>
        <h3 className="cds-questionnaire-prompt">{q.prompt}</h3>
        {q.description && <p className="cds-questionnaire-desc">{q.description}</p>}
        <RadioGroup name={q.id} value={answers[q.id] ?? ""} onChange={(v) => onAnswer(q.id, v)} options={q.options} />
      </div>

      <div className="cds-questionnaire-actions">
        <Button variant="secondary" onClick={onBack} disabled={isFirst}>Back</Button>
        <Button onClick={isLast ? onSubmit : onNext} disabled={!canProceed}>{isLast ? "Submit" : "Next"}</Button>
      </div>
    </div>
  );
}
