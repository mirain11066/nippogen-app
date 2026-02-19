"use client";

import { useState, useEffect } from "react";
import Mascot from "./Mascot";

const STEPS = [
  { message: "メモを読み込み中...", expression: "thinking" as const, duration: 2000 },
  { message: "構成を考え中...", expression: "thinking" as const, duration: 2500 },
  { message: "文章を執筆中...", expression: "happy" as const, duration: 2500 },
  { message: "敬語をチェック中...", expression: "wink" as const, duration: 2000 },
  { message: "もうすぐ完成！", expression: "excited" as const, duration: 3000 },
];

export default function GeneratingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = STEPS.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 100;
      setProgress(Math.min((elapsed / totalDuration) * 100, 95));

      let stepTime = 0;
      for (let i = 0; i < STEPS.length; i++) {
        stepTime += STEPS[i].duration;
        if (elapsed < stepTime) {
          setCurrentStep(i);
          break;
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const step = STEPS[currentStep];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
      <div className="flex flex-col items-center">
        {/* ニッポくん */}
        <div className="mb-6">
          <Mascot size="md" expression={step.expression} message={step.message} />
        </div>

        {/* プログレスバー */}
        <div className="w-full max-w-xs mb-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ステップインジケーター */}
        <div className="flex gap-2 mb-4">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? "bg-purple-500 scale-110"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* 豆知識 */}
        <p className="text-xs text-gray-400 text-center mt-2">
          💡 NippoGen は6言語に対応しています
        </p>
      </div>
    </div>
  );
}
