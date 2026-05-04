
function showGame(gameId) {
    document.querySelectorAll('.game-section').forEach(section => section.style.display = 'none');
    document.getElementById(gameId).style.display = 'block';
}



  
const words = ["JAVASCRIPT","PYTHON","HTML","CSS","CODING","JAVA","APPLE","BANANA","BOOK","HOUSE","FRIEND","TREE","JAVASCRIPT", "PYTHON", "HTML", "CSS", "CODING", "JAVA", "CPLUSPLUS", "C", "RUBY", "PHP", "SQL", "NODEJS", "REACT", "ANGULAR", 
  "VUE", "TYPESCRIPT", "BOOTSTRAP", "MONGODB", "FIREBASE", "GIT", "GITHUB", "DOCKER", "KUBERNETES", "LINUX", "WINDOWS", "MACOS", 
  "ANDROID", "IOS", "FLUTTER", "DART", "SWIFT", "KOTLIN", "ALGORITHM", "DATASTRUCTURE", "FUNCTION", "VARIABLE", "CONSTANT", "ARRAY",
   "OBJECT", "CLASS", "METHOD", "CONSTRUCTOR", "INHERITANCE", "POLYMORPHISM", "ENCAPSULATION", "ABSTRACTION", "INTERFACE", "PACKAGE", 
   "IMPORT", "EXPORT", "ASYNC", "AWAIT", "PROMISE", "CALLBACK", "EVENTLOOP", "DOM", "BROWSER", "SERVER", "CLIENT", "API", "REST", "GRAPHQL",
    "JSON", "AJAX", "WEBHOOK", "SECURITY", "ENCRYPTION", "DECRYPTION", "TOKEN", "SESSION", "COOKIE", "LOCALSTORAGE", "REDIS", "CACHE",
   "STATE", "PROPS", "HOOKS", "CONTEXT", "REDUX","MIDDLEWARE", "TESTING", "JEST", "MOCHA", "CHAI", "SELENIUM", "CYPRESS", "UNITTEST", 
   "INTEGRATION", "DEPLOYMENT", "CI/CD", "DOCKERFILE", "VIRTUALIZATION", "CLOUD", "AWS", "AZURE", "GCP", "HEROKU", "NETLIFY", "VERCEL", 
   "DOMAIN", "HOSTING", "RESPONSIVE", "ANIMATION", "SVG", "CANVAS", "ALGORITHMIC", "RECURSION", "ITERATION", "BINARY", "HEX", "OCTAL", 
   "DEBUGGING", "LOGGING", "ERRORHANDLING", "EXCEPTION","APPLE", "BANANA", "ORANGE", "MANGO", "GRAPE", "PEACH", "CHERRY", "STRAWBERRY", 
   "WATERMELON", "PINEAPPLE", "TABLE", "CHAIR", "SOFA", "BED", "LAMP", "BOOK", "PEN", "NOTEBOOK", "DIARY", "PENCIL", "SUN", "MOON", "STAR", 
   "CLOUD", "RAIN", "RIVER", "LAKE", "OCEAN", "MOUNTAIN", "FOREST", "DOG", "CAT", "ELEPHANT", "TIGER", "LION", "BIRD", "FISH", "SNAKE", "HORSE",
    "COW", "CAR", "BIKE", "BUS", "TRAIN", "PLANE", "HOUSE", "APARTMENT", "VILLA", "COTTAGE", "CASTLE", "RED", "BLUE", "GREEN", "YELLOW", 
    "PURPLE", "HAPPY", "SAD", "ANGRY", "EXCITED", "NERVOUS", "RUN", "JUMP", "SWIM", "FLY", "DANCE", "SING", "WRITE", "READ", "DRAW", 
    "PAINT", "FOOD", "DRINK", "SNACK", "MEAL", "DESSERT", "MUSIC", "MOVIE", "GAME", "SHOW", "BOOK", "FRIEND", "FAMILY", "PARENT", "CHILD", 
    "SIBLING", "CITY", "TOWN", "VILLAGE", "COUNTRY", "STATE", "SUNRISE", "SUNSET", "NIGHT", "DAY", "WEEK", "MONTH", "YEAR", "DECADE",
     "CENTURY", "MILLENNIUM", "SMILE", "LAUGH", "TEAR", "LOVE", "HATE", "FLOWER", "TREE", "LEAF", "GRASS", "BUSH"];

let currentWord = "";
let score = 0;

function shuffleWord(word) {
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function newWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById("shuffledWord").textContent = shuffleWord(currentWord);
    document.getElementById("wordInput").value = "";
    document.getElementById("wordResult").textContent = "";
}

function checkWord() {
    const userInput = document.getElementById("wordInput").value.toUpperCase();
    if (userInput === currentWord) {
        document.getElementById("wordResult").textContent = "✅ Correct!";
        score++;
        document.getElementById("score").textContent = score;
        setTimeout(newWord, 1000);
    } else {
        document.getElementById("wordResult").textContent = "❌ Try Again!";
    }
}


newWord();