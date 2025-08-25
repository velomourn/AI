import React, { useState, useRef } from 'react';

function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are Jarvis, a helpful AI assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef(null);

  // Voice recognition setup
  const startRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      recognitionRef.current = null;
    }
  };

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: input }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });
    const data = await res.json();
    setMessages([
      ...newMessages,
      { role: 'assistant', content: data.response, source: data.source }
    ]);
    setLoading(false);
  }

  function renderSourceTag(source) {
    if (!source) return null;
    const map = {
      ai: "🤖 AI",
      web: "🌐 Web",
      weather: "☁️ Weather",
      darkweb: "🕸️ Dark Web"
    };
    return (
      <span style={{
        marginLeft: 8,
        fontSize: 12,
        color: "#888",
        background: "#eee",
        borderRadius: 4,
        padding: "1px 6px"
      }}>
        {map[source] || source}
      </span>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>Jarvis AI Assistant</h1>
      <div style={{ minHeight: 300, border: '1px solid #ccc', padding: 16, marginBottom: 16, borderRadius: 8, background: '#fafafb' }}>
        {messages.filter(m => m.role !== 'system').map((m, idx) => (
          <div key={idx} style={{ marginBottom: 10, textAlign: m.role === 'user' ? 'right' : 'left' }}>
            <b>{m.role === 'user' ? 'You' : 'Jarvis'}:</b> {m.content}
            {m.role === 'assistant' && renderSourceTag(m.source)}
          </div>
        ))}
        {loading && <div>Jarvis is thinking...</div>}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Jarvis anything..."
          style={{ flex: 1, padding: 8, fontSize: 16 }}
          disabled={loading}
        />
        <button
          type="button"
          onClick={isRecording ? stopRecognition : startRecognition}
          disabled={loading}
          style={{
            background: isRecording ? '#ff5252' : '#eee',
            color: isRecording ? '#fff' : '#222',
            border: 'none',
            borderRadius: 4,
            padding: '0 10px',
            cursor: 'pointer'
          }}
          title={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isRecording ? '🛑' : '🎤'}
        </button>
        <button type="submit" disabled={loading || !input.trim()}>Send</button>
      </form>
      <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
        {isRecording && "Listening... Speak now."}
      </div>
    </div>
  );
}

export default App;