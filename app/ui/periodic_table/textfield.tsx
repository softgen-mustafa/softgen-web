import React, { useState, useEffect, ChangeEvent } from "react";

type TextInputProps = {
  type: "int" | "float" | "string" | "date";
  //   onChange: (value: string | number) => void;
  editable: boolean;
  value: string | number;
};

const TextInput: React.FC<TextInputProps> = ({
  type,
  //   onChange,
  editable,
  value,
}) => {
  // Internal state for managing the input value
  const [inputValue, setInputValue] = useState<string | number>(value);

  // Effect to update internal state when the `value` prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue: string | number = e.target.value;

    if (type === "int") {
      newValue = parseInt(newValue, 10) || 0;
    } else if (type === "float") {
      newValue = parseFloat(newValue) || 0;
    }

    setInputValue(newValue); // Update internal state
    // onChange(newValue); // Notify parent component of change
  };

  return (
    <div className="input-container">
      <input
        type={type === "string" ? "text" : type === "date" ? "date" : "number"}
        value={inputValue}
        onChange={handleChange}
        readOnly={!editable}
      />
      {type === "date" && (
        <span
          className="date-icon"
          onClick={() => {
            if (editable) {
              const inputElement = document.querySelector(
                'input[type="date"]'
              ) as HTMLInputElement | null;
              if (inputElement && inputElement.showPicker) {
                inputElement.showPicker();
              }
            }
          }}
        ></span>
      )}
    </div>
  );
};

export default TextInput;
