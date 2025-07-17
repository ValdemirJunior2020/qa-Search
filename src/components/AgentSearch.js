import React from "react";

export default function AgentSearch({ value, onChange }) {
  return (
    <input
      className="form-control"
      type="text"
      placeholder="Search by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
