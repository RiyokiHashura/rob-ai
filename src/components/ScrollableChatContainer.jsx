import React, { useRef, useEffect, useMemo } from 'react'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

function ScrollableChatContainer({ messages, isTyping }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const messageElements = useMemo(() => {
    return messages.map((msg) => (
      <ChatMessage
        key={msg.timestamp || `msg-${Date.now()}-${Math.random()}`}
        message={msg.message}
        type={msg.type}
      />
    ))
  }, [messages])

  return (
    <div className="flex-1 mb-4 overflow-y-auto overscroll-none hover-scrollbar smooth-scroll">
      <div className="flex flex-col p-4 space-y-1">
        {messageElements}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#e9edef] text-gray-900 rounded-xl rounded-tl-none px-4 py-2.5">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default React.memo(ScrollableChatContainer) 