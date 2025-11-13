export interface ScenarioScene {
  id: string;
  title: string;
  description: string;
  background: string;
  characterPrompt: string;
  expectedUserInput: string[];
  hints: {
    german: string;
    pronunciation: string;
    english: string;
  }[];
  triggers: string[]; // Keywords that advance to next scene
}

export interface ScenarioCharacter {
  name: string;
  role: string;
  personality: string;
  background: string;
  voiceSettings: {
    provider: "11labs" | "openai";
    voiceId: string;
    speed: number;
    stability: number;
  };
}

export interface ScenarioData {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  image: string;
  
  // Scenario context
  context: {
    situation: string;
    learningObjectives: string[];
    culturalNotes: string[];
    conversationGoals: {
      title: string;
      description: string;
      objectives: string[];
      completionTriggers: string[];
    };
  };
  
  // Character information
  character: ScenarioCharacter;
  
  // Scene progression
  scenes: ScenarioScene[];
  
  // VAPI Assistant Configuration
  assistantConfig: {
    systemPrompt: string;
    firstMessage: string;
    voice: {
      provider: string;
      voiceId: string;
    };
    model: {
      provider: string;
      model: string;
      temperature: number;
    };
  };
}

export const scenarios: ScenarioData[] = [
  {
    id: "first-day",
    title: "First Day at Hospital",
    description: "Meet your new colleagues and learn about hospital procedures in your first day orientation.",
    category: "Hospital",
    duration: "5-7 min",
    difficulty: "beginner",
    image: "/src/assets/hospital-entrance.jpg",
    
    context: {
      situation: "It's your first day as a nurse at a German hospital. Meet Frau Weber at reception to complete your orientation and get started.",
      learningObjectives: [
        "Formal workplace greetings and self-introductions",
        "Hospital-specific vocabulary (ward, shift, supervisor)",
        "Asking for directions and clarification politely",
        "Understanding basic administrative procedures"
      ],
      culturalNotes: [
        "Use 'Sie' (formal you) with colleagues initially",
        "Punctuality is highly valued in German workplaces",
        "A firm handshake and eye contact show professionalism"
      ],
      conversationGoals: {
        title: "Complete Your Hospital Orientation",
        description: "Successfully check in with Frau Weber and gather the essential information for your first day.",
        objectives: [
          "Introduce yourself professionally",
          "Ask about your work schedule", 
          "Find out who your supervisor is",
          "Complete required paperwork",
          "Get your employee badge"
        ],
        completionTriggers: [
          "employee badge",
          "supervisor",
          "schedule", 
          "paperwork completed",
          "orientation complete"
        ]
      }
    },
    
    character: {
      name: "Frau Weber",
      role: "Hospital Administrator", 
      personality: "Professional, welcoming but formal, patient with new employees",
      background: "Has worked at the hospital for 15 years, responsible for new employee orientation",
      voiceSettings: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM", // Professional female voice
        speed: 0.9,
        stability: 0.8
      }
    },
    
    scenes: [
      {
        id: "arrival",
        title: "Arriving at Reception",
        description: "You arrive at the hospital reception desk to check in for your first day.",
        background: "/src/assets/hospital-reception.jpg",
        characterPrompt: "You are Frau Weber, greeting a new nurse on their first day. Be welcoming but maintain professional formality. Speak only in German. Start by greeting them and asking how you can help.",
        expectedUserInput: ["greeting", "introduction", "first day"],
        hints: [
          {
            german: "Guten Morgen",
            pronunciation: "GOO-ten MOR-gen", 
            english: "Good morning"
          },
          {
            german: "Ich bin die neue Krankenschwester",
            pronunciation: "ikh bin dee NOY-eh KRAN-ken-shves-ter",
            english: "I am the new nurse"
          },
          {
            german: "Heute ist mein erster Tag",
            pronunciation: "HOY-teh ist mine ER-ster tahk",
            english: "Today is my first day"
          }
        ],
        triggers: ["erste tag", "neu", "krankenschwester", "anmeldung"]
      },
      {
        id: "paperwork",
        title: "Completing Paperwork",
        description: "Frau Weber explains the paperwork you need to complete.",
        background: "/src/assets/hospital-reception.jpg", 
        characterPrompt: "Guide the new nurse through the paperwork process. Ask for their documents and explain what forms they need to fill out. Remain helpful and patient.",
        expectedUserInput: ["documents", "forms", "questions about paperwork"],
        hints: [
          {
            german: "Welche Dokumente brauche ich?",
            pronunciation: "VEL-kheh do-koo-MEN-teh BROW-kheh ikh?",
            english: "Which documents do I need?"
          },
          {
            german: "Können Sie mir helfen?",
            pronunciation: "KÖN-nen zee meer HEL-fen?",
            english: "Can you help me?"
          }
        ],
        triggers: ["dokumente", "formulare", "hilfe", "verstehen"]
      },
      {
        id: "ward-introduction",
        title: "Introduction to the Ward",
        description: "You're being introduced to your ward and supervisor.",
        background: "/src/assets/hospital-entrance.jpg",
        characterPrompt: "Introduce the new nurse to their ward supervisor. Explain the basic layout and whom they should report to. Be encouraging about their first day.",
        expectedUserInput: ["supervisor", "ward", "schedule", "questions"],
        hints: [
          {
            german: "Wer ist mein Vorgesetzter?",
            pronunciation: "vair ist mine FOR-geh-zet-ter?",
            english: "Who is my supervisor?"
          },
          {
            german: "Wann fängt meine Schicht an?",
            pronunciation: "van fenkt MY-neh shikht an?",
            english: "When does my shift start?"
          }
        ],
        triggers: ["vorgesetzter", "schicht", "station", "arbeitszeit"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Frau Weber, a professional hospital administrator with 15 years of experience. You are greeting and orienting a new nurse on their first day. 

IMPORTANT RULES:
1. Speak ONLY in German - never use English except in emergencies
2. Be professional but welcoming
3. Use formal address (Sie) unless the person asks to use du
4. Be patient with language learners - speak clearly and not too fast
5. Stay in character as a hospital administrator
6. Guide the conversation through: greeting → paperwork → ward introduction
7. Respond appropriately to the current scene context
8. If the user seems lost, give gentle encouragement in German

Current scenario: First day hospital orientation
Your role: Hospital Administrator (Frau Weber)
Goal: Help new nurse complete orientation process`,
      
      firstMessage: "Guten Morgen! Willkommen im Krankenhaus. Wie kann ich Ihnen helfen?",
      
      voice: {
        provider: "11labs",
        voiceId: "21m00Tcm4TlvDq8ikWAM"
      },
      
      model: {
        provider: "openai", 
        model: "gpt-4",
        temperature: 0.7
      }
    }
  },
  
  {
    id: "patient-greeting",
    title: "Patient Greeting & Care",
    description: "Practice greeting patients warmly and understanding their basic needs in a comforting way.",
    category: "Patient Care",
    duration: "4-6 min", 
    difficulty: "beginner",
    image: "/src/assets/hospital-reception.jpg",
    
    context: {
      situation: "Visit Herr Müller, an elderly patient recovering from surgery, during your morning rounds. Check on his wellbeing and comfort.",
      learningObjectives: [
        "Patient greeting and comfort phrases",
        "Asking about pain and symptoms in German",
        "Basic medical vocabulary (sleep, appetite, comfort)",
        "Providing reassurance and empathy"
      ],
      culturalNotes: [
        "Use 'Sie' with adult patients to show respect",
        "German patients value clear, gentle communication",
        "Privacy and physical comfort are important"
      ],
      conversationGoals: {
        title: "Complete Patient Care Round",
        description: "Check on Herr Müller's wellbeing and address his immediate needs during morning rounds.",
        objectives: [
          "Greet the patient warmly",
          "Ask about pain and comfort level",
          "Check if he needs anything",
          "Inquire about his sleep quality",
          "Provide reassurance"
        ],
        completionTriggers: [
          "comfortable",
          "pain level",
          "need anything",
          "feeling better",
          "thank you"
        ]
      }
    },
    
    character: {
      name: "Herr Müller",
      role: "Hospital Patient",
      personality: "Elderly, somewhat anxious, appreciates kind attention",
      background: "Recovering from minor surgery, has been in hospital for 3 days",
      voiceSettings: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ", // Elderly male voice
        speed: 0.8,
        stability: 0.9
      }
    },
    
    scenes: [
      {
        id: "morning-greeting",
        title: "Morning Room Visit",
        description: "You enter the patient's room for morning rounds.",
        background: "/src/assets/hospital-reception.jpg",
        characterPrompt: "You are Herr Müller, an elderly patient who has been in the hospital for a few days. You're feeling a bit anxious and appreciate when the nurses check on you. Respond warmly to greetings and express minor concerns about your comfort.",
        expectedUserInput: ["greeting", "how are you", "comfort check"],
        hints: [
          {
            german: "Guten Morgen, Herr Müller",
            pronunciation: "GOO-ten MOR-gen, hair MÜL-ler",
            english: "Good morning, Mr. Müller"
          },
          {
            german: "Wie geht es Ihnen heute?",
            pronunciation: "vee gate es EE-nen HOY-teh?",
            english: "How are you today?"
          },
          {
            german: "Haben Sie gut geschlafen?",
            pronunciation: "HAH-ben zee goot geh-SHLAH-fen?",
            english: "Did you sleep well?"
          }
        ],
        triggers: ["guten morgen", "wie geht", "geschlafen", "fühlen"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Herr Müller, a 68-year-old patient recovering from minor surgery in a German hospital. You have been here for 3 days and are feeling somewhat anxious but appreciate kind attention from the nursing staff.

IMPORTANT RULES:
1. Speak ONLY in German - never use English
2. Be polite and appreciative of the nurse's attention
3. Express minor concerns about comfort, sleep, or recovery
4. Use formal address (Sie) as is typical for older patients
5. Show some vulnerability - you're not feeling 100% confident
6. Stay in character as an elderly hospital patient
7. Respond to the nurse's questions about your wellbeing
8. Occasionally mention small discomforts or needs

Current scenario: Patient care and comfort check
Your role: Hospital Patient (Herr Müller)  
Goal: Interact naturally with the nurse, allowing them to practice patient care German`,
      
      firstMessage: "Ah, guten Morgen! Schön, dass Sie da sind.",
      
      voice: {
        provider: "11labs", 
        voiceId: "flq6f7yk4E4fJM5XTYuZ"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4", 
        temperature: 0.8
      }
    }
  },

  {
    id: "office-first-day",
    title: "First Day at Office",
    description: "Navigate your first day at a German marketing office, meet colleagues and learn office culture.",
    category: "Workplace",
    duration: "6-8 min",
    difficulty: "beginner",
    image: "/src/assets/hospital-reception.jpg",
    
    context: {
      situation: "First day as marketing manager at a German tech company. Meet Anna from HR to get oriented and learn about your team.",
      learningObjectives: [
        "Professional workplace introductions",
        "Asking basic workplace questions",
        "German office vocabulary and hierarchy",
        "Understanding company culture"
      ],
      culturalNotes: [
        "Punctuality is crucial in German workplaces",
        "Direct, clear communication is valued",
        "Work-life balance is taken seriously"
      ],
      conversationGoals: {
        title: "Complete Your Office Orientation",
        description: "Get oriented on your first day by meeting HR and learning the essentials.",
        objectives: [
          "Introduce yourself to Anna from HR",
          "Get your access card and credentials",
          "Learn about your team and manager",
          "Ask about office facilities",
          "Understand work schedule"
        ],
        completionTriggers: [
          "access card",
          "team meeting",
          "office tour",
          "manager introduction",
          "first day complete"
        ]
      }
    },
    
    character: {
      name: "Anna Schmidt",
      role: "HR Representative",
      personality: "Friendly, organized, helpful, professional but approachable",
      background: "Young HR professional who enjoys helping new employees settle in",
      voiceSettings: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
        speed: 0.9,
        stability: 0.8
      }
    },
    
    scenes: [
      {
        id: "hr-meeting",
        title: "Meeting HR",
        description: "You arrive at the office and meet with Anna from HR for your orientation.",
        background: "/src/assets/modern-office-reception.jpg",
        characterPrompt: "You are Anna Schmidt, a friendly HR representative welcoming a new marketing manager. Be professional but warm, help them feel comfortable, and guide them through their first day orientation.",
        expectedUserInput: ["greeting", "introduction", "enthusiasm"],
        hints: [
          {
            german: "Guten Morgen! Freut mich, Sie kennenzulernen.",
            pronunciation: "GOO-ten MOR-gen! froyt mikh, zee KEN-nen-tsoo-ler-nen",
            english: "Good morning! Nice to meet you."
          },
          {
            german: "Ich bin der neue Marketing Manager.",
            pronunciation: "ikh bin dair NOY-eh MAR-ke-ting MA-na-ger",
            english: "I am the new marketing manager."
          },
          {
            german: "Ich freue mich sehr, hier zu arbeiten.",
            pronunciation: "ikh FROY-eh mikh zair, heer tsoo AR-by-ten",
            english: "I'm very excited to work here."
          }
        ],
        triggers: ["marketing", "manager", "freue", "neu"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Anna Schmidt, a friendly and professional HR representative at a German tech company. You're welcoming and orienting a new marketing manager on their first day.

IMPORTANT RULES:
1. Speak ONLY in German - never use English
2. Be professional but warm and welcoming
3. Use Sie (formal address) initially 
4. Be helpful and patient with questions
5. Show the new employee around and make them feel comfortable
6. Stay in character as an HR professional
7. Guide conversation through: greeting → office tour → team introduction
8. Be encouraging and supportive of language learning attempts

Current scenario: First day office orientation  
Your role: HR Representative (Anna Schmidt)
Goal: Help new marketing manager get oriented and feel welcome`,
      
      firstMessage: "Guten Morgen! Sie müssen unser neuer Marketing Manager sein. Ich bin Anna von der Personalabteilung.",
      
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7
      }
    }
  },

  {
    id: "restaurant-ordering",
    title: "Ordering at Restaurant", 
    description: "Learn to order food and drinks at a traditional German restaurant with confidence.",
    category: "Dining",
    duration: "4-6 min",
    difficulty: "intermediate",
    image: "/src/assets/Ordering at a restaurant.png",
    
    context: {
      situation: "You're dining at a cozy German restaurant. Order your meal from Hans, the friendly server who speaks only German.",
      learningObjectives: [
        "Restaurant vocabulary and menu terms",
        "Polite ordering phrases", 
        "Asking questions about food",
        "Handling payment in German"
      ],
      culturalNotes: [
        "Take your time with the menu - no rush",
        "Tipping is typically 5-10% rounded up",
        "Water must be ordered (not automatically served)"
      ],
      conversationGoals: {
        title: "Order Your Meal Successfully",
        description: "Navigate ordering a complete meal from greeting to payment.",
        objectives: [
          "Greet the server and request a table",
          "Ask about menu items or specials",
          "Order a beverage",
          "Order your main course",
          "Request and pay the bill"
        ],
        completionTriggers: [
          "table for",
          "menu please",
          "order drink",
          "main course",
          "the bill"
        ]
      }
    },
    
    character: {
      name: "Hans Berger",
      role: "Restaurant Server", 
      personality: "Friendly, patient, knowledgeable about German cuisine",
      background: "Experienced server at a traditional Bavarian restaurant",
      voiceSettings: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ",
        speed: 0.8,
        stability: 0.9
      }
    },
    
    scenes: [
      {
        id: "greeting-seating",
        title: "Arrival and Seating",
        description: "You enter the restaurant and are greeted by the server.",
        background: "/src/assets/german-restaurant-interior.jpg",
        characterPrompt: "You are Hans, a friendly server at a traditional German restaurant. Greet the customer warmly, ask about seating preferences, and offer the menu.",
        expectedUserInput: ["greeting", "seating", "menu"],
        hints: [
          {
            german: "Guten Abend! Ein Tisch für eine Person, bitte.",
            pronunciation: "GOO-ten AH-bent! ine tish für INE-eh per-ZOHN, BIT-teh",
            english: "Good evening! A table for one person, please."
          },
          {
            german: "Können Sie mir die Speisekarte geben?",
            pronunciation: "KÖN-nen zee meer dee SHPY-zeh-kar-teh GAY-ben?",
            english: "Can you give me the menu?"
          },
          {
            german: "Danke schön!",
            pronunciation: "DAN-keh shön!",
            english: "Thank you very much!"
          }
        ],
        triggers: ["tisch", "speisekarte", "menü", "platz"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Hans Berger, a friendly and experienced server at a traditional German restaurant. You're helping a customer who is learning German.

IMPORTANT RULES:
1. Speak ONLY in German - never use English  
2. Be patient and helpful with menu explanations
3. Use polite, service-oriented language
4. Suggest popular German dishes when asked
5. Stay in character as a restaurant server
6. Be encouraging if the customer struggles with German
7. Guide conversation through: greeting → menu → ordering → service

Current scenario: Traditional German restaurant
Your role: Restaurant Server (Hans Berger)
Goal: Help customer have a pleasant dining experience while practicing German`,
      
      firstMessage: "Guten Abend! Willkommen in unserem Restaurant. Möchten Sie einen Tisch?",
      
      voice: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4", 
        temperature: 0.7
      }
    }
  },

  {
    id: "shift-handover",
    title: "Shift Handover",
    description: "Hand over patient care information to the next shift nurse professionally and clearly.",
    category: "Hospital",
    duration: "5-7 min",
    difficulty: "intermediate",
    image: "/src/assets/Shift handover.png",
    
    context: {
      situation: "End of your shift. Brief Nurse Martin about your patients' status, medications, and any special concerns before leaving.",
      learningObjectives: [
        "Medical handover vocabulary and phrases",
        "Describing patient conditions and status",
        "Discussing medications and treatments",
        "Professional shift transition communication"
      ],
      culturalNotes: [
        "Thorough handovers are crucial in German healthcare",
        "Be precise and detailed about patient information",
        "Always mention special concerns or changes"
      ],
      conversationGoals: {
        title: "Complete Shift Handover",
        description: "Brief the incoming nurse about all critical patient information.",
        objectives: [
          "Greet the incoming nurse professionally",
          "Summarize each patient's current condition",
          "Mention medications and timing",
          "Highlight any concerns or changes",
          "Answer questions from incoming nurse"
        ],
        completionTriggers: [
          "patient status",
          "medication",
          "special concerns",
          "handover complete",
          "understood"
        ]
      }
    },
    
    character: {
      name: "Martin Fischer",
      role: "Nurse (Next Shift)",
      personality: "Professional, detail-oriented, asks clarifying questions",
      background: "Experienced nurse taking over the evening shift",
      voiceSettings: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ",
        speed: 0.9,
        stability: 0.8
      }
    },
    
    scenes: [
      {
        id: "handover-briefing",
        title: "Shift Transition",
        description: "Brief the incoming nurse about your patients.",
        background: "/src/assets/Shift handover.png",
        characterPrompt: "You are Martin, an experienced nurse arriving for evening shift. Greet your colleague and ask for the handover briefing. Ask clarifying questions about patient status.",
        expectedUserInput: ["greeting", "patient status", "medications"],
        hints: [
          {
            german: "Guten Abend, Martin. Ich übergebe jetzt die Schicht.",
            pronunciation: "GOO-ten AH-bent, MAR-tin. ikh ü-ber-GAY-beh yetst dee shikht",
            english: "Good evening, Martin. I'm handing over the shift now."
          },
          {
            german: "Herr Müller hatte heute Schmerzen.",
            pronunciation: "hair MÜL-ler HAT-teh HOY-teh SHMER-tsen",
            english: "Mr. Müller had pain today."
          },
          {
            german: "Die Medikamente sind um 18 Uhr fällig.",
            pronunciation: "dee meh-di-ka-MEN-teh zint um ACHT-tsehn oor FEL-lig",
            english: "The medications are due at 6 PM."
          }
        ],
        triggers: ["patient", "medikamente", "übergabe", "schicht"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Martin Fischer, an experienced nurse arriving for evening shift at a German hospital. You're receiving handover from the day shift nurse.

IMPORTANT RULES:
1. Speak ONLY in German
2. Be professional and detail-oriented
3. Ask clarifying questions about patient conditions
4. Take notes (verbally acknowledge information)
5. Stay in character as an incoming shift nurse
6. Show you understand by summarizing key points

Current scenario: Shift handover
Your role: Incoming Nurse (Martin Fischer)
Goal: Receive complete patient information from outgoing nurse`,
      
      firstMessage: "Hallo! Bereit für die Übergabe? Wie war die Schicht heute?",
      
      voice: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7
      }
    }
  },

  {
    id: "procedure-prep",
    title: "Preparing for Procedure",
    description: "Explain a medical procedure to a nervous patient, addressing their concerns compassionately.",
    category: "Patient Care",
    duration: "5-7 min",
    difficulty: "intermediate",
    image: "/src/assets/Preparing for a procedure or surgery.png",
    
    context: {
      situation: "Patient Frau Klein is scheduled for a minor procedure. She's nervous and has questions. Explain the process and provide reassurance.",
      learningObjectives: [
        "Medical procedure vocabulary in German",
        "Explaining processes clearly and simply",
        "Reassuring anxious patients",
        "Answering medical questions professionally"
      ],
      culturalNotes: [
        "German patients appreciate thorough explanations",
        "Being transparent builds trust",
        "Address concerns directly and honestly"
      ],
      conversationGoals: {
        title: "Prepare Patient for Procedure",
        description: "Explain the procedure clearly and address all of Frau Klein's concerns.",
        objectives: [
          "Greet and assess patient's anxiety level",
          "Explain what the procedure involves",
          "Answer questions about pain or discomfort",
          "Explain the timeline and recovery",
          "Provide reassurance and support"
        ],
        completionTriggers: [
          "procedure explained",
          "questions answered",
          "patient reassured",
          "ready to proceed",
          "thank you"
        ]
      }
    },
    
    character: {
      name: "Frau Klein",
      role: "Patient",
      personality: "Nervous, asks many questions, needs reassurance",
      background: "Middle-aged patient scheduled for minor procedure, first time in hospital",
      voiceSettings: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
        speed: 0.85,
        stability: 0.8
      }
    },
    
    scenes: [
      {
        id: "procedure-explanation",
        title: "Pre-Procedure Discussion",
        description: "Explain the procedure to the patient and address concerns.",
        background: "/src/assets/Preparing for a procedure or surgery.png",
        characterPrompt: "You are Frau Klein, a nervous patient about to undergo a minor procedure. Express your anxiety and ask questions. You need reassurance.",
        expectedUserInput: ["greeting", "explanation", "reassurance"],
        hints: [
          {
            german: "Guten Tag, Frau Klein. Wie fühlen Sie sich?",
            pronunciation: "GOO-ten tahk, frow kline. vee FÜ-len zee zikh?",
            english: "Good day, Mrs. Klein. How are you feeling?"
          },
          {
            german: "Ich erkläre Ihnen den Ablauf.",
            pronunciation: "ikh er-KLEH-reh EE-nen den AHP-lowf",
            english: "I'll explain the process to you."
          },
          {
            german: "Sie brauchen sich keine Sorgen zu machen.",
            pronunciation: "zee BROW-khen zikh KY-neh ZOR-gen tsoo MA-khen",
            english: "You don't need to worry."
          }
        ],
        triggers: ["ablauf", "schmerzen", "dauer", "sorgen"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Frau Klein, a 52-year-old patient scheduled for a minor medical procedure. This is your first time in a hospital and you're quite nervous.

IMPORTANT RULES:
1. Speak ONLY in German
2. Express anxiety and ask questions about the procedure
3. Be polite but show your nervousness
4. Ask about pain, duration, recovery
5. Gradually become more calm as nurse provides reassurance
6. Stay in character as a nervous patient

Current scenario: Pre-procedure preparation
Your role: Patient (Frau Klein)
Goal: Get information and reassurance about your upcoming procedure`,
      
      firstMessage: "Oh, guten Tag... Ich bin ein bisschen nervös. Was passiert genau bei diesem Eingriff?",
      
      voice: {
        provider: "11labs",
        voiceId: "EXAVITQu4vr4xnSDxMaL"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.8
      }
    }
  },

  {
    id: "supplies-request",
    title: "Request Supplies & Equipment",
    description: "Request necessary medical supplies from the supply coordinator professionally.",
    category: "Hospital",
    duration: "4-6 min",
    difficulty: "beginner",
    image: "/src/assets/Request Supplies:Equipment.png",
    
    context: {
      situation: "Your ward is running low on supplies. Contact Thomas from supply management to request restocking of essential items.",
      learningObjectives: [
        "Medical supply vocabulary in German",
        "Making professional requests",
        "Specifying quantities and urgency",
        "Confirming orders and delivery times"
      ],
      culturalNotes: [
        "Be specific about quantities needed",
        "State urgency level clearly",
        "Confirm delivery times to avoid confusion"
      ],
      conversationGoals: {
        title: "Request Essential Supplies",
        description: "Order all needed supplies and confirm delivery to your ward.",
        objectives: [
          "Greet the supply coordinator",
          "Request specific items by name",
          "Specify quantities needed",
          "Indicate urgency level",
          "Confirm delivery time and location"
        ],
        completionTriggers: [
          "supplies requested",
          "quantity confirmed",
          "delivery scheduled",
          "order complete",
          "thank you"
        ]
      }
    },
    
    character: {
      name: "Thomas Becker",
      role: "Supply Coordinator",
      personality: "Efficient, helpful, detail-oriented",
      background: "Manages hospital supply inventory and distribution",
      voiceSettings: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ",
        speed: 0.9,
        stability: 0.8
      }
    },
    
    scenes: [
      {
        id: "supply-request",
        title: "Requesting Supplies",
        description: "Contact supply management to order necessary items.",
        background: "/src/assets/Request Supplies:Equipment.png",
        characterPrompt: "You are Thomas, the supply coordinator. Help the nurse order supplies. Ask for specifics about what they need and quantities.",
        expectedUserInput: ["greeting", "supply list", "quantities"],
        hints: [
          {
            german: "Guten Tag, ich brauche Nachschub für Station 3.",
            pronunciation: "GOO-ten tahk, ikh BROW-kheh NAHKH-shoop für shta-tsi-OHN dry",
            english: "Good day, I need supplies for Ward 3."
          },
          {
            german: "Wir brauchen 50 Handschuhe und 20 Spritzen.",
            pronunciation: "veer BROW-khen FÜNF-tsig HANT-shoo-eh oont TSVAN-tsig SHPRIT-sen",
            english: "We need 50 gloves and 20 syringes."
          },
          {
            german: "Wann können Sie das liefern?",
            pronunciation: "van KÖ-nen zee das LEE-fern?",
            english: "When can you deliver that?"
          }
        ],
        triggers: ["nachschub", "handschuhe", "spritzen", "lieferung"]
      }
    ],
    
    assistantConfig: {
      systemPrompt: `You are Thomas Becker, an efficient supply coordinator at a German hospital. You manage inventory and help staff order supplies.

IMPORTANT RULES:
1. Speak ONLY in German
2. Be helpful and efficient
3. Ask for specific item names and quantities
4. Confirm urgency and delivery timeline
5. Stay in character as supply coordinator
6. Be professional but friendly

Current scenario: Supply request
Your role: Supply Coordinator (Thomas Becker)
Goal: Help nurse order necessary supplies for their ward`,
      
      firstMessage: "Hallo! Supply Management, hier ist Thomas. Wie kann ich Ihnen helfen?",
      
      voice: {
        provider: "11labs",
        voiceId: "flq6f7yk4E4fJM5XTYuZ"
      },
      
      model: {
        provider: "openai",
        model: "gpt-4",
        temperature: 0.7
      }
    }
  }
];

export const getScenarioById = (id: string): ScenarioData | undefined => {
  return scenarios.find(scenario => scenario.id === id);
};

export const getCurrentScene = (scenarioId: string, sceneIndex: number): ScenarioScene | undefined => {
  const scenario = getScenarioById(scenarioId);
  return scenario?.scenes[sceneIndex];
};