import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { uploadPdf } from "../services/aiService";
import type { NotesResult, MCQ } from "../types/ai";

type Tab = "summary" | "flashcards" | "mcqs";

export default function AiAssistantPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<NotesResult | null>(null);
  const [tab, setTab] = useState<Tab>("summary");

  const upload = useMutation({
    mutationFn: () => uploadPdf(file as File),
    onSuccess: (data) => {
      setResult(data);
      setTab("summary");
    },
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-deep">
          AI learning assistant
        </p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">
          Study smarter
        </h1>
        <p className="mt-2 text-slate">
          Upload a lecture PDF and get an instant summary, flashcards, and
          practice questions generated from its content.
        </p>

        {/* Upload card */}
        <div className="mt-6 rounded-lg border border-dashed border-ink/25 bg-white p-6">
          <input
            id="pdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-slate file:mr-4 file:rounded-md
                       file:border-0 file:bg-ink file:px-4 file:py-2 file:text-parchment
                       hover:file:bg-ink-soft"
          />
          {file && (
            <p className="mt-3 text-sm text-slate">
              Selected: <span className="font-medium text-ink">{file.name}</span>
            </p>
          )}
          <button
            className="btn-primary mt-4"
            disabled={!file || upload.isPending}
            onClick={() => upload.mutate()}
          >
            {upload.isPending ? "Generating… (this can take up to a minute)" : "Generate study aids"}
          </button>
          {upload.isError && (
            <p className="mt-3 text-sm text-red-600">
              Something went wrong. Make sure the AI service is running on port 8000
              and your Gemini key is set.
            </p>
          )}
        </div>

        {/* Results */}
        {result && result.status === "FAILED" && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
            {result.error ?? "Generation failed."}
          </div>
        )}

        {result && result.status === "COMPLETE" && result.assets && (
          <div className="mt-6">
            <div className="flex gap-2 border-b border-ink/10">
              {(["summary", "flashcards", "mcqs"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    tab === t
                      ? "border-b-2 border-amber text-ink"
                      : "text-slate hover:text-ink"
                  }`}
                >
                  {t === "mcqs" ? "Quiz" : t}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {tab === "summary" && (
                <div className="rounded-lg border border-ink/10 bg-white p-5 leading-relaxed text-ink-soft whitespace-pre-wrap">
                  {result.assets.summary}
                </div>
              )}

              {tab === "flashcards" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.assets.flashcards.map((fc, i) => (
                    <Flashcard key={i} q={fc.question} a={fc.answer} />
                  ))}
                </div>
              )}

              {tab === "mcqs" && (
                <div className="space-y-4">
                  {result.assets.mcqs.map((m, i) => (
                    <McqCard key={i} mcq={m} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Flashcard({ q, a }: { q: string; a: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="min-h-[110px] rounded-lg border border-ink/10 bg-white p-4 text-left transition-colors hover:border-amber"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-amber-deep">
        {flipped ? "Answer" : "Question"} — tap to flip
      </p>
      <p className="mt-2 text-ink">{flipped ? a : q}</p>
    </button>
  );
}

function McqCard({ mcq, index }: { mcq: MCQ; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="rounded-lg border border-ink/10 bg-white p-5">
      <p className="font-medium text-ink">
        {index + 1}. {mcq.question}
      </p>
      <div className="mt-3 space-y-2">
        {mcq.options.map((o, i) => {
          const isPicked = picked === i;
          const showState = picked !== null;
          let cls = "border-ink/15";
          if (showState && o.correct) cls = "border-green-500 bg-green-50";
          else if (showState && isPicked && !o.correct) cls = "border-red-400 bg-red-50";
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`block w-full rounded-md border px-3 py-2 text-left text-sm ${cls}`}
            >
              {o.text}
            </button>
          );
        })}
      </div>
      {picked !== null && mcq.explanation && (
        <p className="mt-3 text-sm text-slate">
          <span className="font-medium text-ink-soft">Why:</span> {mcq.explanation}
        </p>
      )}
    </div>
  );
}