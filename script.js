// -------------------------------
// Question Bank
// -------------------------------
const questionBank = {
  pillars: [
    { question: "How many pillars are there in Islam?", options: ["4", "5", "6", "7"], correct: 1, explanation: "There are five pillars of Islam." },
    { question: "Which is NOT a Pillar of Islam?", options: ["Salah", "Zakat", "Hajj", "Reading Quran"], correct: 3, explanation: "Reading Quran is very important but not a pillar." },
    { question: "Which pillar involves fasting?", options: ["Salah", "Zakat", "Sawm", "Hajj"], correct: 2, explanation: "Sawm refers to fasting during Ramadan." },
    { question: "Which pillar is performed once in a lifetime?", options: ["Salah", "Zakat", "Hajj", "Sawm"], correct: 2, explanation: "Hajj is performed once if able." },
    { question: "Which pillar is about declaring faith?", options: ["Zakat", "Shahadah", "Salah", "Sawm"], correct: 1, explanation: "Shahadah is the declaration of faith." }
  ],

  prophets: [
    { question: "Who was the last prophet?", options: ["Isa", "Musa", "Muhammad", "Nuh"], correct: 2, explanation: "Muhammad (PBUH) is the last prophet." },
    { question: "Who built the Kaaba with Prophet Ismail?", options: ["Ibrahim", "Nuh", "Yusuf", "Musa"], correct: 0, explanation: "Prophet Ibrahim built Kaaba with Ismail." },
    { question: "Which prophet could speak in infancy?", options: ["Musa", "Isa", "Yusuf", "Adam"], correct: 1, explanation: "Isa (AS) spoke as an infant." },
    { question: "Who was swallowed by a whale?", options: ["Yunus", "Nuh", "Hud", "Saleh"], correct: 0, explanation: "Yunus (AS) was swallowed by a whale." },
    { question: "Which prophet received the Torah?", options: ["Isa", "Dawood", "Musa", "Ibrahim"], correct: 2, explanation: "Musa (AS) received the Torah." }
  ],

  quran: [
    { question: "How many Surahs are in the Quran?", options: ["100", "114", "120", "99"], correct: 1, explanation: "The Quran contains 114 Surahs." },
    { question: "Longest Surah?", options: ["Al-Fatiha", "Al-Baqarah", "Yaseen", "Al-Ikhlas"], correct: 1, explanation: "Al-Baqarah is the longest." },
    { question: "Which Surah is heart of Quran?", options: ["Al-Baqarah", "Yaseen", "Rahman", "Kahf"], correct: 1, explanation: "Yaseen is the heart." },
    { question: "First Surah?", options: ["Al-Baqarah", "Al-Fatiha", "An-Nas", "Al-Ikhlas"], correct: 1, explanation: "Al-Fatiha is first." },
    { question: "Which Surah has 3 verses?", options: ["Al-Fatiha", "Al-Ikhlas", "Al-Kawthar", "An-Nasr"], correct: 2, explanation: "Al-Kawthar has 3 verses." }
  ]
};

// -------------------------------
// State
// -------------------------------
let selectedCategory = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let timerId = null;
let timeLeft = 15;

// Elements
const welcomeEl = document.getElementById("welcome");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const qIndexEl = document.getElementById("qIndex");
const scoreDisplay = document.getElementById("scoreDisplay");
const progressBar = document.getElementById("progressBar");
const explainEl = document.getElementById("explain");
const nextBtn = document.getElementById("nextBtn");
const endBtn = document.getElementById("endBtn");
const timerEl = document.getElementById("timer");
const highScoreDisplay = document.getElementById("highScoreDisplay");

// -------------------------------
// High Scores
// -------------------------------
function loadHighScores() {
  return JSON.parse(localStorage.getItem("islamicQuizHighScores")) || {};
}

function saveHighScore() {
  const data = loadHighScores();
  if (!data[selectedCategory] || score > data[selectedCategory]) {
    data[selectedCategory] = score;
    localStorage.setItem("islamicQuizHighScores", JSON.stringify(data));
  }
}

function showHighScore() {
  const scores = loadHighScores();
  highScoreDisplay.textContent = selectedCategory ? `High (${capitalize(selectedCategory)}): ${scores[selectedCategory] ?? 0}` : "";
}

function resetScore() {
  const data = loadHighScores();
  if (selectedCategory && data[selectedCategory]) {
    delete data[selectedCategory];
    localStorage.setItem("islamicQuizHighScores", JSON.stringify(data));
  }
  score = 0;
  showHighScore();
  alert("Score for this category has been reset!");
}

// -------------------------------
// Quiz Flow
// -------------------------------
function prepareQuiz(category) {
  selectedCategory = category;
  questions = shuffleArray([...questionBank[category]]);
  currentIndex = 0;
  score = 0;
  welcomeEl.classList.add("d-none");
  resultsEl.classList.add("d-none");
  quizEl.classList.remove("d-none");
  showHighScore();
  displayQuestion();
}

function displayQuestion() {
  resetUI();
  const q = questions[currentIndex];
  qIndexEl.textContent = `Q ${currentIndex+1} / ${questions.length}`;
  scoreDisplay.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentIndex/questions.length)*100}%`;
  questionText.textContent = q.question;

  q.options.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.className="btn btn-outline-dark";
    btn.textContent=opt;
    btn.onclick = ()=>selectAnswer(i);
    optionsEl.appendChild(btn);
  });

  resetTimer();
  startTimer();
}

function resetUI() {
  optionsEl.innerHTML = "";
  explainEl.innerHTML = "";
  nextBtn.classList.add("d-none");
  endBtn.classList.add("d-none");
}

function selectAnswer(index){
  stopTimer();
  const q=questions[currentIndex];
  const buttons=[...optionsEl.children];
  buttons.forEach((btn,i)=>{
    btn.disabled=true;
    if(i===q.correct) btn.classList.add("correct");
    if(i===index && index!==q.correct) btn.classList.add("wrong");
  });
  if(index===q.correct) score++;
  explainEl.innerHTML = `<div class="alert ${index===q.correct?"alert-success":"alert-danger"}">${q.explanation}</div>`;
  scoreDisplay.textContent = `Score: ${score}`;
  if(currentIndex<questions.length-1) nextBtn.classList.remove("d-none");
  else endBtn.classList.remove("d-none");
}

function nextQuestion(){
  currentIndex++;
  displayQuestion();
}

// Timer
function startTimer(){
  timeLeft=15;
  timerEl.textContent=`Time: ${timeLeft}s`;
  timerId=setInterval(()=>{
    timeLeft--;
    timerEl.textContent=`Time: ${timeLeft}s`;
    if(timeLeft<=0){
      clearInterval(timerId);
      autoTimeUp();
    }
  },1000);
}

function resetTimer(){stopTimer(); timeLeft=15;}
function stopTimer(){if(timerId) clearInterval(timerId);}
function autoTimeUp(){
  const q=questions[currentIndex];
  [...optionsEl.children].forEach((btn,i)=>{btn.disabled=true; if(i===q.correct) btn.classList.add("correct");});
  explainEl.innerHTML=`<div class="alert alert-warning">Time's up! ${q.explanation}</div>`;
  if(currentIndex<questions.length-1) nextBtn.classList.remove("d-none");
  else endBtn.classList.remove("d-none");
}

// End Quiz
function endQuiz(){ stopTimer(); saveHighScore(); showResults(); }
function exitQuiz(){ stopTimer(); showResults(); }

function showResults(){
  quizEl.classList.add("d-none");
  resultsEl.classList.remove("d-none");
  const percent=Math.round((score/questions.length)*100);
  const highScores=loadHighScores();
  resultsEl.innerHTML=`
    <div class="text-center mb-3">
      <img src="images/result-icon.png" alt="Result Icon" class="img-fluid" style="max-width:150px;">
    </div>
    <h3>Final Score: ${score} / ${questions.length} (${percent}%)</h3>
    <p>Category: <strong>${capitalize(selectedCategory)}</strong></p>
    <p>High Score: ${highScores[selectedCategory]}</p>
    <div class="d-flex gap-2 mt-3 justify-content-center flex-wrap">
      <button class="btn btn-primary" onclick="retryQuiz()">Retry</button>
      <button class="btn btn-secondary" onclick="backToWelcome()">New Category</button>
    </div>
  `;
}

function retryQuiz(){ prepareQuiz(selectedCategory); }
function backToWelcome(){ stopTimer(); quizEl.classList.add("d-none"); resultsEl.classList.add("d-none"); welcomeEl.classList.remove("d-none"); }

// Utilities
function shuffleArray(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()* (i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function capitalize(str){return str.charAt(0).toUpperCase()+str.slice(1);}
