// Simulated Offline RAG Knowledge Base for Hackathon

const knowledgeBase = [
  {
    keywords: ['luggage', 'baggage', 'weight', 'bags'],
    response: 'APSRTC allows up to 20kg of free luggage per passenger on Express buses, and 30kg on Garuda/Amaravati services. Excess luggage will be charged dynamically based on distance.'
  },
  {
    keywords: ['pet', 'dog', 'cat', 'animal'],
    response: 'Pets are generally not allowed inside the passenger cabin. However, small pets may be allowed in non-AC buses with a half-fare ticket, subject to conductor approval.'
  },
  {
    keywords: ['cancel', 'refund', 'money back'],
    response: 'Tickets can be cancelled up to 2 hours before departure for a 90% refund. Cancellations within 2 hours are not eligible for refunds. Refunds process to your wallet instantly.'
  },
  {
    keywords: ['wallet', 'topup', 'balance', 'money'],
    response: 'You can top up your APSRTC Smart Wallet from the Profile or Wallet screen using UPI or Cards. If your balance falls short during booking, the app will prompt you to add exact funds.'
  },
  {
    keywords: ['offline', 'internet', 'wifi', 'connection'],
    response: 'Yes! Our Smart Bus Platform works offline. Once booked, your ticket is securely cached on your device. You can view it and generate a PDF document without internet access.'
  },
  {
    keywords: ['delay', 'late', 'time', 'eta'],
    response: 'You can track your bus live on the Home screen. Our AI Engine analyzes traffic data to give you real-time ETAs and dynamic crowd prediction badges.'
  },
  {
    keywords: ['student', 'pass', 'discount', 'concession'],
    response: 'Student and Senior Citizen passes can be linked to your profile. Please visit the nearest APSRTC depot for initial KYC verification. Once linked, discounts apply automatically.'
  },
  {
    keywords: ['hi', 'hello', 'hey'],
    response: 'Hello! I am your APSRTC Offline Smart Assistant. How can I help you with your journey today?'
  }
];

export const queryOfflineRAG = (userText) => {
  const normalizedText = userText.toLowerCase();
  
  // Basic scoring mechanism (simulating vector similarity)
  let bestMatch = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (normalizedText.includes(keyword)) {
        score += 1;
      }
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // If no keywords matched, return a fallback
  if (!bestMatch) {
    return "I'm sorry, I couldn't find an exact answer in my offline database. For complex queries, please contact APSRTC Helpline at 1800-200-4599.";
  }

  return bestMatch.response;
};
