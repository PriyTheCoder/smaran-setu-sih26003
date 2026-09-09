import { useEffect, useRef, useState } from 'react'
import {
  X,
  Send,
  Bot,
  User,
  Heart,
  MessageCircle,
  Volume2,
  Trash2,
  Phone,
  AlertTriangle,
  CalendarDays,
  Brain,
  Pill,
  Smile,
  Home as HomeIcon,
  Moon,
  Droplets,
  Gamepad2,
  Mic,
} from 'lucide-react'

const quickQuestions = [
  {
    label: '🧠 I forgot something',
    message: 'I forgot something',
  },
  {
    label: '💊 Medicine help',
    message: 'I forgot my medicine',
  },
  {
    label: '📅 What should I do now?',
    message: 'What should I do now?',
  },
  {
    label: '❤️ I feel lonely',
    message: 'I feel lonely',
  },
  {
    label: '😟 I feel confused',
    message: 'I feel confused',
  },
  {
    label: '🏠 I lost something',
    message: 'I cannot find my phone',
  },
  {
    label: '😴 I cannot sleep',
    message: 'I cannot sleep',
  },
  {
    label: '💧 I need water',
    message: 'I need water',
  },
]

function getSmaranResponse(message) {
  const text = message.toLowerCase().trim()

  // 🚨 Emergency
  if (
    text.includes('chest pain') ||
    text.includes('severe pain') ||
    text.includes('breathing problem') ||
    text.includes('cannot breathe') ||
    text.includes('can’t breathe') ||
    text.includes('cant breathe') ||
    text.includes('बेहोश') ||
    text.includes('सांस नहीं') ||
    text.includes('saans nahi') ||
    text.includes('bahut dard') ||
    text.includes('fell down') ||
    text.includes('i fell') ||
    text.includes('gir gaya') ||
    text.includes('gir gayi')
  ) {
    return {
      text: '🚨 Aapko abhi help ki zarurat ho sakti hai. Please jahan hain wahi rukiye aur apne caregiver ko turant bulaiye. Agar situation serious hai, emergency medical help lein.',
      emergency: true,
    }
  }

  // 👋 Greeting
  if (
    text === 'hi' ||
    text === 'hello' ||
    text.includes('namaste') ||
    text.includes('good morning') ||
    text.includes('good evening')
  ) {
    return {
      text: 'Namaste! 👋 Main Smaran hoon. Aap mujhse Hindi, Hinglish ya English mein baat kar sakte hain. Aapko kis cheez mein help chahiye?',
    }
  }

  // 🧠 Memory
  if (
    text.includes('forgot') ||
    text.includes('remember') ||
    text.includes('yaad') ||
    text.includes('bhool') ||
    text.includes('memory')
  ) {
    return {
      text: 'Koi baat nahi ❤️. Pehle shaant hokar baith jaiye. Sochiye ki aapne us cheez ko aakhri baar kahan dekha tha. Agar phir bhi yaad na aaye, main aapko step-by-step help kar sakta hoon. Aap caregiver se bhi help le sakte hain.',
    }
  }

  // 🏠 Lost object
  if (
    text.includes('lost') ||
    text.includes('cannot find') ||
    text.includes("can't find") ||
    text.includes('where is my') ||
    text.includes('phone nahi') ||
    text.includes('nahi mil') ||
    text.includes('kahan hai')
  ) {
    return {
      text: 'Koi tension nahi 😊. Pehle in jagahon par dekhiye: 1️⃣ Bed ke paas 2️⃣ Table par 3️⃣ Bag ya purse mein 4️⃣ Charging ke paas. Agar phir bhi nahi mil raha, caregiver ko bula lijiye.',
    }
  }

  // 💊 Medicine
  if (
    text.includes('medicine') ||
    text.includes('medication') ||
    text.includes('tablet') ||
    text.includes('dawai') ||
    text.includes('दवाई') ||
    text.includes('dose')
  ) {
    return {
      text: 'Agar aapko medicine ka time ya dose yaad nahi hai, apni medicine routine check karein. ⚠️ Doubt hone par extra dose khud se na lein. Caregiver ya doctor se confirm karein.',
    }
  }

  // 😟 Confusion
  if (
    text.includes('confused') ||
    text.includes('confusion') ||
    text.includes('confuse') ||
    text.includes('samajh') ||
    text.includes('ghabra') ||
    text.includes('pata nahi kya kar')
  ) {
    return {
      text: 'Koi baat nahi ❤️. Aap safe hain. Pehle baith jaiye aur dheere-dheere 3 baar saans lijiye. Ab ek time par sirf ek kaam kijiye. Agar confusion achanak hua hai ya bahut badh raha hai, caregiver ko abhi batayein.',
    }
  }

  // ❤️ Loneliness / sadness
  if (
    text.includes('lonely') ||
    text.includes('alone') ||
    text.includes('akela') ||
    text.includes('udaas') ||
    text.includes('sad') ||
    text.includes('dukhi')
  ) {
    return {
      text: 'Main aapki baat sun raha hoon ❤️. Aap akela feel kar rahe hain to kisi family member ya caregiver se baat karna achha rahega. Aap chahein to apni koi favourite memory mujhe bhi bata sakte hain.',
    }
  }

  // 😴 Sleep
  if (
    text.includes('sleep') ||
    text.includes('neend') ||
    text.includes('insomnia') ||
    text.includes('so nahi')
  ) {
    return {
      text: 'Agar neend nahi aa rahi hai 🌙, room ko comfortable rakhein, phone thodi der ke liye side mein rakhein aur relax karein. Agar ye problem baar-baar hoti hai, caregiver ya doctor se baat karein.',
    }
  }

  // 💧 Water
  if (
    text.includes('water') ||
    text.includes('paani') ||
    text.includes('पानी') ||
    text.includes('thirsty')
  ) {
    return {
      text: '💧 Agar aapke doctor ne fluid restriction nahi di hai, to thoda paani pee lijiye. Apni water routine bhi check kar sakte hain.',
    }
  }

  // 🍛 Food
  if (
    text.includes('food') ||
    text.includes('hungry') ||
    text.includes('khana') ||
    text.includes('bhook')
  ) {
    return {
      text: '🍛 Agar meal ka time hai to apni routine check karein aur regular meal lijiye. Agar khana lene mein problem ho rahi hai, caregiver ko batayein.',
    }
  }

  // 📅 Routine
  if (
    text.includes('routine') ||
    text.includes('schedule') ||
    text.includes('what should i do') ||
    text.includes('kya karu') ||
    text.includes('kya karna') ||
    text.includes('ab kya')
  ) {
    return {
      text: '📅 Aapki next activity check karna best rahega. Smaran aapko ek time par ek simple activity complete karne mein help karega. Aap Daily Routine open kar sakte hain.',
      action: 'routine',
    }
  }

  // 🎮 Games
  if (
    text.includes('game') ||
    text.includes('khel') ||
    text.includes('memory game')
  ) {
    return {
      text: '🧠 Aap ek short memory game try kar sakte hain. Memory Match aur Picture Recall jaise activities aapke liye available hain.',
      action: 'games',
    }
  }

  // 😊 Feeling good
  if (
    text.includes('good') ||
    text.includes('happy') ||
    text.includes('theek') ||
    text.includes('fine') ||
    text.includes('achha')
  ) {
    return {
      text: 'Ye sunkar mujhe khushi hui! 😊 Aaj ek chhoti activity complete karna aur kisi apne se baat karna achha rahega.',
    }
  }

  // Default
  return {
    text: 'Main aapki help karna chahta hoon 😊. Aap simple words mein bataiye ki problem kya hai. Aap Hindi, Hinglish ya English mein likh sakte hain. Agar problem serious hai, caregiver ya doctor ko zaroor batayein.',
  }
}

export default function SmaranChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! 👋 Main Smaran hoon. Aapko kis cheez mein help chahiye?',
    },
  ])

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)


  const messagesEndRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
const [voiceSupported, setVoiceSupported] = useState(true)
const recognitionRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isTyping])

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(text)

    speech.lang = 'en-IN'
    speech.rate = 0.85
    speech.pitch = 1

    window.speechSynthesis.speak(speech)
  }
  useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    setVoiceSupported(false)
    return
  }

  const recognition = new SpeechRecognition()

  recognition.lang = 'hi-IN'
  recognition.continuous = false
  recognition.interimResults = false

  recognition.onstart = () => {
    setIsListening(true)
  }

  recognition.onend = () => {
    setIsListening(false)
  }

  recognition.onerror = () => {
    setIsListening(false)
  }

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript

    if (spokenText.trim()) {
      setInput(spokenText)
    }
  }

  recognitionRef.current = recognition

  return () => {
    recognition.stop()
  }
}, [])

const startListening = () => {
  if (!voiceSupported) {
    alert('Voice input is not supported in this browser.')
    return
  }

  if (isListening) {
    recognitionRef.current?.stop()
    return
  }

  try {
    recognitionRef.current?.start()
  } catch (error) {
    console.log('Voice recognition error:', error)
  }
}

  const sendMessage = async (text = input) => {
  const userMessage = text.trim()

  if (!userMessage || isTyping) return

  setInput('')

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      sender: 'user',
      text: userMessage,
    },
  ])

  setIsTyping(true)

  try {
    const response = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: 'test_002',
        message: userMessage,
        asked_by: 'patient',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong')
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.reply,
      },
    ])
  } catch (error) {
    console.error('Chat error:', error)

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Sorry, abhi mujhe response dene mein problem ho rahi hai. Please thodi der baad try karein.',
      },
    ])
  } finally {
    setIsTyping(false)
  }
}

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage()
  }

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: 'Namaste! 👋 Main Smaran hoon. Aapko kis cheez mein help chahiye?',
      },
    ])
  }

  const handleAction = (action) => {
    if (action === 'routine') {
      window.location.href = '/user/routine'
    }

    if (action === 'games') {
      window.location.href = '/user/games'
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 p-2 sm:items-center sm:p-4">
      <div className="flex h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between bg-linear-to-r from-[#17345f] to-[#2f8f92] px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Bot size={26} />
            </div>

            <div>
              <h2 className="text-xl font-black">
                Talk to Smaran
              </h2>

              <p className="text-xs text-white/80">
                Your friendly memory companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearChat}
              className="rounded-full p-2 transition hover:bg-white/20"
              title="Clear chat"
            >
              <Trash2 size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <X size={23} />
            </button>
          </div>
        </div>

        {/* QUICK HELP */}
        <div className="border-b bg-white px-4 py-3">
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle
              size={17}
              className="text-[#2f8f92]"
            />

            <p className="text-sm font-bold text-[#17345f]">
              What do you need help with?
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickQuestions.map((question) => (
              <button
                key={question.message}
                type="button"
                onClick={() =>
                  sendMessage(question.message)
                }
                disabled={isTyping}
                className="shrink-0 rounded-2xl border border-[#cfe5e5] bg-[#f3fbfb] px-4 py-3 text-sm font-bold text-[#2f8f92] transition hover:bg-[#e1f4f3] disabled:opacity-50"
              >
                {question.label}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7fafb] p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {message.sender === 'bot' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dff3f2] text-[#2f8f92]">
                  <Bot size={18} />
                </div>
              )}

              <div className="max-w-[82%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-[15px] leading-6 ${
                    message.sender === 'user'
                      ? 'rounded-br-sm bg-[#2f8f92] text-white'
                      : message.emergency
                        ? 'rounded-bl-sm border-2 border-red-200 bg-red-50 text-red-800'
                        : 'rounded-bl-sm bg-white text-[#17345f] shadow-sm'
                  }`}
                >
                  {message.text}
                </div>

                {message.sender === 'bot' && (
                  <button
                    type="button"
                    onClick={() =>
                      speakText(message.text)
                    }
                    className="mt-1 flex items-center gap-1 px-2 text-xs font-semibold text-[#2f8f92]"
                  >
                    <Volume2 size={13} />
                    Listen
                  </button>
                )}

                {message.action === 'routine' && (
                  <button
                    type="button"
                    onClick={() => handleAction('routine')}
                    className="mt-2 flex items-center gap-2 rounded-xl bg-[#2f8f92] px-4 py-3 text-sm font-bold text-white"
                  >
                    <CalendarDays size={17} />
                    Open My Routine
                  </button>
                )}

                {message.action === 'games' && (
                  <button
                    type="button"
                    onClick={() => handleAction('games')}
                    className="mt-2 flex items-center gap-2 rounded-xl bg-[#2f8f92] px-4 py-3 text-sm font-bold text-white"
                  >
                    <Gamepad2 size={17} />
                    Open Memory Games
                  </button>
                )}

                {message.emergency && (
                  <button
                    type="button"
                    onClick={() =>
                      window.dispatchEvent(
                        new Event(
                          'smaran-caregiver-alert'
                        )
                      )
                    }
                    className="mt-2 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    <Phone size={17} />
                    Alert Caregiver
                  </button>
                )}
              </div>

              {message.sender === 'user' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8eef7] text-[#17345f]">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dff3f2] text-[#2f8f92]">
                <Bot size={18} />
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                Smaran is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t bg-white p-3"
        >
          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Type in Hindi, Hinglish or English..."
            className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-[15px] text-[#17345f] outline-none focus:border-[#2f8f92] focus:ring-2 focus:ring-[#2f8f92]/20"
          />

          <button
  type="button"
  onClick={startListening}
  disabled={!voiceSupported}
  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${
    isListening
      ? 'bg-red-500 text-white'
      : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
  }`}
  aria-label="Tap to speak"
  title={isListening ? 'Listening...' : 'Tap to speak'}
>
  <Mic size={22} />
</button>

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2f8f92] text-white transition hover:bg-[#267a7d] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </form>

        {/* SAFETY */}
        <div className="flex items-center justify-center gap-1 bg-[#fff8e8] px-3 py-2 text-[10px] leading-4 text-gray-600">
          <Heart size={12} />
          Smaran gives supportive guidance, not medical diagnosis.
        </div>
      </div>
    </div>
  )
}
