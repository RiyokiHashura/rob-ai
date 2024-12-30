import React, { useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'

function ScrollableChatContainer({ messages, isTyping }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const messageStyle = (type) => {
    switch(type) {
      case 'debug':
        return 'bg-gray-100/10 text-xs font-mono p-2 rounded my-1 text-gray-400'
      default:
        return ''
    }
  }

  return (
    <div className="absolute inset-0 overflow-y-auto overscroll-none hover-scrollbar smooth-scroll">
      <div className="flex flex-col p-4">
        {messages.map((msg) => (
          <div key={msg.id || `msg-${Date.now()}-${Math.random()}`}>
            {msg.type === 'debug' ? (
              <div 
                className={`${messageStyle('debug')} max-w-[80%] mx-auto`}
              >
                {typeof msg.message === 'object' ? JSON.stringify(msg.message) : msg.message}
              </div>
            ) : (
              <ChatMessage
                message={msg.message}
                type={msg.type}
              />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="animate-pulse text-gray-400 text-center">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ScrollableChatContainer 