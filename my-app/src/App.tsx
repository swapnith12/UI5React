import React, { useState } from 'react';
import { OpenAI } from 'openai';
import { FlexBoxDirection } from '@ui5/webcomponents-react';

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
interface Messages{
type:string,
message:string
}

const App = () => {
  const [question, setQuestion] = useState<string>('');
  const [messages, setMessages] = useState<Messages[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryProduct = async (question: string) => {
    setLoading(true);
    setMessages((prev)=>[...prev,{type:"user",message:`${question}`}])
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
      // setAnswer(`${message}`);
      setMessages((prev)=>[...prev,{type:"bot",message:`${message}`}])

    } catch (error) {
      console.error("Error querying OpenAI API:", error);
      // setAnswer("Sorry, I couldn't process your request.");
      setMessages((prev)=>[...prev,{type:"bot",message:`Sorry, I couldn't process your request.`}])
    }
    setLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    // const question = event.target.value
    // setMessages((prev)=>[...prev,{type:"user",message:question}])
  };

  const handleAskQuestion = () => {
    queryProduct(question);
  };

  return (
    <div className=''>
      <h1>Product Information</h1>
      <p>Ask a question about the product data (e.g., "What is the price of smartphone")</p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderWidth: '1px',
        borderColor: '#ccc',
        borderRadius: '10px',
        width: '400px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '100%',
          height: '300px',
          overflowY: 'scroll',
          padding: '10px',
          marginBottom: '20px',
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              textAlign: msg.type === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}>
              <strong>{msg.type === 'user' ? 'You' : 'Bot'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={question}
          onChange={handleInputChange}
          placeholder="Ask a question"
          style={{ width: "300px" ,height:"55px", overflow:"scroll"}}
        />
        <button onClick={handleAskQuestion} disabled={loading}>
          {loading ? "Loading..." : "send"}
        </button>
      </div>
      {/* <p><strong>Answer:</strong> {answer}</p> */}
    </div>
  );
};

export default App;
