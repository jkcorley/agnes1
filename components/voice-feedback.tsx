"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceFeedbackProps {
  isRecording: boolean
  transcript?: string
}

export function VoiceFeedback({ isRecording, transcript }: VoiceFeedbackProps) {
  const [dots, setDots] = useState("")

  // Animate dots when recording
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isRecording])

  return (
    <AnimatePresence>
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md w-full"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <p className="ml-2 font-medium">Listening{dots}</p>
          </div>
          {transcript && <p className="text-sm text-center text-gray-600 dark:text-gray-300 italic">{transcript}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
