# AI English Tutor

Welcome to the AI English Tutor, a comprehensive web application designed to help users improve their English language skills through interactive exercises, personalized feedback, and AI-powered content.

## 🚀 Description

This application serves as a personal English learning companion. It leverages the power of Google's Gemini AI to generate unique stories, provide translations, and offer intelligent assistance, making the learning process engaging and effective. Whether you're looking to improve your reading, typing, pronunciation, or vocabulary, this app has a feature to help you achieve your goals.

## ✨ Key Features

- **📖 AI-Generated Stories**: Dynamically generates short, moral stories tailored to the user's selected English proficiency level (Beginner, Intermediate, Advanced).
- **⌨️ Interactive Typing Practice**: Improve typing speed and accuracy by transcribing the generated stories, with real-time WPM and accuracy tracking.
- **🔊 Pronunciation Feedback**: Record yourself reading the stories aloud and receive an AI-powered score on your pronunciation, with word-by-word feedback.
- **🌐 In-Context Translation**: Long-press any word in a story to instantly see its translation in your selected native language (Hindi or Telugu).
- **🤖 LiftBot AI Assistant**: A helpful chatbot that can answer questions about English grammar, vocabulary, sentence structure, or how to use the app.
- **✨ Personalized Exercises**: After typing or pronunciation sessions, the app generates custom practice sentences focusing on the words you struggled with.
- **📊 Progress Tracking**: A comprehensive profile page tracks your daily streak, goal completion, and performance trends for typing speed and accuracy over time.
- **👋 User-Friendly Onboarding**: A simple setup process to select your native language and get a tour of the app's features.

## 🛠️ How to Use

### 1. Getting Started
When you first open the app, you'll be greeted with an onboarding screen.
- **Select your mother tongue** (Hindi or Telugu). This will be used for word translations.
- A quick tour will introduce you to the main features of the app.

### 2. Learning a Story
- From the **Home** screen, navigate to the **Learn** section.
- Read the story provided. For a new story, click the **'New Story'** button.
- **To translate a word**, long-press (click and hold) on it. A popup will show its meaning in your native language.
- **To hear the story**, click the **'Listen'** button.

### 3. Practicing Typing
- Go to the **Type** section.
- The current story will be displayed. Click the text area and start typing.
- Your WPM (Words Per Minute) and accuracy will be updated live.
- After you finish, you might see a **Personalized Practice** card appear below with an exercise tailored to your mistakes.

### 4. Practicing Pronunciation
- Go to the **Pronounce** section.
- **Hear it First**: You can type any word or sentence into the top input box and press 'Listen' to hear how it's pronounced correctly.
- **Practice Aloud**: Click the **'Start Listening'** button (you may need to grant microphone permission). Read the story text clearly.
- Click **'Stop & See Score'** when you're done. Your speech will be analyzed, and you'll receive an overall score. Words will be color-coded based on your pronunciation accuracy.

### 5. Getting Help from LiftBot
- Click the **chat icon** floating in the bottom-right corner of the screen.
- The LiftBot chat window will open.
- Type any question you have about English or the app, and the AI assistant will help you.

### 6. Viewing Your Profile & Settings
- Click the **profile icon** in the top-right corner.
- Here you can:
    - Set your name.
    - View your daily learning streak and goal progress.
    - See charts of your WPM and accuracy trends.
    - Change your English proficiency level for story generation.
    - Switch your native language.

## 💻 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)

## 🔧 Local Setup

This application is designed to run directly in a browser that supports modern JavaScript (ES modules).

1.  **API Key**: The application requires a Google Gemini API key. This key must be available as an environment variable named `API_KEY`. The application code accesses it via `process.env.API_KEY`.
2.  **Serving the Files**: Serve the `index.html` and other project files from a local web server.

Enjoy your journey to mastering English!
