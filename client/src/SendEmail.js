import React, { useState } from 'react';
import axios from 'axios';

const SendEmail = () => {
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendEmail = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/send-email', {
                to,
                subject,
                text
            });

            if (response.status === 200) {
                setMessage('Email sent successfully');
                setError('');
            } else {
                setMessage('');
                setError('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setMessage('');
            setError('Internal server error');
        }
    };

    return (
        <div>
            <h2>Send Email</h2>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSendEmail}>
                <div>
                    <label>To:</label>
                    <input type="email" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div>
                    <label>Subject:</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div>
                    <label>Text:</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} />
                </div>
                <button type="submit">Send Email</button>
            </form>
        </div>
    );
};

export default SendEmail;
