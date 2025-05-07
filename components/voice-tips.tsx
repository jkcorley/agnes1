"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react"

export function VoiceTips() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between text-left">
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
          <h3 className="font-medium">Voice Command Tips</h3>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="mt-4 text-sm">
          <p className="mb-2">Try these voice commands:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>"Show me iPhone 15 Pro"</li>
            <li>"Find running shoes under $100"</li>
            <li>"Search for Samsung TVs"</li>
            <li>"Looking for headphones by Sony"</li>
            <li>"Show me kitchen appliances"</li>
          </ul>
          <p className="mt-3 text-gray-500">
            Agnes understands natural language and can extract product types, brands, and price ranges from your voice
            commands.
          </p>
        </div>
      )}
    </div>
  )
}
