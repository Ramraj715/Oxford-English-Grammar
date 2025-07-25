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
                    <h3>Parts of Speech - Comprehensive Guide</h3>
                    <p>The fundamental building blocks of English grammar. Every word belongs to one of these categories.</p>
                    
                    <div class="topic-section">
                        <h4>1. Noun</h4>
                        <p><strong>Definition:</strong> A word that names a person, place, thing, or idea.</p>
                        <p><strong>Rule Formula:</strong> Noun = Person/Place/Thing/Idea + [Singular/Plural] + [Common/Proper]</p>
                        
                        <h5>Types of Nouns:</h5>
                        <ul>
                            <li><strong>Common Nouns:</strong> General names (dog, city, book, happiness)</li>
                            <li><strong>Proper Nouns:</strong> Specific names, always capitalized (John, Paris, Microsoft, Christmas)</li>
                            <li><strong>Abstract Nouns:</strong> Ideas, emotions, concepts (love, freedom, courage, intelligence)</li>
                            <li><strong>Concrete Nouns:</strong> Physical objects (table, apple, mountain, car)</li>
                            <li><strong>Collective Nouns:</strong> Groups (team, family, flock, committee)</li>
                            <li><strong>Countable Nouns:</strong> Can be counted (book/books, child/children)</li>
                            <li><strong>Uncountable Nouns:</strong> Cannot be counted (water, information, advice)</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li>"The <em>teacher</em> gave the <em>students</em> their <em>homework</em>." (person, people, thing)</li>
                            <li>"<em>London</em> is famous for its <em>history</em>." (proper noun, abstract noun)</li>
                            <li>"The <em>committee</em> made an important <em>decision</em>." (collective noun, abstract noun)</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>2. Pronoun</h4>
                        <p><strong>Definition:</strong> A word that replaces a noun to avoid repetition.</p>
                        <p><strong>Rule Formula:</strong> Pronoun = Noun Substitute + [Person] + [Number] + [Gender] + [Case]</p>
                        
                        <h5>Types of Pronouns:</h5>
                        <ul>
                            <li><strong>Personal:</strong> I, you, he, she, it, we, they</li>
                            <li><strong>Possessive:</strong> mine, yours, his, hers, its, ours, theirs</li>
                            <li><strong>Reflexive:</strong> myself, yourself, himself, herself, itself, ourselves, themselves</li>
                            <li><strong>Demonstrative:</strong> this, that, these, those</li>
                            <li><strong>Interrogative:</strong> who, whom, whose, which, what</li>
                            <li><strong>Relative:</strong> who, whom, whose, which, that</li>
                            <li><strong>Indefinite:</strong> someone, anyone, everyone, nothing, all, some</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li>"John lost <em>his</em> keys. <em>He</em> looked everywhere for <em>them</em>."</li>
                            <li>"<em>This</em> is the book <em>that</em> <em>I</em> was telling you about."</li>
                            <li>"<em>Everyone</em> should do <em>their</em> best."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>3. Persons (Grammatical Person)</h4>
                        <p><strong>Definition:</strong> The relationship between the speaker, the person spoken to, and the person/thing spoken about.</p>
                        <p><strong>Rule Formula:</strong> Person = [1st/2nd/3rd] + [Singular/Plural] + [Subject/Object]</p>
                        
                        <h5>Three Persons:</h5>
                        <ul>
                            <li><strong>First Person:</strong> The speaker (I, me, we, us, my, our)</li>
                            <li><strong>Second Person:</strong> The person spoken to (you, your, yours)</li>
                            <li><strong>Third Person:</strong> The person/thing spoken about (he, she, it, they, him, her, them)</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>1st Person:</strong> "<em>I</em> am going to <em>my</em> friend's house."</li>
                            <li><strong>2nd Person:</strong> "<em>You</em> should finish <em>your</em> homework."</li>
                            <li><strong>3rd Person:</strong> "<em>She</em> gave <em>him</em> <em>her</em> book."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>4. Gender</h4>
                        <p><strong>Definition:</strong> The classification of nouns and pronouns as masculine, feminine, or neuter.</p>
                        <p><strong>Rule Formula:</strong> Gender = [Masculine/Feminine/Neuter] + [Natural/Grammatical]</p>
                        
                        <h5>Types of Gender:</h5>
                        <ul>
                            <li><strong>Masculine:</strong> he, him, his, man, boy, king, actor</li>
                            <li><strong>Feminine:</strong> she, her, hers, woman, girl, queen, actress</li>
                            <li><strong>Neuter:</strong> it, its, book, table, idea, happiness</li>
                            <li><strong>Common Gender:</strong> teacher, student, parent, child</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li>"The <em>king</em> ruled <em>his</em> kingdom wisely." (masculine)</li>
                            <li>"The <em>actress</em> forgot <em>her</em> lines." (feminine)</li>
                            <li>"The <em>book</em> lost <em>its</em> cover." (neuter)</li>
                            <li>"The <em>teacher</em> helped <em>their</em> students." (common gender)</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>5. Case</h4>
                        <p><strong>Definition:</strong> The form of a noun or pronoun that shows its grammatical function in a sentence.</p>
                        <p><strong>Rule Formula:</strong> Case = [Nominative/Objective/Possessive] + Function</p>
                        
                        <h5>Types of Cases:</h5>
                        <ul>
                            <li><strong>Nominative (Subject):</strong> I, you, he, she, it, we, they</li>
                            <li><strong>Objective (Object):</strong> me, you, him, her, it, us, them</li>
                            <li><strong>Possessive:</strong> my/mine, your/yours, his, her/hers, its, our/ours, their/theirs</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Nominative:</strong> "<em>She</em> gave the book to <em>him</em>." (She = subject)</li>
                            <li><strong>Objective:</strong> "She gave the book to <em>him</em>." (him = indirect object)</li>
                            <li><strong>Possessive:</strong> "<em>Her</em> book is on <em>his</em> desk." (showing ownership)</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>6. Verb</h4>
                        <p><strong>Definition:</strong> A word that expresses an action, state, or occurrence.</p>
                        <p><strong>Rule Formula:</strong> Verb = [Action/Linking/Helping] + [Tense] + [Voice] + [Mood]</p>
                        
                        <h5>Types of Verbs:</h5>
                        <ul>
                            <li><strong>Action Verbs:</strong> run, jump, write, think, create</li>
                            <li><strong>Linking Verbs:</strong> be, seem, appear, become, feel, look</li>
                            <li><strong>Helping Verbs:</strong> have, will, must, can, should, would</li>
                            <li><strong>Transitive:</strong> require an object (She reads <em>books</em>)</li>
                            <li><strong>Intransitive:</strong> don't require an object (He sleeps)</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Action:</strong> "She <em>runs</em> every morning."</li>
                            <li><strong>Linking:</strong> "The soup <em>tastes</em> delicious."</li>
                            <li><strong>Helping:</strong> "I <em>have</em> <em>finished</em> my work."</li>
                            <li><strong>Transitive:</strong> "He <em>threw</em> the ball."</li>
                            <li><strong>Intransitive:</strong> "The baby <em>cried</em>."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>7. Adjective</h4>
                        <p><strong>Definition:</strong> A word that describes or modifies a noun or pronoun.</p>
                        <p><strong>Rule Formula:</strong> Adjective = Descriptor + [Degree] + [Position] + Noun/Pronoun</p>
                        
                        <h5>Types of Adjectives:</h5>
                        <ul>
                            <li><strong>Descriptive:</strong> beautiful, large, red, intelligent</li>
                            <li><strong>Quantitative:</strong> many, few, several, enough</li>
                            <li><strong>Demonstrative:</strong> this, that, these, those</li>
                            <li><strong>Possessive:</strong> my, your, his, her, its, our, their</li>
                            <li><strong>Interrogative:</strong> which, what, whose</li>
                            <li><strong>Comparative:</strong> bigger, more beautiful, better</li>
                            <li><strong>Superlative:</strong> biggest, most beautiful, best</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li>"The <em>beautiful</em> <em>red</em> rose smells <em>wonderful</em>."</li>
                            <li>"<em>Several</em> <em>talented</em> students won <em>prestigious</em> awards."</li>
                            <li>"<em>This</em> book is <em>more interesting</em> than <em>that</em> one."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>8. Adverb</h4>
                        <p><strong>Definition:</strong> A word that modifies a verb, adjective, or another adverb.</p>
                        <p><strong>Rule Formula:</strong> Adverb = Modifier + [Manner/Time/Place/Degree/Frequency]</p>
                        
                        <h5>Types of Adverbs:</h5>
                        <ul>
                            <li><strong>Manner:</strong> quickly, carefully, beautifully, well</li>
                            <li><strong>Time:</strong> now, then, yesterday, soon, always</li>
                            <li><strong>Place:</strong> here, there, everywhere, outside</li>
                            <li><strong>Degree:</strong> very, quite, extremely, rather</li>
                            <li><strong>Frequency:</strong> often, sometimes, never, usually</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Modifying verb:</strong> "She sings <em>beautifully</em>."</li>
                            <li><strong>Modifying adjective:</strong> "The movie was <em>very</em> interesting."</li>
                            <li><strong>Modifying adverb:</strong> "He runs <em>quite</em> <em>quickly</em>."</li>
                            <li><strong>Sentence adverb:</strong> "<em>Fortunately</em>, we arrived on time."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>9. Conjunction</h4>
                        <p><strong>Definition:</strong> A word that connects words, phrases, clauses, or sentences.</p>
                        <p><strong>Rule Formula:</strong> Conjunction = Connector + [Coordinating/Subordinating/Correlative]</p>
                        
                        <h5>Types of Conjunctions:</h5>
                        <ul>
                            <li><strong>Coordinating:</strong> and, but, or, nor, for, so, yet (FANBOYS)</li>
                            <li><strong>Subordinating:</strong> because, although, since, while, if, when, unless</li>
                            <li><strong>Correlative:</strong> either...or, neither...nor, both...and, not only...but also</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Coordinating:</strong> "I wanted to go, <em>but</em> it was raining."</li>
                            <li><strong>Subordinating:</strong> "<em>Because</em> it was late, we went home."</li>
                            <li><strong>Correlative:</strong> "<em>Either</em> you come with us <em>or</em> you stay here."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>10. Interjection</h4>
                        <p><strong>Definition:</strong> A word or phrase that expresses sudden emotion or exclamation.</p>
                        <p><strong>Rule Formula:</strong> Interjection = Emotion/Exclamation + [!/?] + [Mild/Strong]</p>
                        
                        <h5>Types of Interjections:</h5>
                        <ul>
                            <li><strong>Joy:</strong> hurray, yay, hooray, wow</li>
                            <li><strong>Surprise:</strong> oh, ah, what, really</li>
                            <li><strong>Pain:</strong> ouch, ow, alas</li>
                            <li><strong>Approval:</strong> bravo, well done, excellent</li>
                            <li><strong>Disapproval:</strong> boo, shame, tsk tsk</li>
                            <li><strong>Greeting:</strong> hello, hi, hey</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li>"<em>Wow!</em> That was an amazing performance."</li>
                            <li>"<em>Ouch!</em> That really hurt."</li>
                            <li>"<em>Alas</em>, we cannot change the past."</li>
                            <li>"<em>Hey</em>, wait for me!"</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>11. Preposition</h4>
                        <p><strong>Definition:</strong> A word that shows the relationship between a noun/pronoun and other words in a sentence.</p>
                        <p><strong>Rule Formula:</strong> Preposition + Object = Prepositional Phrase</p>
                        
                        <h5>Types of Prepositions:</h5>
                        <ul>
                            <li><strong>Time:</strong> at, on, in, during, before, after, since</li>
                            <li><strong>Place:</strong> in, on, at, under, over, beside, between</li>
                            <li><strong>Direction:</strong> to, from, into, onto, through, toward</li>
                            <li><strong>Manner:</strong> by, with, without, like, as</li>
                            <li><strong>Compound:</strong> according to, because of, in spite of</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Time:</strong> "The meeting is <em>at</em> 3 PM <em>on</em> Monday."</li>
                            <li><strong>Place:</strong> "The book is <em>on</em> the table <em>in</em> the library."</li>
                            <li><strong>Direction:</strong> "She walked <em>to</em> the store <em>through</em> the park."</li>
                            <li><strong>Manner:</strong> "He solved the problem <em>with</em> great skill."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>12. Tense</h4>
                        <p><strong>Definition:</strong> The form of a verb that indicates when an action occurs.</p>
                        <p><strong>Rule Formula:</strong> Tense = Time (Past/Present/Future) + Aspect (Simple/Continuous/Perfect/Perfect Continuous)</p>
                        
                        <h5>Present Tenses:</h5>
                        <ul>
                            <li><strong>Simple Present:</strong> I work, She works</li>
                            <li><strong>Present Continuous:</strong> I am working, She is working</li>
                            <li><strong>Present Perfect:</strong> I have worked, She has worked</li>
                            <li><strong>Present Perfect Continuous:</strong> I have been working</li>
                        </ul>
                        
                        <h5>Past Tenses:</h5>
                        <ul>
                            <li><strong>Simple Past:</strong> I worked, She worked</li>
                            <li><strong>Past Continuous:</strong> I was working, She was working</li>
                            <li><strong>Past Perfect:</strong> I had worked, She had worked</li>
                            <li><strong>Past Perfect Continuous:</strong> I had been working</li>
                        </ul>
                        
                        <h5>Future Tenses:</h5>
                        <ul>
                            <li><strong>Simple Future:</strong> I will work, She will work</li>
                            <li><strong>Future Continuous:</strong> I will be working</li>
                            <li><strong>Future Perfect:</strong> I will have worked</li>
                            <li><strong>Future Perfect Continuous:</strong> I will have been working</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>13. Voice</h4>
                        <p><strong>Definition:</strong> The form of a verb that shows whether the subject performs or receives the action.</p>
                        <p><strong>Rule Formula:</strong> Voice = [Active: Subject + Verb + Object] OR [Passive: Object + be + Past Participle + by Subject]</p>
                        
                        <h5>Active Voice:</h5>
                        <ul>
                            <li><strong>Structure:</strong> Subject + Verb + Object</li>
                            <li><strong>Examples:</strong> "The chef <em>cooked</em> the meal." / "Students <em>are studying</em> grammar."</li>
                            <li><strong>Use:</strong> When the subject performs the action</li>
                        </ul>
                        
                        <h5>Passive Voice:</h5>
                        <ul>
                            <li><strong>Structure:</strong> Object + be + Past Participle + (by Subject)</li>
                            <li><strong>Examples:</strong> "The meal <em>was cooked</em> by the chef." / "Grammar <em>is being studied</em> by students."</li>
                            <li><strong>Use:</strong> When the object receives the action or the doer is unknown/unimportant</li>
                        </ul>
                        
                        <h5>Transformation Examples:</h5>
                        <ul>
                            <li><strong>Active:</strong> "Shakespeare wrote Hamlet." → <strong>Passive:</strong> "Hamlet was written by Shakespeare."</li>
                            <li><strong>Active:</strong> "The company will launch the product." → <strong>Passive:</strong> "The product will be launched by the company."</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>14. Narration (Direct and Indirect Speech)</h4>
                        <p><strong>Definition:</strong> The way speech or thoughts are reported in writing.</p>
                        <p><strong>Rule Formula:</strong> Direct = "Exact words" + Reporting verb | Indirect = Reporting verb + that + Changed words</p>
                        
                        <h5>Direct Speech:</h5>
                        <ul>
                            <li><strong>Definition:</strong> Exact words spoken, enclosed in quotation marks</li>
                            <li><strong>Examples:</strong> She said, "I am going home." / "Where are you going?" he asked.</li>
                        </ul>
                        
                        <h5>Indirect Speech:</h5>
                        <ul>
                            <li><strong>Definition:</strong> Reported speech without exact words</li>
                            <li><strong>Examples:</strong> She said that she was going home. / He asked where I was going.</li>
                        </ul>
                        
                        <h5>Transformation Rules:</h5>
                        <ul>
                            <li><strong>Tense Changes:</strong> Present → Past, Past → Past Perfect</li>
                            <li><strong>Pronoun Changes:</strong> I → he/she, you → I/he/she</li>
                            <li><strong>Time/Place Changes:</strong> now → then, here → there, today → that day</li>
                            <li><strong>Question Changes:</strong> "Are you ready?" → He asked if I was ready.</li>
                            <li><strong>Command Changes:</strong> "Close the door." → He told me to close the door.</li>
                        </ul>
                        
                        <h5>Examples:</h5>
                        <ul>
                            <li><strong>Statement:</strong> "I will come tomorrow." → She said she would come the next day.</li>
                            <li><strong>Question:</strong> "What time is it?" → He asked what time it was.</li>
                            <li><strong>Command:</strong> "Please help me." → She requested me to help her.</li>
                        </ul>
                    </div>
                `
            },
            'tenses': {
                title: 'Verb Tenses',
                content: `
                    <h3>Verb Tenses - Complete Reference</h3>
                    <p>English has three main time periods, each with four aspects. Master all 12 tenses with this comprehensive table:</p>
                    
                    <div class="table-container">
                        <div class="table-title">English Tense System</div>
                        <table class="grammar-table tense-table">
                            <thead>
                                <tr>
                                    <th>Tense</th>
                                    <th>Aspect</th>
                                    <th>Formula</th>
                                    <th>Example</th>
                                    <th>Usage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowspan="4"><strong>Present</strong></td>
                                    <td>Simple Present</td>
                                    <td><span class="formula">Subject + V1 + (s/es)</span></td>
                                    <td><span class="example">I work. / She works.</span></td>
                                    <td>Habits, facts, general truths</td>
                                </tr>
                                <tr>
                                    <td>Present Continuous</td>
                                    <td><span class="formula">Subject + am/is/are + V-ing</span></td>
                                    <td><span class="example">I am working. / She is working.</span></td>
                                    <td>Actions happening now</td>
                                </tr>
                                <tr>
                                    <td>Present Perfect</td>
                                    <td><span class="formula">Subject + have/has + V3</span></td>
                                    <td><span class="example">I have worked. / She has worked.</span></td>
                                    <td>Completed actions with present relevance</td>
                                </tr>
                                <tr>
                                    <td>Present Perfect Continuous</td>
                                    <td><span class="formula">Subject + have/has + been + V-ing</span></td>
                                    <td><span class="example">I have been working.</span></td>
                                    <td>Actions continuing from past to present</td>
                                </tr>
                                <tr>
                                    <td rowspan="4"><strong>Past</strong></td>
                                    <td>Simple Past</td>
                                    <td><span class="formula">Subject + V2</span></td>
                                    <td><span class="example">I worked. / She worked.</span></td>
                                    <td>Completed actions in the past</td>
                                </tr>
                                <tr>
                                    <td>Past Continuous</td>
                                    <td><span class="formula">Subject + was/were + V-ing</span></td>
                                    <td><span class="example">I was working. / They were working.</span></td>
                                    <td>Ongoing actions in the past</td>
                                </tr>
                                <tr>
                                    <td>Past Perfect</td>
                                    <td><span class="formula">Subject + had + V3</span></td>
                                    <td><span class="example">I had worked. / She had worked.</span></td>
                                    <td>Actions completed before another past action</td>
                                </tr>
                                <tr>
                                    <td>Past Perfect Continuous</td>
                                    <td><span class="formula">Subject + had + been + V-ing</span></td>
                                    <td><span class="example">I had been working.</span></td>
                                    <td>Ongoing actions before another past action</td>
                                </tr>
                                <tr>
                                    <td rowspan="4"><strong>Future</strong></td>
                                    <td>Simple Future</td>
                                    <td><span class="formula">Subject + will + V1</span></td>
                                    <td><span class="example">I will work. / She will work.</span></td>
                                    <td>Future actions or decisions</td>
                                </tr>
                                <tr>
                                    <td>Future Continuous</td>
                                    <td><span class="formula">Subject + will + be + V-ing</span></td>
                                    <td><span class="example">I will be working.</span></td>
                                    <td>Ongoing actions in the future</td>
                                </tr>
                                <tr>
                                    <td>Future Perfect</td>
                                    <td><span class="formula">Subject + will + have + V3</span></td>
                                    <td><span class="example">I will have worked.</span></td>
                                    <td>Actions completed before a future time</td>
                                </tr>
                                <tr>
                                    <td>Future Perfect Continuous</td>
                                    <td><span class="formula">Subject + will + have + been + V-ing</span></td>
                                    <td><span class="example">I will have been working.</span></td>
                                    <td>Ongoing actions continuing until a future time</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Key Notes:</h4>
                        <ul>
                            <li><strong>V1:</strong> Base form of verb (work, go, eat)</li>
                            <li><strong>V2:</strong> Past form of verb (worked, went, ate)</li>
                            <li><strong>V3:</strong> Past participle (worked, gone, eaten)</li>
                            <li><strong>V-ing:</strong> Present participle (working, going, eating)</li>
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
                title: 'Voice - Active and Passive',
                content: `
                    <h3>Voice - Active and Passive Transformation</h3>
                    <p>Voice shows whether the subject performs or receives the action. Master the transformation rules with this comprehensive guide:</p>
                    
                    <div class="table-container">
                        <div class="table-title">Active to Passive Voice Transformation Rules</div>
                        <table class="grammar-table voice-table">
                            <thead>
                                <tr>
                                    <th>Tense</th>
                                    <th>Active Voice Formula</th>
                                    <th>Passive Voice Formula</th>
                                    <th>Active Example</th>
                                    <th>Passive Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Simple Present</strong></td>
                                    <td><span class="formula">S + V1 + O</span></td>
                                    <td><span class="formula">O + am/is/are + V3 + by S</span></td>
                                    <td><span class="example">She writes letters.</span></td>
                                    <td><span class="example">Letters are written by her.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Present Continuous</strong></td>
                                    <td><span class="formula">S + am/is/are + V-ing + O</span></td>
                                    <td><span class="formula">O + am/is/are + being + V3 + by S</span></td>
                                    <td><span class="example">He is reading a book.</span></td>
                                    <td><span class="example">A book is being read by him.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Present Perfect</strong></td>
                                    <td><span class="formula">S + have/has + V3 + O</span></td>
                                    <td><span class="formula">O + have/has + been + V3 + by S</span></td>
                                    <td><span class="example">They have completed the work.</span></td>
                                    <td><span class="example">The work has been completed by them.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Simple Past</strong></td>
                                    <td><span class="formula">S + V2 + O</span></td>
                                    <td><span class="formula">O + was/were + V3 + by S</span></td>
                                    <td><span class="example">John built the house.</span></td>
                                    <td><span class="example">The house was built by John.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Past Continuous</strong></td>
                                    <td><span class="formula">S + was/were + V-ing + O</span></td>
                                    <td><span class="formula">O + was/were + being + V3 + by S</span></td>
                                    <td><span class="example">She was cooking dinner.</span></td>
                                    <td><span class="example">Dinner was being cooked by her.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Past Perfect</strong></td>
                                    <td><span class="formula">S + had + V3 + O</span></td>
                                    <td><span class="formula">O + had + been + V3 + by S</span></td>
                                    <td><span class="example">We had finished the project.</span></td>
                                    <td><span class="example">The project had been finished by us.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Simple Future</strong></td>
                                    <td><span class="formula">S + will + V1 + O</span></td>
                                    <td><span class="formula">O + will + be + V3 + by S</span></td>
                                    <td><span class="example">They will solve the problem.</span></td>
                                    <td><span class="example">The problem will be solved by them.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Future Perfect</strong></td>
                                    <td><span class="formula">S + will + have + V3 + O</span></td>
                                    <td><span class="formula">O + will + have + been + V3 + by S</span></td>
                                    <td><span class="example">I will have written the report.</span></td>
                                    <td><span class="example">The report will have been written by me.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Modal Verbs</strong></td>
                                    <td><span class="formula">S + Modal + V1 + O</span></td>
                                    <td><span class="formula">O + Modal + be + V3 + by S</span></td>
                                    <td><span class="example">You can solve this puzzle.</span></td>
                                    <td><span class="example">This puzzle can be solved by you.</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Key Transformation Rules:</h4>
                        <ul>
                            <li><strong>Subject ↔ Object:</strong> Active subject becomes passive agent (by + subject)</li>
                            <li><strong>Verb Changes:</strong> Active verb → be + past participle</li>
                            <li><strong>Tense Maintained:</strong> The tense remains the same in transformation</li>
                            <li><strong>Agent Optional:</strong> 'by + subject' can be omitted if not important</li>
                        </ul>
                    </div>
                    
                    <div class="topic-section">
                        <h4>When to Use Passive Voice:</h4>
                        <ul>
                            <li>When the doer is unknown: "My car was stolen."</li>
                            <li>When the action is more important: "The bridge was completed in 2020."</li>
                            <li>In formal/scientific writing: "The experiment was conducted carefully."</li>
                            <li>When the doer is obvious: "The criminal was arrested."</li>
                        </ul>
                    </div>
                `
            },
            'narration': {
                title: 'Narration - Direct and Indirect Speech',
                content: `
                    <h3>Narration - Direct and Indirect Speech Transformation</h3>
                    <p>Master the art of converting direct speech to indirect speech with these comprehensive transformation tables:</p>
                    
                    <div class="table-container">
                        <div class="table-title">Person Change Rules</div>
                        <table class="grammar-table person-change-table">
                            <thead>
                                <tr>
                                    <th>Direct Speech</th>
                                    <th>Indirect Speech</th>
                                    <th>Example (Direct)</th>
                                    <th>Example (Indirect)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="formula">I</span></td>
                                    <td><span class="formula">he/she</span></td>
                                    <td><span class="example">"I am happy."</span></td>
                                    <td><span class="example">He said that he was happy.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">we</span></td>
                                    <td><span class="formula">they</span></td>
                                    <td><span class="example">"We are going."</span></td>
                                    <td><span class="example">They said that they were going.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">you</span></td>
                                    <td><span class="formula">I/he/she/they</span></td>
                                    <td><span class="example">"You are right."</span></td>
                                    <td><span class="example">He told me that I was right.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">my</span></td>
                                    <td><span class="formula">his/her</span></td>
                                    <td><span class="example">"This is my book."</span></td>
                                    <td><span class="example">She said that was her book.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">our</span></td>
                                    <td><span class="formula">their</span></td>
                                    <td><span class="example">"Our house is big."</span></td>
                                    <td><span class="example">They said their house was big.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">your</span></td>
                                    <td><span class="formula">my/his/her/their</span></td>
                                    <td><span class="example">"Your idea is good."</span></td>
                                    <td><span class="example">He said my idea was good.</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-container">
                        <div class="table-title">Tense Change Rules</div>
                        <table class="grammar-table tense-change-table">
                            <thead>
                                <tr>
                                    <th>Direct Speech Tense</th>
                                    <th>Indirect Speech Tense</th>
                                    <th>Direct Example</th>
                                    <th>Indirect Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="formula">Simple Present</span></td>
                                    <td><span class="formula">Simple Past</span></td>
                                    <td><span class="example">"I work here."</span></td>
                                    <td><span class="example">He said he worked there.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Present Continuous</span></td>
                                    <td><span class="formula">Past Continuous</span></td>
                                    <td><span class="example">"I am working."</span></td>
                                    <td><span class="example">She said she was working.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Present Perfect</span></td>
                                    <td><span class="formula">Past Perfect</span></td>
                                    <td><span class="example">"I have finished."</span></td>
                                    <td><span class="example">He said he had finished.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Simple Past</span></td>
                                    <td><span class="formula">Past Perfect</span></td>
                                    <td><span class="example">"I went home."</span></td>
                                    <td><span class="example">She said she had gone home.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Past Continuous</span></td>
                                    <td><span class="formula">Past Perfect Continuous</span></td>
                                    <td><span class="example">"I was studying."</span></td>
                                    <td><span class="example">He said he had been studying.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Will + V1</span></td>
                                    <td><span class="formula">Would + V1</span></td>
                                    <td><span class="example">"I will come."</span></td>
                                    <td><span class="example">She said she would come.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">Can</span></td>
                                    <td><span class="formula">Could</span></td>
                                    <td><span class="example">"I can help."</span></td>
                                    <td><span class="example">He said he could help.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">May</span></td>
                                    <td><span class="formula">Might</span></td>
                                    <td><span class="example">"I may go."</span></td>
                                    <td><span class="example">She said she might go.</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-container">
                        <div class="table-title">Adverbial Change Rules</div>
                        <table class="grammar-table adverbial-change-table">
                            <thead>
                                <tr>
                                    <th>Direct Speech</th>
                                    <th>Indirect Speech</th>
                                    <th>Direct Example</th>
                                    <th>Indirect Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><span class="formula">now</span></td>
                                    <td><span class="formula">then</span></td>
                                    <td><span class="example">"I am busy now."</span></td>
                                    <td><span class="example">He said he was busy then.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">today</span></td>
                                    <td><span class="formula">that day</span></td>
                                    <td><span class="example">"I will go today."</span></td>
                                    <td><span class="example">She said she would go that day.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">tomorrow</span></td>
                                    <td><span class="formula">the next day</span></td>
                                    <td><span class="example">"I will come tomorrow."</span></td>
                                    <td><span class="example">He said he would come the next day.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">yesterday</span></td>
                                    <td><span class="formula">the previous day</span></td>
                                    <td><span class="example">"I went yesterday."</span></td>
                                    <td><span class="example">She said she had gone the previous day.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">here</span></td>
                                    <td><span class="formula">there</span></td>
                                    <td><span class="example">"I live here."</span></td>
                                    <td><span class="example">He said he lived there.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">this</span></td>
                                    <td><span class="formula">that</span></td>
                                    <td><span class="example">"This is my car."</span></td>
                                    <td><span class="example">She said that was her car.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">these</span></td>
                                    <td><span class="formula">those</span></td>
                                    <td><span class="example">"These are mine."</span></td>
                                    <td><span class="example">He said those were his.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">last week/month</span></td>
                                    <td><span class="formula">the previous week/month</span></td>
                                    <td><span class="example">"I traveled last week."</span></td>
                                    <td><span class="example">She said she had traveled the previous week.</span></td>
                                </tr>
                                <tr>
                                    <td><span class="formula">next week/month</span></td>
                                    <td><span class="formula">the following week/month</span></td>
                                    <td><span class="example">"I will travel next week."</span></td>
                                    <td><span class="example">He said he would travel the following week.</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="table-container">
                        <div class="table-title">Punctuation and Structure Change Rules</div>
                        <table class="grammar-table punctuation-change-table">
                            <thead>
                                <tr>
                                    <th>Speech Type</th>
                                    <th>Direct Speech Structure</th>
                                    <th>Indirect Speech Structure</th>
                                    <th>Example Transformation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Statement</strong></td>
                                    <td><span class="formula">"Statement."</span></td>
                                    <td><span class="formula">that + statement</span></td>
                                    <td><span class="example">"I am tired." → He said that he was tired.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Yes/No Question</strong></td>
                                    <td><span class="formula">"Are you...?"</span></td>
                                    <td><span class="formula">if/whether + statement</span></td>
                                    <td><span class="example">"Are you coming?" → She asked if I was coming.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Wh-Question</strong></td>
                                    <td><span class="formula">"What/Where/When...?"</span></td>
                                    <td><span class="formula">Wh-word + statement</span></td>
                                    <td><span class="example">"Where do you live?" → He asked where I lived.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Command</strong></td>
                                    <td><span class="formula">"Do this!"</span></td>
                                    <td><span class="formula">to + infinitive</span></td>
                                    <td><span class="example">"Close the door!" → She told me to close the door.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Negative Command</strong></td>
                                    <td><span class="formula">"Don't do this!"</span></td>
                                    <td><span class="formula">not to + infinitive</span></td>
                                    <td><span class="example">"Don't be late!" → He told me not to be late.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Request</strong></td>
                                    <td><span class="formula">"Please do this."</span></td>
                                    <td><span class="formula">requested + to + infinitive</span></td>
                                    <td><span class="example">"Please help me." → She requested me to help her.</span></td>
                                </tr>
                                <tr>
                                    <td><strong>Exclamation</strong></td>
                                    <td><span class="formula">"How/What...!"</span></td>
                                    <td><span class="formula">exclaimed + that</span></td>
                                    <td><span class="example">"How beautiful!" → She exclaimed that it was very beautiful.</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="topic-section">
                        <h4>Key Reporting Verbs:</h4>
                        <ul>
                            <li><strong>For Statements:</strong> said, told, mentioned, explained, declared</li>
                            <li><strong>For Questions:</strong> asked, inquired, wanted to know, wondered</li>
                            <li><strong>For Commands:</strong> told, ordered, commanded, instructed</li>
                            <li><strong>For Requests:</strong> requested, asked, begged, urged</li>
                            <li><strong>For Exclamations:</strong> exclaimed, cried out, shouted</li>
                        </ul>
                    </div>
                `
            }
        };
    }

    loadExerciseData() {
        this.exerciseData = {
            multipleChoice: [
                // Nouns (Questions 1-10)
                {
                    question: "Which of the following is a proper noun?",
                    options: ["city", "London", "happiness", "quickly"],
                    correct: 1
                },
                {
                    question: "What type of noun is 'team' in 'The team won the match'?",
                    options: ["Common noun", "Proper noun", "Collective noun", "Abstract noun"],
                    correct: 2
                },
                {
                    question: "Which is an abstract noun?",
                    options: ["table", "courage", "London", "children"],
                    correct: 1
                },
                {
                    question: "What type of noun is 'water'?",
                    options: ["Countable", "Uncountable", "Proper", "Collective"],
                    correct: 1
                },
                {
                    question: "Which sentence contains a concrete noun?",
                    options: ["Love is beautiful", "I saw a mountain", "Happiness matters", "Freedom is important"],
                    correct: 1
                },
                {
                    question: "What is the plural of 'child'?",
                    options: ["childs", "childes", "children", "child's"],
                    correct: 2
                },
                {
                    question: "Which is a compound noun?",
                    options: ["beautiful", "quickly", "toothbrush", "running"],
                    correct: 2
                },
                {
                    question: "What type of noun is 'information'?",
                    options: ["Countable", "Uncountable", "Proper", "Collective"],
                    correct: 1
                },
                {
                    question: "Which sentence has a possessive noun?",
                    options: ["The dog barks", "John's car is red", "She runs fast", "They are happy"],
                    correct: 1
                },
                {
                    question: "What is the collective noun for a group of bees?",
                    options: ["flock", "herd", "swarm", "pack"],
                    correct: 2
                },
                // Pronouns (Questions 11-15)
                {
                    question: "What type of pronoun is 'myself'?",
                    options: ["Personal", "Reflexive", "Demonstrative", "Interrogative"],
                    correct: 1
                },
                {
                    question: "Which is a demonstrative pronoun?",
                    options: ["he", "mine", "this", "who"],
                    correct: 2
                },
                {
                    question: "What is the object pronoun for 'she'?",
                    options: ["she", "her", "hers", "herself"],
                    correct: 1
                },
                {
                    question: "Which sentence uses a relative pronoun?",
                    options: ["I like this", "The book that I read", "She is happy", "We went home"],
                    correct: 1
                },
                {
                    question: "What type of pronoun is 'everyone'?",
                    options: ["Personal", "Possessive", "Indefinite", "Relative"],
                    correct: 2
                },
                // Verbs (Questions 16-25)
                {
                    question: "What type of verb is 'seem' in 'She seems happy'?",
                    options: ["Action verb", "Helping verb", "Linking verb", "Modal verb"],
                    correct: 2
                },
                {
                    question: "Which is a transitive verb?",
                    options: ["sleep", "run", "read", "arrive"],
                    correct: 2
                },
                {
                    question: "What is the past participle of 'go'?",
                    options: ["went", "going", "gone", "goes"],
                    correct: 2
                },
                {
                    question: "Which sentence has a helping verb?",
                    options: ["She sings well", "I have finished", "They run fast", "He looks tired"],
                    correct: 1
                },
                {
                    question: "What type of verb is 'must'?",
                    options: ["Action", "Linking", "Modal", "Regular"],
                    correct: 2
                },
                {
                    question: "Which is an irregular verb?",
                    options: ["walk", "talk", "break", "cook"],
                    correct: 2
                },
                {
                    question: "What is the base form of 'written'?",
                    options: ["wrote", "write", "writing", "writes"],
                    correct: 1
                },
                {
                    question: "Which sentence is in active voice?",
                    options: ["The book was read", "She reads books", "The door was opened", "The cake was eaten"],
                    correct: 1
                },
                {
                    question: "What is the gerund form of 'swim'?",
                    options: ["swam", "swum", "swimming", "swims"],
                    correct: 2
                },
                {
                    question: "Which verb shows a state of being?",
                    options: ["jump", "is", "write", "sing"],
                    correct: 1
                },
                // Tenses (Questions 26-35)
                {
                    question: "Which sentence is in present perfect tense?",
                    options: ["I work daily", "I am working", "I have worked", "I will work"],
                    correct: 2
                },
                {
                    question: "What tense is 'I was reading'?",
                    options: ["Simple past", "Past continuous", "Past perfect", "Present continuous"],
                    correct: 1
                },
                {
                    question: "Which shows future perfect tense?",
                    options: ["I will go", "I will be going", "I will have gone", "I am going"],
                    correct: 2
                },
                {
                    question: "What is the correct present continuous form?",
                    options: ["I work", "I am working", "I have worked", "I worked"],
                    correct: 1
                },
                {
                    question: "Which sentence uses past perfect?",
                    options: ["I went home", "I was going", "I had gone", "I have gone"],
                    correct: 2
                },
                {
                    question: "What tense is 'She will be studying'?",
                    options: ["Future simple", "Future continuous", "Future perfect", "Present continuous"],
                    correct: 1
                },
                {
                    question: "Which is simple present tense?",
                    options: ["I am eating", "I eat", "I have eaten", "I will eat"],
                    correct: 1
                },
                {
                    question: "What tense shows an action completed before another past action?",
                    options: ["Simple past", "Past continuous", "Past perfect", "Present perfect"],
                    correct: 2
                },
                {
                    question: "Which sentence is in present perfect continuous?",
                    options: ["I study", "I am studying", "I have studied", "I have been studying"],
                    correct: 3
                },
                {
                    question: "What is the past tense of 'begin'?",
                    options: ["began", "begun", "beginning", "begins"],
                    correct: 0
                },
                // Adjectives (Questions 36-40)
                {
                    question: "What type of adjective is 'beautiful'?",
                    options: ["Descriptive", "Possessive", "Demonstrative", "Quantitative"],
                    correct: 0
                },
                {
                    question: "Which is the superlative form of 'good'?",
                    options: ["gooder", "better", "best", "more good"],
                    correct: 2
                },
                {
                    question: "What is the comparative form of 'beautiful'?",
                    options: ["beautifuler", "more beautiful", "most beautiful", "beautifullest"],
                    correct: 1
                },
                {
                    question: "Which word is an adjective in 'The red car is fast'?",
                    options: ["car", "red", "is", "The"],
                    correct: 1
                },
                {
                    question: "What type of adjective is 'this' in 'this book'?",
                    options: ["Descriptive", "Demonstrative", "Possessive", "Quantitative"],
                    correct: 1
                },
                // Adverbs (Questions 41-45)
                {
                    question: "What type of adverb is 'quickly'?",
                    options: ["Time", "Place", "Manner", "Frequency"],
                    correct: 2
                },
                {
                    question: "Which word is an adverb in 'She sings beautifully'?",
                    options: ["She", "sings", "beautifully", "none"],
                    correct: 2
                },
                {
                    question: "What does the adverb 'very' modify in 'very beautiful'?",
                    options: ["Verb", "Noun", "Adjective", "Pronoun"],
                    correct: 2
                },
                {
                    question: "Which is an adverb of frequency?",
                    options: ["quickly", "here", "always", "very"],
                    correct: 2
                },
                {
                    question: "What is the adverb form of 'careful'?",
                    options: ["carefully", "carefuler", "carefulness", "care"],
                    correct: 0
                },
                // Voice (Questions 46-50)
                {
                    question: "Which sentence is in passive voice?",
                    options: ["She writes letters", "Letters are written by her", "She is writing", "She will write"],
                    correct: 1
                },
                {
                    question: "What is the passive form of 'They built the house'?",
                    options: ["The house built them", "The house was built by them", "They were built", "The house builds"],
                    correct: 1
                },
                {
                    question: "Which cannot be changed to passive voice?",
                    options: ["He reads books", "She sings songs", "They sleep well", "I write letters"],
                    correct: 2
                },
                {
                    question: "What is the active form of 'The cake was eaten by John'?",
                    options: ["John ate the cake", "The cake ate John", "John was eating", "The cake eats"],
                    correct: 0
                },
                {
                    question: "In passive voice, what happens to the subject?",
                    options: ["It disappears", "It becomes the object", "It becomes the agent", "It stays the same"],
                    correct: 2
                }
            ],
            fillBlanks: [
                // Tenses (1-15)
                { sentence: "She ___ to school every day.", answer: "goes" },
                { sentence: "They ___ been studying for three hours.", answer: "have" },
                { sentence: "I ___ watching TV when you called.", answer: "was" },
                { sentence: "By next year, I ___ have graduated.", answer: "will" },
                { sentence: "She ___ already finished her homework.", answer: "has" },
                { sentence: "We ___ living here since 2010.", answer: "have been" },
                { sentence: "He ___ work tomorrow because it's a holiday.", answer: "won't" },
                { sentence: "They ___ playing football when it started raining.", answer: "were" },
                { sentence: "I ___ never seen such a beautiful sunset.", answer: "have" },
                { sentence: "She ___ be arriving at 6 PM.", answer: "will" },
                { sentence: "We ___ been waiting for an hour.", answer: "have" },
                { sentence: "He ___ his keys yesterday.", answer: "lost" },
                { sentence: "They ___ to the movies last night.", answer: "went" },
                { sentence: "I ___ studying English for five years.", answer: "have been" },
                { sentence: "She ___ cooking when I arrived.", answer: "was" },
                // Articles and Prepositions (16-25)
                { sentence: "I saw ___ elephant at the zoo.", answer: "an" },
                { sentence: "The book is ___ the table.", answer: "on" },
                { sentence: "She lives ___ London.", answer: "in" },
                { sentence: "We met ___ the park.", answer: "at" },
                { sentence: "He walked ___ the street.", answer: "across" },
                { sentence: "The cat is hiding ___ the bed.", answer: "under" },
                { sentence: "She arrived ___ 3 o'clock.", answer: "at" },
                { sentence: "We're going ___ vacation next week.", answer: "on" },
                { sentence: "The picture hangs ___ the wall.", answer: "on" },
                { sentence: "He jumped ___ the pool.", answer: "into" },
                // Voice (26-30)
                { sentence: "The letter ___ written by John.", answer: "was" },
                { sentence: "The house ___ built in 1990.", answer: "was" },
                { sentence: "The problem ___ solved by the team.", answer: "was" },
                { sentence: "The song ___ sung beautifully.", answer: "was" },
                { sentence: "The project ___ completed yesterday.", answer: "was" },
                // Conditionals (31-35)
                { sentence: "If I ___ rich, I would travel the world.", answer: "were" },
                { sentence: "If it ___ tomorrow, we'll stay home.", answer: "rains" },
                { sentence: "If she ___ studied harder, she would have passed.", answer: "had" },
                { sentence: "If you heat water to 100°C, it ___.", answer: "boils" },
                { sentence: "If I ___ you, I would apologize.", answer: "were" }
            ],
            sentenceCorrection: [
                // Grammar Errors (1-15)
                { incorrect: "Me and my friend went to the movies.", correct: "My friend and I went to the movies." },
                { incorrect: "She don't like chocolate.", correct: "She doesn't like chocolate." },
                { incorrect: "I have went to the store.", correct: "I have gone to the store." },
                { incorrect: "There house is beautiful.", correct: "Their house is beautiful." },
                { incorrect: "Between you and I, this is a secret.", correct: "Between you and me, this is a secret." },
                { incorrect: "I could of helped you.", correct: "I could have helped you." },
                { incorrect: "Who's book is this?", correct: "Whose book is this?" },
                { incorrect: "Your going to love this movie.", correct: "You're going to love this movie." },
                { incorrect: "I seen him yesterday.", correct: "I saw him yesterday." },
                { incorrect: "She did good on the test.", correct: "She did well on the test." },
                { incorrect: "Can I lend your pen?", correct: "Can I borrow your pen?" },
                { incorrect: "I am more taller than him.", correct: "I am taller than him." },
                { incorrect: "Each of the students have a book.", correct: "Each of the students has a book." },
                { incorrect: "I don't have no money.", correct: "I don't have any money." },
                { incorrect: "The data shows interesting results.", correct: "The data show interesting results." },
                // Tense Errors (16-25)
                { incorrect: "I am knowing the answer.", correct: "I know the answer." },
                { incorrect: "She is having a car.", correct: "She has a car." },
                { incorrect: "I am understanding you.", correct: "I understand you." },
                { incorrect: "We was playing football.", correct: "We were playing football." },
                { incorrect: "He don't came yesterday.", correct: "He didn't come yesterday." },
                { incorrect: "I have saw that movie.", correct: "I have seen that movie." },
                { incorrect: "She has went home.", correct: "She has gone home." },
                { incorrect: "They was studying all night.", correct: "They were studying all night." },
                { incorrect: "I have wrote a letter.", correct: "I have written a letter." },
                { incorrect: "He has ate his lunch.", correct: "He has eaten his lunch." },
                // Preposition Errors (26-30)
                { incorrect: "I am good in mathematics.", correct: "I am good at mathematics." },
                { incorrect: "She is married with John.", correct: "She is married to John." },
                { incorrect: "I am interested for this job.", correct: "I am interested in this job." },
                { incorrect: "He is afraid from dogs.", correct: "He is afraid of dogs." },
                { incorrect: "She depends from her parents.", correct: "She depends on her parents." },
                // Word Order (31-35)
                { incorrect: "Always she is late.", correct: "She is always late." },
                { incorrect: "I like very much chocolate.", correct: "I like chocolate very much." },
                { incorrect: "He speaks English very good.", correct: "He speaks English very well." },
                { incorrect: "She is a teacher very good.", correct: "She is a very good teacher." },
                { incorrect: "I have been never to Paris.", correct: "I have never been to Paris." }
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
