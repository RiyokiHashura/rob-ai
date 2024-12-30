import React from 'react'

export default function SuggestionButton({ suggestion, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-2 mb-2 text-left bg-blue-50 hover:bg-blue-100 
        rounded border border-blue-200 text-blue-700 transition-colors"
    >
      <span className="text-xs text-blue-500">Suggested response:</span>
      <div className="font-medium">{suggestion}</div>
    </button>
  )
} 