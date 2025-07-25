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
