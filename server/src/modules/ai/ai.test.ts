import 'dotenv/config';
import { callAI } from './ai.service';

async function testAI() {
  const reply = await callAI([
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Tell me about ur capabilities.' },
  ]);

  console.log(reply);
}

testAI();
