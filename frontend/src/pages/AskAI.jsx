import React, { useState } from 'react';
import { getGeminiText } from '../utils/openRouterHelper';
import './AskAI.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AskAI = () => {
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([
        {
            role: 'assistant',
            content: 'Hello! I am your hygiene assistant 🤖. How can I help you today?'
        }
    ]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!query.trim()) return;

        const updatedHistory = [...chatHistory, { role: 'user', content: query }];
        setChatHistory(updatedHistory);
        setQuery('');
        setLoading(true);

        const prompt = updatedHistory
            .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n') + '\nAssistant:';

        const response = await getGeminiText(prompt);
        setChatHistory([...updatedHistory, { role: 'assistant', content: response }]);
        setLoading(false);
    };

    const formatMessage = (content) => {
        const lines = content.split('\n');
        let formatted = '';
        let isListStarted = false;

        lines.forEach((line) => {
            const match = line.match(/^(\d+)\.\s(.*)/);
            if (match) {
                if (!isListStarted) {
                    formatted += '<ul>';
                    isListStarted = true;
                }
                formatted += `<li>${match[2]}</li>`;
            } else {
                if (isListStarted) {
                    formatted += '</ul>';
                    isListStarted = false;
                }
                formatted += `<p>${line}</p>`;
            }
        });

        if (isListStarted) formatted += '</ul>';
        return formatted;
    };

    return (
        <div className="page-content">
            <div className="askai-page container mt-5">
                <h2 className="text-center mb-4 text-primary">💬 Hygiene Assistant Chat</h2>

                <div className="chat-box mb-3 p-3 rounded shadow-sm">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.role}`}>
                            <strong>{msg.role === 'user' ? '🧍 You' : '🤖 DoctorBot'}</strong>
                            <div
                                className="chat-content"
                                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                            />
                        </div>
                    ))}
                    {loading && <p className="thinking">🤔 DoctorBot is thinking...</p>}
                </div>

                <div className="chat-input d-flex flex-column flex-md-row gap-2 align-items-start">
                    <textarea
                        className="form-control"
                        rows="2"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask something like 'how to prevent cholera during rainy season?'"
                    />
                    <button
                        className="btn btn-primary send-btn"
                        onClick={handleSend}
                        disabled={loading}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AskAI;
