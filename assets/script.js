// script.js
const display = document.getElementById("display");

let isInverse = false;
function appendFunction(value) {
  if (value === '^') {
    display.value += '**';
  
  } else {
    display.value += value;
  }
  display.scrollTop = display.scrollHeight;
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
    

    try {
      let expression = display.value;
  
      // Replace factorials like 5! or (3+2)!
      expression = expression.replace(/(\d+|\([^()]+\))!/g, match => {
        const inner = match.slice(0, -1);
        return `factorial(${inner})`;
      });

      
  
      
       // Handle INV mode (inverse trigonometric functions) and degree to radian conversion for sin cos tan
    if (isInverse) {
        expression = expression
          .replace(/sin\(([^)]+)\)/g, (_, angle) => isDegree ? `toDegrees(Math.asin(${angle}))` : `Math.asin(${angle})`)
          .replace(/cos\(([^)]+)\)/g, (_, angle) => isDegree ? `toDegrees(Math.acos(${angle}))` : `Math.acos(${angle})`)
          .replace(/tan\(([^)]+)\)/g, (_, angle) => isDegree ? `toDegrees(Math.atan(${angle}))` : `Math.atan(${angle})`)
          .replace(/log10\(([^)]+)\)/g, (_, val) => `Math.pow(10, ${val})`)
          .replace(/ln\(([^)]+)\)/g, (_, val) => `Math.exp(${val})`)
          .replace(/sqrt\(([^)]+)\)/g, (_, val) => `Math.pow(${val}, 2)`);
      } else {
        // Normal trigonometric functions
        expression = expression
          .replace(/sin\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.sin(toRadians(${angle}))` : `Math.sin(${angle})`)
          .replace(/cos\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.cos(toRadians(${angle}))` : `Math.cos(${angle})`)
          .replace(/tan\(([^)]+)\)/g, (_, angle) => isDegree ? `Math.tan(toRadians(${angle}))` : `Math.tan(${angle})`)
          .replace(/log10\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(');
      }
  
      // Common replacements
      expression = expression
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/\be\b/g, 'Math.E');

      // Evaluate safely
      display.value = Function('return ' + expression)();
     let result = eval(expression);
addToHistory(`${expression} = ${result}`);
display.value = result;

// const result = Function("return " + expression)();
// display.value = result;
// addToHistory(`${expression} = ${result}`);
      
    } catch (error) {
      display.value = "Error";
    }
    
  }
  


function toggleTheme(){
    document.body.classList.toggle("dark-mode");
}

function factorial(n){
    if(n<0) return NaN;
    if(n === 0 || n===1) return 1;
    let result=1;
    for(let i=2;i<=n;i++){
        result*=i;
    }
    return result;
}

function appendFunction(value) {
    try {
      // If value is "!", check if we can safely add it
      if (value === "!") {
        const lastChar = display.value.slice(-1);
        // Add "!" only if last char is a digit or a closing parenthesis
        if (/\d|\)/.test(lastChar)) {
          display.value += "!";
        }
      } else {
        display.value += value;
      }
    } catch {
      display.value = "Error";
    }
  }
  

  let isDegree = true;

  function setDegreeMode() {
      isDegree = true;
      document.getElementById("degBtn").classList.add("active");
      document.getElementById("radBtn").classList.remove("active");
  }
  
  function setRadianMode() {
      isDegree = false;
      document.getElementById("radBtn").classList.add("active");
      document.getElementById("degBtn").classList.remove("active");
  }
  
  function toRadians(angle) {
      return angle * (Math.PI / 180);
  }
  
  function toDegrees(radian) {
    return radian * (180 / Math.PI);
  }

  function calculateTrig(func, value) {
      let angle = isDegree ? toRadians(value) : value;
      switch (func) {
          case "sin": return Math.sin(angle);
          case "cos": return Math.cos(angle);
          case "tan": return Math.tan(angle);
      }
  }

  
  function toggleSettingsMenu() {
    const menu = document.getElementById("settingsMenu");
    menu.classList.toggle("hidden");
  }

  
  let history = [];

function addToHistory(entry) {
    
        const historyList = document.getElementById("historyList");
        const item = document.createElement("div");
        item.className = "history-item";  // Add class
        item.textContent = entry;
        historyList.appendChild(item);
      
      
}

function showHistory() {
    document.getElementById("historyScreen").style.display = "block";
}

function closeHistory() {
  document.getElementById("historyScreen").style.display="none";
}


//INV button
// function toggleInv() {
//     isInverse = !isInverse;
//     const invBtn = document.getElementById("invBtn");
//     invBtn.classList.toggle("active");
//     invBtn.textContent = isInverse ? "INV " : "INV";

//     document.getElementById("sinBtn").textContent = isInverse ? "asin" : "sin";
//     document.getElementById("cosBtn").textContent = isInverse ? "acos" : "cos";
//     document.getElementById("tanBtn").textContent = isInverse ? "atan" : "tan";
//   }
  
 function toggleInv() {
    isInverse = !isInverse;
    const invBtn = document.getElementById("invBtn");
    invBtn.classList.toggle("active");
    invBtn.textContent = isInverse ? "INV " : "INV";

    const sinBtn = document.getElementById("sinBtn");
    const cosBtn = document.getElementById("cosBtn");
    const tanBtn = document.getElementById("tanBtn");

    if (isInverse) {
      sinBtn.textContent = "asin";
      cosBtn.textContent = "acos";
      tanBtn.textContent = "atan";

     
    } else {
      sinBtn.textContent = "sin";
      cosBtn.textContent = "cos";
      tanBtn.textContent = "tan";

      
    }
}

document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (!isNaN(key)) {
    appendFunction(key); // Numbers 0–9
  }

  const allowedKeys = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/',
    '%': '%',
    '.': '.',
    '(': '(',
    ')': ')',
    '^': '^',
    '!': '!',
  };

  if (allowedKeys[key]) {
    appendFunction(allowedKeys[key]);
  }

  if (key === 'Enter') {
    event.preventDefault(); // Prevent form submission if any
    calculate(); // Calculate on Enter key
  }

  if (key === 'Backspace') {
    deleteLast(); // Delete last character
  }

  if (key === 'Escape') {
    clearDisplay(); // Clear display on Escape
  }
});

