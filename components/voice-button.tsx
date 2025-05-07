"use client"

import { useState } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceButtonProps {
  isRecording: boolean
  isLoading: boolean
  onClick: () => void
}

export function VoiceButton({ isRecording, isLoading, onClick }: VoiceButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      {isExpanded && (
        <div className="mr-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 animate-in fade-in slide-in-from-right-5">
          <p className="text-sm font-medium">{isRecording ? "Listening..." : "Tap to speak"}</p>
        </div>
      )}

      <button
        onClick={() => {
          onClick()
          setIsExpanded(true)
          if (!isRecording) {
            setTimeout(() => setIsExpanded(false), 3000)
          }
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !isRecording && setIsExpanded(false)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors",
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700",
        )}
        disabled={isLoading}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>
    </div>
  )
}
