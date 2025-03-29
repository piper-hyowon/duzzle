import React, { useRef, useEffect } from "react";

interface LyricsInputProps {
  lyrics: string;
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
}

export const LyricsInput: React.FC<LyricsInputProps> = ({
  lyrics,
  answers,
  setAnswers,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const parts = lyrics.split("??");

  return (
    <div
      style={{
        fontSize: "20px",
        lineHeight: "2",
        whiteSpace: "break-spaces",
      }}
    >
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={answers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`빈칸 ${index + 1}`}
              style={{
                width: "80px",
                margin: "0 5px",
                padding: "5px 5px 5px 8px",
                border: "none",
                backgroundColor: "rgb(233, 233, 233)",
                borderRadius: "5px",
                fontSize: "18px",
                lineHeight: "1.6",
                display: "inline-block",
                outline: "none",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
