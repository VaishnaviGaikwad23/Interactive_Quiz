// Question Bank with questions, options, correct answers, and explanations
const questionBank = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyperlinks and Text Markup Language",
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyper Text Making Language"
        ],
        correctAnswer: 1,
        explanation: "HTML (Hyper Text Markup Language) is the standard markup language for creating web pages and web applications.",
        hint: "It's the basic building block of web pages, defining their structure."
    },
    {
        question: "Which CSS property is used to change the text color of an element?",
        options: [
            "font-color",
            "text-color",
            "color",
            "text-style"
        ],
        correctAnswer: 2,
        explanation: "The 'color' property is used in CSS to specify the color of text. For example: p { color: red; }",
        hint: "It's a simple, one-word property that directly relates to what it controls."
    },
    {
        question: "Which JavaScript function is used to select an HTML element by its id?",
        options: [
            "document.querySelector()",
            "document.getElement()",
            "document.getElementById()",
            "document.getElementsByClassName()"
        ],
        correctAnswer: 2,
        explanation: "document.getElementById() returns the element that has the ID attribute with the specified value.",
        hint: "The function name includes 'Element' (singular) and refers to a specific identifier."
    },
    {
        question: "What is the correct syntax for referring to an external JavaScript file called 'script.js'?",
        options: [
            "<script href='script.js'>",
            "<script name='script.js'>",
            "<script src='script.js'>",
            "<script file='script.js'>"
        ],
        correctAnswer: 2,
        explanation: "The src attribute in the script tag specifies the URL of an external JavaScript file.",
        hint: "The attribute name is the same as what's used in img tags to specify the image file."
    },
    {
        question: "Which CSS property is used to add space between the border and content of an element?",
        options: [
            "margin",
            "padding",
            "spacing",
            "border-spacing"
        ],
        correctAnswer: 1,
        explanation: "Padding is the space between the content of an element and its border. Margin is the space outside the border.",
        hint: "Think of it as the internal cushioning of an element."
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correctAnswer: 2,
        explanation: "CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML.",
        hint: "The first word describes how styles can override each other in a specific order."
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        options: [
            "font",
            "class",
            "styles",
            "style"
        ],
        correctAnswer: 3,
        explanation: "The style attribute is used to add inline CSS to an HTML element. For example: <p style='color:blue;'>",
        hint: "It's the singular form of the word that describes what CSS does."
    }
];

// Variables to track quiz state
let currentQuestions = [];
let timer;
let timeLeft = 60;
let hintShown = {};

// Get references to elements
const quizElement = document.getElementById("quiz");
const questionsContainer = document.getElementById("questions-container");
const resultsElement = document.getElementById("results");
const scoreElement = document.getElementById("score");
const feedbackElement = document.getElementById("feedback");
const submitButton = document.getElementById("submit");
const restartButton = document.getElementById("restart");
const timerElement = document.getElementById("timer");

// Initialize the quiz
initializeQuiz();

// Add event listeners
submitButton.addEventListener("click", calculateScore);
restartButton.addEventListener("click", resetQuiz);

// Initialize the quiz
function initializeQuiz() {
    // Randomly select 5 questions from the question bank
    currentQuestions = getRandomQuestions(questionBank, 5);
    
    // Generate the quiz HTML
    generateQuizHTML();
    
    // Start the timer
    startTimer();
    
}

// Get random questions from the question bank
function getRandomQuestions(questions, num) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Generate HTML for the quiz questions
function generateQuizHTML() {
    questionsContainer.innerHTML = "";
    
    currentQuestions.forEach((q, index) => {
        const questionElement = document.createElement("div");
        questionElement.className = "question-container";
        
        const questionHTML = `
            <div class="question">${index + 1}. ${q.question}</div>
            <div class="options">
                ${q.options.map((option, i) => `
                    <div class="option">
                        <label>
                            <input type="radio" name="q${index}" value="${i}">
                            ${option}
                        </label>
                    </div>
                `).join('')}
            </div>
            <button class="hint-btn" data-question="${index}">Need a hint?</button>
            <div class="hint-text" id="hint-${index}">${q.hint}</div>
        `;
        
        questionElement.innerHTML = questionHTML;
        questionsContainer.appendChild(questionElement);
    });
    
    // Add event listeners to hint buttons
    document.querySelectorAll('.hint-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const questionIndex = this.getAttribute('data-question');
            const hintElement = document.getElementById(`hint-${questionIndex}`);
            hintElement.style.display = 'block';
            this.style.display = 'none';
            hintShown[questionIndex] = true;
        });
    });
    
}

// Start the timer
function startTimer() {
    timeLeft = 60;
    timerElement.textContent = timeLeft;
    timerElement.className = 'timer';
    
    timer = setInterval(function() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 30 && timeLeft > 10) {
            timerElement.className = 'timer warning';
        } else if (timeLeft <= 10) {
            timerElement.className = 'timer danger';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            calculateScore();
        }
    }, 1000);
}

// Calculate the score
function calculateScore() {
    // Stop the timer
    clearInterval(timer);
    
    let score = 0;
    let feedback = "";
    
    // Check each question
    currentQuestions.forEach((q, index) => {
        const questionName = `q${index}`;
        const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
        
        if (selectedOption) {
            const answer = parseInt(selectedOption.value);
            
            if (answer === q.correctAnswer) {
                score++;
                feedback += `
                    <div class="answer-feedback">
                        <span class="correct-answer">✓ Correct!</span> ${q.question}
                        <div class="explanation">${q.explanation}</div>
                    </div>
                `;
            } else {
                feedback += `
                    <div class="answer-feedback">
                        <span class="wrong-answer">✗ Incorrect.</span> ${q.question}
                        <div>The correct answer was: ${q.options[q.correctAnswer]}</div>
                        <div class="explanation">${q.explanation}</div>
                    </div>
                `;
            }
        } else {
            feedback += `
                <div class="answer-feedback">
                    <span class="wrong-answer">✗ Not answered.</span> ${q.question}
                    <div>The correct answer was: ${q.options[q.correctAnswer]}</div>
                    <div class="explanation">${q.explanation}</div>
                </div>
            `;
        }
    });
    
    // Display results
    const totalQuestions = currentQuestions.length;
    scoreElement.textContent = `${score}/${totalQuestions} (${(score/totalQuestions*100).toFixed(0)}%)`;
    feedbackElement.innerHTML = feedback;
    
    // Add performance message
    let performanceMessage = "";
    const percentage = (score/totalQuestions*100);
    
    if (percentage >= 90) {
        performanceMessage = "Excellent! You have a strong understanding of web development concepts.";
    } else if (percentage >= 70) {
        performanceMessage = "Good job! You have a solid grasp of most web development concepts.";
    } else if (percentage >= 50) {
        performanceMessage = "Not bad. With a bit more study, you'll improve your web development knowledge.";
    } else {
        performanceMessage = "Keep studying! Web development takes time to master.";
    }
    
    feedbackElement.innerHTML = `<p class="result-title">${performanceMessage}</p>` + feedbackElement.innerHTML;
    
    // Hide quiz, show results
    quizElement.style.display = "none";
    resultsElement.style.display = "block";
}

// Reset the quiz
function resetQuiz() {
    // Clear all selected options
    hintShown = {};
    
    // Stop any existing timer
    clearInterval(timer);
    
    // Reinitialize the quiz with new questions
    initializeQuiz();
    
    // Hide results, show quiz
    resultsElement.style.display = "none";
    quizElement.style.display = "block";
}