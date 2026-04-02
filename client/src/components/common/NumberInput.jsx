import React from "react";

const NumberInput = ({
  value,
  onChange,
  placeholder,
  className = "",
  disabled = false,
  min,
  max,
}) => {
  const handleChange = e => {
    const val = e.target.value;
    // Allow only numbers and decimal point
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  const handleKeyDown = e => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      [46, 8, 9, 27, 13, 110, 190].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey) ||
      (e.keyCode === 67 && e.ctrlKey) ||
      (e.keyCode === 86 && e.ctrlKey) ||
      (e.keyCode === 88 && e.ctrlKey) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    // Block if not a number
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      min={min}
      max={max}
    />
  );
};

export default NumberInput;
