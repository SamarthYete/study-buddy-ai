import streamlit as st
import os
from pathlib import Path
import json
from datetime import datetime
from typing import Optional
import re

# Set page config
st.set_page_config(
    page_title="StudyBuddy AI",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
.main-header {
    font-size: 2.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1rem;
}
.feature-card {
    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #667eea30;
    margin-bottom: 1rem;
}
.stTabs [data-baseweb="tab-list"] button {
    font-size: 16px;
    padding: 0.75rem 1.5rem;
}
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'study_history' not in st.session_state:
    st.session_state.study_history = []

if 'quiz_score' not in st.session_state:
    st.session_state.quiz_score = 0

if 'current_flashcard' not in st.session_state:
    st.session_state.current_flashcard = 0

if 'dark_mode' not in st.session_state:
    st.session_state.dark_mode = True

# Get OpenRouter API key
API_KEY = st.secrets.get('OPENROUTER_API_KEY', '')

if not API_KEY:
    st.warning("⚠️ OpenRouter API Key is not set! Please add it in Streamlit Cloud secrets.")
def get_ai_response(prompt: str, system_message: str = "") -> str:
    """
    Get response from OpenRouter API
    """
    try:
        import requests
        
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {"role": "system", "content": system_message if system_message else "You are a helpful educational AI assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Error calling AI API: {str(e)}"

def parse_quiz_response(response: str) -> list:
    """
    Parse AI response to extract quiz questions
    """
    questions = []
    # Simple parsing - in production you'd want more robust parsing
    lines = response.split('\n')
    for i, line in enumerate(lines):
        if line.strip().startswith(('1.', '2.', '3.', '4.', '5.')):
            questions.append({
                'question': line,
                'options': [],
                'correct': 0
            })
    return questions

# Main navigation
st.markdown('<h1 class="main-header">🎓 StudyBuddy AI</h1>', unsafe_allow_html=True)
st.markdown("*Your personal AI-powered study companion*")
st.markdown("---")

# Sidebar navigation
with st.sidebar:
    st.header("📚 Navigation")
    page = st.radio(
        "Select a feature:",
        ["🏠 Home", "🧠 Concept Explainer", "📄 Summarizer", 
         "❓ Quiz Generator", "🃏 Flashcards", "📜 History"],
        index=0
    )
    
    st.markdown("---")
    
# Settings section removed - API key is now managed securely via Streamlit Cloud secrets
    st.info("🔐 API Key Security: Your OpenRouter API key is securely stored in Streamlit Cloud secrets and is never displayed or exposed in the UI.")
    st.write("✅ API Key Status:", "🟢 Configured" if API_KEY else "🔴 Not Set")

# Page routing
if page == "🏠 Home":
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<div class="feature-card"><h3>🧠 Concept Explainer</h3><p>Get simple, clear AI explanations for any topic with real-world analogies</p></div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="feature-card"><h3>📄 Smart Summarizer</h3><p>Paste your notes and get concise bullet-point summaries instantly</p></div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<div class="feature-card"><h3>❓ Quiz Generator</h3><p>Auto-generate interactive MCQs on any subject with instant scoring</p></div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="feature-card"><h3>🃏 Flashcard Mode</h3><p>Interactive flashcards with navigation for spaced repetition study</p></div>', unsafe_allow_html=True)
    
    st.markdown("---")
    st.info("👈 Use the sidebar to navigate to different study features!")

elif page == "🧠 Concept Explainer":
    st.header("Concept Explainer")
    st.write("Get AI-powered explanations for complex concepts")
    
    topic = st.text_input("What concept would you like to learn about?")
    complexity = st.select_slider(
        "Explanation Complexity:",
        options=["Simple", "Intermediate", "Advanced"],
        value="Intermediate"
    )
    
    if st.button("🚀 Generate Explanation", use_container_width=True):
        if topic:
            with st.spinner("Generating explanation..."):
                prompt = f"Explain '{topic}' in a {complexity.lower()} way. Include real-world examples and analogies."
                response = get_ai_response(prompt)
                
                st.success("Explanation generated!")
                st.markdown(response)
                
                # Save to history
                st.session_state.study_history.append({
                    'type': 'Explanation',
                    'topic': topic,
                    'content': response,
                    'timestamp': datetime.now().isoformat()
                })
        else:
            st.warning("Please enter a topic")

elif page == "📄 Summarizer":
    st.header("Smart Summarizer")
    st.write("Convert your notes into concise summaries")
    
    notes = st.text_area("Paste your notes here:", height=200)
    summary_type = st.radio(
        "Summary Format:",
        ["Bullet Points", "Paragraph", "Key Points Only"],
        horizontal=True
    )
    
    if st.button("📝 Generate Summary", use_container_width=True):
        if notes:
            with st.spinner("Summarizing..."):
                prompt = f"Summarize the following notes in {summary_type.lower()} format:\n\n{notes}"
                response = get_ai_response(prompt)
                
                st.success("Summary generated!")
                st.markdown(response)
                
                # Save to history
                st.session_state.study_history.append({
                    'type': 'Summary',
                    'content': response,
                    'timestamp': datetime.now().isoformat()
                })
        else:
            st.warning("Please paste some notes")

elif page == "❓ Quiz Generator":
    st.header("Quiz Generator")
    st.write("Test your knowledge with AI-generated quizzes")
    
    topic = st.text_input("Quiz Topic:")
    num_questions = st.slider("Number of Questions:", 1, 10, 5)
    difficulty = st.select_slider(
        "Difficulty:",
        options=["Easy", "Medium", "Hard"],
        value="Medium"
    )
    
    if st.button("🎯 Generate Quiz", use_container_width=True):
        if topic:
            with st.spinner("Generating quiz..."):
                prompt = f"Create a {num_questions}-question multiple choice quiz about '{topic}' at {difficulty.lower()} level. Format each question as:\nQ: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nCorrect: [letter]"
                response = get_ai_response(prompt)
                
                st.success("Quiz generated!")
                st.markdown(response)
                
                # Save to history
                st.session_state.study_history.append({
                    'type': 'Quiz',
                    'topic': topic,
                    'content': response,
                    'timestamp': datetime.now().isoformat()
                })
        else:
            st.warning("Please enter a topic")

elif page == "🃏 Flashcards":
    st.header("Flashcard Mode")
    st.write("Create interactive flashcards for spaced repetition")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        topic = st.text_input("Create flashcards for:")
    with col2:
        num_cards = st.number_input("Number of cards:", 1, 20, 5)
    
    if st.button("📇 Generate Flashcards", use_container_width=True):
        if topic:
            with st.spinner("Generating flashcards..."):
                prompt = f"Create {num_cards} flashcard pairs about '{topic}'. Format as:\nQ1: [question]\nA1: [answer]\n\nQ2: [question]\nA2: [answer]"
                response = get_ai_response(prompt)
                
                st.success("Flashcards generated!")
                st.markdown(response)
                
                # Save to history
                st.session_state.study_history.append({
                    'type': 'Flashcards',
                    'topic': topic,
                    'content': response,
                    'timestamp': datetime.now().isoformat()
                })
        else:
            st.warning("Please enter a topic")

elif page == "📜 History":
    st.header("Study History")
    st.write("Review your past study sessions")
    
    if st.session_state.study_history:
        for i, item in enumerate(reversed(st.session_state.study_history)):
            with st.expander(f"{item['type']} - {item.get('topic', 'Session')} ({item['timestamp'][:10]})"):
                st.write(item['content'])
    else:
        st.info("No study history yet. Start studying to see your history!")

st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #888;'>
    <p>Built with ❤️ using Streamlit | AI powered by OpenRouter</p>
    <p><a href='https://openrouter.ai' target='_blank'>Get free API key</a></p>
</div>
""", unsafe_allow_html=True)
