// Oxford English Grammar - Interactive JavaScript

class GrammarApp {
    constructor() {
        this.currentSection = 'home';
        this.currentExercise = null;
        this.exerciseData = {};
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupGrammarTopics();
        this.setupExercises();
        this.loadGrammarContent();
        this.loadExerciseData();
    }

    // Navigation System
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const featureButtons = document.querySelectorAll('[data-section]');
        
        [...navButtons, ...featureButtons].forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionName) {
                btn.classList.add('active');
            }
        });
    }

    // Grammar Topics System
    setupGrammarTopics() {
        const topicCards = document.querySelectorAll('.topic-card');
        const backBtn = document.getElementById('back-to-topics');
        
        topicCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const topic = e.currentTarget.getAttribute('data-topic');
                this.showTopicDetail(topic);
            });
        });

        backBtn.addEventListener('click', () => {
            this.hideTopicDetail();
        });
    }

    showTopicDetail(topicName) {
        const topicGrid = document.querySelector('.topic-grid');
        const topicDetail = document.getElementById('topic-detail');
        const topicContent = document.getElementById('topic-content');
        
        topicGrid.style.display = 'none';
        topicDetail.classList.remove('hidden');
        
        // Load topic content
        const content = this.getTopicContent(topicName);
        topicContent.innerHTML = content;
    }

    hideTopicDetail() {
        const topicGrid = document.querySelector('.topic-grid');
        const topicDetail = document.getElementById('topic-detail');
        
        topicGrid.style.display = 'grid';
        topicDetail.classList.add('hidden');
    }

    // Exercise System
    setupExercises() {
        const exerciseButtons = document.querySelectorAll('.exercise-btn');
        const retryBtn = document.getElementById('retry-exercise');
        
        exerciseButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseType = e.target.getAttribute('data-exercise');
                this.startExercise(exerciseType);
                
                // Update button states
                exerciseButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        retryBtn.addEventListener('click', () => {
            if (this.currentExercise) {
                this.startExercise(this.currentExercise);
            }
        });
    }

    startExercise(exerciseType) {
        this.currentExercise = exerciseType;
        const exerciseArea = document.getElementById('exercise-area');
        const resultsArea = document.getElementById('exercise-results');
        
        resultsArea.classList.add('hidden');
        
        switch(exerciseType) {
            case 'multiple-choice':
                this.loadMultipleChoiceExercise(exerciseArea);
                break;
            case 'fill-blanks':
                this.loadFillBlanksExercise(exerciseArea);
                break;
            case 'sentence-correction':
                this.loadSentenceCorrectionExercise(exerciseArea);
                break;
        }
    }

    loadMultipleChoiceExercise(container) {
        const questions = this.exerciseData.multipleChoice;
        let html = '<h3>Multiple Choice Questions</h3>';
        
        questions.forEach((q, index) => {
            html += `
                <div class="question" data-question="${index}">
                    <h4>Question ${index + 1}: ${q.question}</h4>
                    <div class="options">
                        ${q.options.map((option, optIndex) => 
                            `<div class="option" data-option="${optIndex}">${option}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
        });
        
        html += '<button class="btn-primary mt-2" onclick="grammarApp.checkAnswers(\'multiple-choice\')">Check Answers</button>';
        container.innerHTML = html;
        
        // Add click handlers for options
        container.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                const question = e.target.closest('.question');
                question.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
    }

    loadFillBlanksExercise(container) {
        const questions = this.exerciseData.fillBlanks;
        let html = '<h3>Fill in the Blanks</h3>';
        
        questions.forEach((q, index) => {
            html += `
                <div class="question" data-question="${index}">
                    <h4>Question ${index + 1}:</h4>
                    <p>${q.sentence.replace('___', '<input type="text" class="blank-input" data-answer="' + q.answer + '">')}</p>
                </div>
            `;
        });
        
        html += '<button class="btn-primary mt-2" onclick="grammarApp.checkAnswers(\'fill-blanks\')">Check Answers</button>';
        container.innerHTML = html;
    }

    loadSentenceCorrectionExercise(container) {
        const questions = this.exerciseData.sentenceCorrection;
        let html = '<h3>Sentence Correction</h3><p>Identify and correct the grammatical errors:</p>';
        
        questions.forEach((q, index) => {
            html += `
                <div class="question" data-question="${index}">
                    <h4>Question ${index + 1}:</h4>
                    <p><strong>Original:</strong> ${q.incorrect}</p>
                    <textarea class="correction-input" placeholder="Write the corrected sentence here..." data-answer="${q.correct}"></textarea>
                </div>
            `;
        });
        
        html += '<button class="btn-primary mt-2" onclick="grammarApp.checkAnswers(\'sentence-correction\')">Check Answers</button>';
        container.innerHTML = html;
    }

    checkAnswers(exerciseType) {
        let score = 0;
        let total = 0;
        const questions = document.querySelectorAll('.question');
        
        questions.forEach((question, index) => {
            total++;
            
            switch(exerciseType) {
                case 'multiple-choice':
                    const selectedOption = question.querySelector('.option.selected');
                    const correctAnswer = this.exerciseData.multipleChoice[index].correct;
                    
                    if (selectedOption) {
                        const selectedIndex = parseInt(selectedOption.getAttribute('data-option'));
                        if (selectedIndex === correctAnswer) {
                            score++;
                            selectedOption.classList.add('correct');
                        } else {
                            selectedOption.classList.add('incorrect');
                        }
                        // Show correct answer
                        question.querySelectorAll('.option')[correctAnswer].classList.add('correct');
                    }
                    break;
                    
                case 'fill-blanks':
                    const input = question.querySelector('.blank-input');
                    const correctAnswer2 = input.getAttribute('data-answer').toLowerCase();
                    const userAnswer = input.value.toLowerCase().trim();
                    
                    if (userAnswer === correctAnswer2) {
                        score++;
                        input.style.backgroundColor = '#dcfce7';
                        input.style.borderColor = '#16a34a';
                    } else {
                        input.style.backgroundColor = '#fecaca';
                        input.style.borderColor = '#dc2626';
                        input.placeholder = `Correct: ${correctAnswer2}`;
                    }
                    break;
                    
                case 'sentence-correction':
                    const textarea = question.querySelector('.correction-input');
                    const correctAnswer3 = textarea.getAttribute('data-answer').toLowerCase();
                    const userAnswer3 = textarea.value.toLowerCase().trim();
                    
                    // Simple similarity check (in real app, you'd use more sophisticated comparison)
                    if (userAnswer3.includes(correctAnswer3.split(' ').slice(0, 3).join(' '))) {
                        score++;
                        textarea.style.backgroundColor = '#dcfce7';
                        textarea.style.borderColor = '#16a34a';
                    } else {
                        textarea.style.backgroundColor = '#fecaca';
                        textarea.style.borderColor = '#dc2626';
                        textarea.placeholder = `Suggested: ${correctAnswer3}`;
                    }
                    break;
            }
        });
        
        this.showResults(score, total);
    }

    showResults(score, total) {
        const resultsArea = document.getElementById('exercise-results');
        const scoreDisplay = document.getElementById('score-display');
        
        const percentage = Math.round((score / total) * 100);
        let message = '';
        
        if (percentage >= 90) message = 'Excellent work! 🎉';
        else if (percentage >= 70) message = 'Good job! 👍';
        else if (percentage >= 50) message = 'Keep practicing! 📚';
        else message = 'Review the topics and try again! 💪';
        
        scoreDisplay.innerHTML = `
            <div>Score: ${score}/${total} (${percentage}%)</div>
            <div>${message}</div>
        `;
        
        resultsArea.classList.remove('hidden');
    }

    // Content Loading
    loadGrammarContent() {
        this.grammarTopics = {
            'parts-of-speech': {
                title: 'Parts of Speech',
                content: `
                    <h3>Parts of Speech</h3>
                    <p>The English language has eight main parts of speech:</p>
                    
                    <div class="topic-section">
                        <h4>1. Nouns</h4>
                        <p>Words that name people, places, things, or ideas.</p>
                        <p><strong>Examples:</strong> cat, London, happiness, teacher</p>
                        <ul>
                            <li><strong>Common nouns:</strong> dog, city, book</li>
                            <li><strong>Proper nouns:</strong> John, Paris, Microsoft</li>
                            <li><strong>Abstract nouns:</strong> love, freedom, courage</li>
                            <li><strong>Collective nouns:</strong> team, family, flock</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>2. Verbs</h4>
                        <p>Words that express actions, states, or occurrences.</p>
                        <p><strong>Examples:</strong> run, think, become, exist</p>
                        <ul>
                            <li><strong>Action verbs:</strong> jump, write, sing</li>
                            <li><strong>Linking verbs:</strong> be, seem, appear</li>
                            <li><strong>Helping verbs:</strong> have, will, must</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>3. Adjectives</h4>
                        <p>Words that describe or modify nouns and pronouns.</p>
                        <p><strong>Examples:</strong> beautiful, large, intelligent, red</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>4. Adverbs</h4>
                        <p>Words that modify verbs, adjectives, or other adverbs.</p>
                        <p><strong>Examples:</strong> quickly, very, well, often</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>5. Pronouns</h4>
                        <p>Words that replace nouns.</p>
                        <p><strong>Examples:</strong> he, she, it, they, who, which</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>6. Prepositions</h4>
                        <p>Words that show relationships between nouns/pronouns and other words.</p>
                        <p><strong>Examples:</strong> in, on, at, by, with, under</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>7. Conjunctions</h4>
                        <p>Words that connect words, phrases, or clauses.</p>
                        <p><strong>Examples:</strong> and, but, or, because, although</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>8. Interjections</h4>
                        <p>Words that express emotion or exclamation.</p>
                        <p><strong>Examples:</strong> oh, wow, alas, hurray</p>
                    </div>
                `
            },
            'tenses': {
                title: 'Verb Tenses',
                content: `
                    <h3>Verb Tenses</h3>
                    <p>English has three main time periods, each with four aspects:</p>
                    
                    <div class="topic-section">
                        <h4>Present Tenses</h4>
                        <ul>
                            <li><strong>Simple Present:</strong> I work every day.</li>
                            <li><strong>Present Continuous:</strong> I am working now.</li>
                            <li><strong>Present Perfect:</strong> I have worked here for 5 years.</li>
                            <li><strong>Present Perfect Continuous:</strong> I have been working since morning.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Past Tenses</h4>
                        <ul>
                            <li><strong>Simple Past:</strong> I worked yesterday.</li>
                            <li><strong>Past Continuous:</strong> I was working when you called.</li>
                            <li><strong>Past Perfect:</strong> I had worked before you arrived.</li>
                            <li><strong>Past Perfect Continuous:</strong> I had been working for hours.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Future Tenses</h4>
                        <ul>
                            <li><strong>Simple Future:</strong> I will work tomorrow.</li>
                            <li><strong>Future Continuous:</strong> I will be working at 3 PM.</li>
                            <li><strong>Future Perfect:</strong> I will have worked by then.</li>
                            <li><strong>Future Perfect Continuous:</strong> I will have been working for 8 hours.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Usage Tips</h4>
                        <ul>
                            <li>Use simple tenses for general facts and regular actions</li>
                            <li>Use continuous tenses for ongoing actions</li>
                            <li>Use perfect tenses to show completed actions with relevance to another time</li>
                            <li>Use perfect continuous tenses for ongoing actions with duration</li>
                        </ul>
                    </div>
                `
            },
            'sentence-structure': {
                title: 'Sentence Structure',
                content: `
                    <h3>Sentence Structure</h3>
                    
                    <div class="topic-section">
                        <h4>Simple Sentences</h4>
                        <p>Contains one independent clause (subject + predicate).</p>
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>The cat sleeps.</li>
                            <li>Students study hard.</li>
                            <li>My sister and I went to the store.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Compound Sentences</h4>
                        <p>Contains two or more independent clauses joined by coordinating conjunctions.</p>
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>I wanted to go, but it was raining.</li>
                            <li>She studied hard, so she passed the exam.</li>
                            <li>We can go to the movies, or we can stay home.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Complex Sentences</h4>
                        <p>Contains one independent clause and one or more dependent clauses.</p>
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>Because it was raining, we stayed inside.</li>
                            <li>The book that you gave me is excellent.</li>
                            <li>When the bell rings, class will end.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Compound-Complex Sentences</h4>
                        <p>Contains multiple independent clauses and at least one dependent clause.</p>
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>Although it was late, we continued working, and we finished the project.</li>
                            <li>The students who studied hard passed the test, but those who didn't failed.</li>
                        </ul>
                    </div>
                `
            },
            'punctuation': {
                title: 'Punctuation',
                content: `
                    <h3>Punctuation Rules</h3>
                    
                    <div class="topic-section">
                        <h4>Period (.)</h4>
                        <p>Used at the end of declarative sentences and abbreviations.</p>
                        <p><strong>Examples:</strong> The meeting is at 3 PM. Dr. Smith will attend.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Comma (,)</h4>
                        <p>Used to separate items in a series, before conjunctions in compound sentences, and to set off introductory elements.</p>
                        <p><strong>Examples:</strong></p>
                        <ul>
                            <li>I bought apples, oranges, and bananas.</li>
                            <li>It was raining, so we stayed inside.</li>
                            <li>After the meeting, we went to lunch.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Semicolon (;)</h4>
                        <p>Used to connect closely related independent clauses.</p>
                        <p><strong>Example:</strong> The weather was perfect; we decided to have a picnic.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Colon (:)</h4>
                        <p>Used to introduce lists, explanations, or quotations.</p>
                        <p><strong>Example:</strong> You'll need the following items: pen, paper, and calculator.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Quotation Marks (" ")</h4>
                        <p>Used to enclose direct speech and quotations.</p>
                        <p><strong>Example:</strong> She said, "I'll be there at noon."</p>
                    </div>
                `
            },
            'conditionals': {
                title: 'Conditionals',
                content: `
                    <h3>Conditional Sentences</h3>
                    
                    <div class="topic-section">
                        <h4>Zero Conditional</h4>
                        <p>Used for general truths and scientific facts.</p>
                        <p><strong>Structure:</strong> If + present simple, present simple</p>
                        <p><strong>Example:</strong> If you heat water to 100°C, it boils.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>First Conditional</h4>
                        <p>Used for real possibilities in the future.</p>
                        <p><strong>Structure:</strong> If + present simple, will + base verb</p>
                        <p><strong>Example:</strong> If it rains tomorrow, I will stay home.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Second Conditional</h4>
                        <p>Used for hypothetical situations in the present or future.</p>
                        <p><strong>Structure:</strong> If + past simple, would + base verb</p>
                        <p><strong>Example:</strong> If I won the lottery, I would travel the world.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Third Conditional</h4>
                        <p>Used for hypothetical situations in the past.</p>
                        <p><strong>Structure:</strong> If + past perfect, would have + past participle</p>
                        <p><strong>Example:</strong> If I had studied harder, I would have passed the exam.</p>
                    </div>
                `
            },
            'passive-voice': {
                title: 'Passive Voice',
                content: `
                    <h3>Passive Voice</h3>
                    
                    <div class="topic-section">
                        <h4>Formation</h4>
                        <p><strong>Structure:</strong> be + past participle</p>
                        <p><strong>Active:</strong> The chef cooks the meal.</p>
                        <p><strong>Passive:</strong> The meal is cooked by the chef.</p>
                    </div>
                    
                    <div class="topic-section">
                        <h4>When to Use Passive Voice</h4>
                        <ul>
                            <li>When the action is more important than who performs it</li>
                            <li>When the performer is unknown or obvious</li>
                            <li>In formal or scientific writing</li>
                            <li>To avoid responsibility or blame</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Passive Voice in Different Tenses</h4>
                        <ul>
                            <li><strong>Present:</strong> The letter is written.</li>
                            <li><strong>Past:</strong> The letter was written.</li>
                            <li><strong>Future:</strong> The letter will be written.</li>
                            <li><strong>Present Perfect:</strong> The letter has been written.</li>
                            <li><strong>Past Perfect:</strong> The letter had been written.</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Tips</h4>
                        <ul>
                            <li>Use active voice when possible for clearer writing</li>
                            <li>The "by" phrase can often be omitted in passive voice</li>
                            <li>Some verbs cannot be made passive (intransitive verbs)</li>
                        </ul>
                    </div>
                `
            }
        };
    }

    loadExerciseData() {
        this.exerciseData = {
            multipleChoice: [
                {
                    question: "Which of the following is a proper noun?",
                    options: ["city", "London", "happiness", "quickly"],
                    correct: 1
                },
                {
                    question: "What type of verb is 'seem' in the sentence 'She seems happy'?",
                    options: ["Action verb", "Helping verb", "Linking verb", "Modal verb"],
                    correct: 2
                },
                {
                    question: "Which sentence is in the present perfect tense?",
                    options: ["I work every day", "I am working now", "I have worked here for 5 years", "I will work tomorrow"],
                    correct: 2
                },
                {
                    question: "What type of sentence is: 'Although it was raining, we went for a walk'?",
                    options: ["Simple", "Compound", "Complex", "Compound-complex"],
                    correct: 2
                }
            ],
            fillBlanks: [
                {
                    sentence: "She ___ to the store every morning.",
                    answer: "goes"
                },
                {
                    sentence: "They ___ been studying for three hours.",
                    answer: "have"
                },
                {
                    sentence: "If I ___ rich, I would buy a mansion.",
                    answer: "were"
                },
                {
                    sentence: "The book ___ written by Shakespeare.",
                    answer: "was"
                }
            ],
            sentenceCorrection: [
                {
                    incorrect: "Me and my friend went to the movies.",
                    correct: "My friend and I went to the movies."
                },
                {
                    incorrect: "She don't like chocolate.",
                    correct: "She doesn't like chocolate."
                },
                {
                    incorrect: "I have went to the store.",
                    correct: "I have gone to the store."
                },
                {
                    incorrect: "There house is beautiful.",
                    correct: "Their house is beautiful."
                }
            ]
        };
    }

    getTopicContent(topicName) {
        return this.grammarTopics[topicName]?.content || '<p>Content not available.</p>';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.grammarApp = new GrammarApp();
});

// Add some CSS for the topic sections
const style = document.createElement('style');
style.textContent = `
    .topic-section {
        background: #f9fafb;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-left: 4px solid #3b82f6;
    }
    
    .topic-section h4 {
        color: #1e3a8a;
        margin-bottom: 0.5rem;
    }
    
    .topic-section ul {
        margin-left: 1rem;
    }
    
    .topic-section li {
        margin-bottom: 0.5rem;
    }
    
    .blank-input, .correction-input {
        padding: 0.5rem;
        border: 2px solid #e5e7eb;
        border-radius: 4px;
        font-size: 1rem;
        width: 200px;
    }
    
    .correction-input {
        width: 100%;
        min-height: 60px;
        resize: vertical;
        font-family: inherit;
    }
    
    .blank-input:focus, .correction-input:focus {
        outline: none;
        border-color: #3b82f6;
    }
`;
document.head.appendChild(style);
