import React, { useState } from 'react';
import { OpenAI } from 'openai';

const apiKey = import.meta.env.VITE_OPEN_API_KEY;
const api = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true 
});

const products = [
  {
    id: 101,
    name: 'Smartphone',
    price: 499.99,
    brand: 'TechCorp',
    stock: 120,
    specs: { screenSize: '6.1"', storage: '128GB' },
    reviews: [{ userId: 1, rating: 4.5 }]
  },
  {
    id: 102,
    name: 'Tablet',
    price: 299.99,
    brand: 'TabX',
    stock: 85,
    specs: { screenSize: '10.2"', storage: '64GB' },
    reviews: [{ userId: 2, rating: 3.8 }]
  },
  {
    id: 103,
    name: 'Wireless Headphones',
    price: 89.99,
    brand: 'AudioPro',
    stock: 200,
    specs: { connectivity: 'Bluetooth', batteryLife: '20h' },
    reviews: [{ userId: 3, rating: 4.8 }]
  }
];


const App = () => {
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const queryProductPrice = async (question: string) => {
    setLoading(true);
    try {
      const messages = await api.chat.completions.create({
        model: 'gpt-4o-mini', 
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that knows everything about products.',
          },
          {
            role: 'user',
            content: `Here are some products: ${JSON.stringify(products)}. ${question}`
          }
        ],
      });

      const message = messages.choices[0].message.content;
      console.log(`Assistant: ${message}`); 
      setAnswer(`${message}`);

    } catch (error) {
      console.error("Error querying OpenAI API:", error);
      setAnswer("Sorry, I couldn't process your request.");
    }
    setLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleAskQuestion = () => {
    queryProductPrice(question);
  };

  return (
    <div>
      <h1>Product Information</h1>
      <p>Ask a question about the product data (e.g., "What is the price of smartphone")</p>
      <input
        type="text"
        value={question}
        onChange={handleInputChange}
        placeholder="Ask a question"
        style={{width:"300px"}}
      />
      <button onClick={handleAskQuestion} disabled={loading}>
        {loading ? "Loading..." : "Get Answer"}
      </button>
      <p><strong>Answer:</strong> {answer}</p>
    </div>
  );
};

export default App;
