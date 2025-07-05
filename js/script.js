// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;
let memory = 0;
let currentMode = 'standard';
let calculationHistory = [];

// DOM Elements
const currentOperandElement = document.getElementById('current-operand');
const previousOperandElement = document.getElementById('previous-operand');
const standardButtons = document.getElementById('standard-buttons');
const scientificButtons = document.getElementById('scientific-buttons');
const financialButtons = document.getElementById('financial-buttons');
const conversionType = document.getElementById('conversion-type');
const conversionInputs = document.getElementById('converter-inputs');
const conversionResult = document.getElementById('converter-result');
const calculatorDisplay = document.querySelector('.display');


document.getElementById('standard-mode').addEventListener('click', () => setMode('standard'));
document.getElementById('scientific-mode').addEventListener('click', () => setMode('scientific'));
document.getElementById('financial-mode').addEventListener('click', () => setMode('financial'));
document.getElementById('converter-mode').addEventListener('click', () => setMode('converter'));

function setMode(mode) {
    currentMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');

    standardButtons.style.display = 'none';
    scientificButtons.style.display = 'none';
    financialButtons.style.display = 'none';
    document.getElementById('converter-container').style.display = 'none';

    if (mode === 'financial' || mode === 'converter') {
        calculatorDisplay.style.display = 'none';
    }
    else {
        calculatorDisplay.style.display = 'block';
    }

    if (mode === 'standard') {
        standardButtons.style.display = 'grid';
    } 
    else if (mode === 'scientific') {
        scientificButtons.style.display = 'grid';
    } 
    else if (mode === 'financial') {
        financialButtons.style.display = 'block';
        document.querySelectorAll('.financial-form').forEach(f => f.classList.remove('active'));
        document.getElementById('simple-interest-form').classList.add('active');
    } 
    else if (mode === 'converter') {
        document.getElementById('converter-container').style.display = 'block';
        conversionType.value = '';
        conversionInputs.innerHTML = '';
        conversionResult.innerText = '';
    }
}

// Display Updates
function updateDisplay() {
    currentOperandElement.innerText = currentOperand;
    
    if (calculationHistory.length > 0) {
        previousOperandElement.innerText = calculationHistory.join('\n') + (previousOperand ? '\n' + previousOperand : '');
    } 
    else {
        previousOperandElement.innerText = previousOperand;
    }
}

// Input Handlers
function appendNumber(number) {
    if (currentOperand === '0' || resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }

    if (number === '.' && currentOperand.includes('.')){
        return;
    }
         
    currentOperand += number;
    updateDisplay();
}

function appendOperator(op) {
    if (currentOperand === '') {
        return;
    }
    if (previousOperand !== '') {
        calculate();
    }

    operation = op;
    previousOperand = `${currentOperand} ${operation}`;
    currentOperand = '';
    updateDisplay();
}

function calculate() {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    let result;
    let operationSymbol = '';
    
    switch (operation) {
        case '+': 
            result = prev + current; operationSymbol = '+'; 
            break;
        case '-': 
            result = prev - current; operationSymbol = '-';
            break;
        case '*': 
            result = prev * current; operationSymbol = '×'; 
            break;
        case '/': 
            result = prev / current; operationSymbol = '÷'; 
            break;
        case '^': 
            result = Math.pow(prev, current); operationSymbol = '^'; 
            break;
        case 'mod': 
            result = prev % current; operationSymbol = 'mod'; 
            break;
        case 'P': 
            result = factorial(prev) / factorial(prev - current); operationSymbol = 'P'; 
            break;
        case 'C': 
            result = factorial(prev) / (factorial(current) * factorial(prev - current)); operationSymbol = 'C'; 
            break;
        default:   
            return;
    }

    calculationHistory.push(`${prev} ${operationSymbol} ${current} = ${result}`);
    
    currentOperand = result.toString();
    previousOperand = '';
    operation = undefined;
    resetScreen = true;
    updateDisplay();
}

// Clear and Delete
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    calculationHistory = [];
    updateDisplay();
}

function deleteLastChar() {
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } 
    else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Scientific Functions
function updateScientificFunction(name, result) {
    calculationHistory.push(`${name}(${currentOperand}) = ${result}`);
    currentOperand = result.toString();
    updateDisplay();
}

function calculateLog() {
    const num = parseFloat(currentOperand);
    const result = num <= 0 ? 'Error' : Math.log10(num).toString();
    updateScientificFunction('log', result);
}

function calculateLn() {
    const num = parseFloat(currentOperand);
    const result = num <= 0 ? 'Error' : Math.log(num).toString();
    updateScientificFunction('ln', result);
}

function calculatePower() {
    previousOperand = `${currentOperand}^`;
    operation = '^';
    currentOperand = '';
    updateDisplay();
}

function calculateSquareRoot() {
    const num = parseFloat(currentOperand);
    const result = num < 0 ? 'Error' : Math.sqrt(num).toString();
    updateScientificFunction('√', result);
}

function calculateCubeRoot() {
    const num = parseFloat(currentOperand);
    const result = Math.cbrt(num).toString();
    updateScientificFunction('∛', result);
}

function calculateSin() {
    const num = parseFloat(currentOperand);
    const result = Math.sin(num * Math.PI / 180).toString();
    updateScientificFunction('sin', result);
}

function calculateCos() {
    const num = parseFloat(currentOperand);
    const result = Math.cos(num * Math.PI / 180).toString();
    updateScientificFunction('cos', result);
}

function calculateTan() {
    const num = parseFloat(currentOperand);
    const result = Math.abs(num % 180) === 90 ? 'Error' : Math.tan(num * Math.PI / 180).toString();
    updateScientificFunction('tan', result);
}

function calculateFactorial() {
    let num = parseInt(currentOperand);
    const result = num < 0 ? 'Error' : factorial(num).toString();
    updateScientificFunction('factorial', result);
}

function factorial(n) {
    if (n < 0) return NaN;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

function calculatePermutation() {
    previousOperand = `${currentOperand}P`;
    operation = 'P';
    currentOperand = '';
    updateDisplay();
}

function calculateCombination() {
    previousOperand = `${currentOperand}C`;
    operation = 'C';
    currentOperand = '';
    updateDisplay();
}

function insertPi() {
    currentOperand = Math.PI.toString();
    updateDisplay();
}

function insertE() {
    currentOperand = Math.E.toString();
    updateDisplay();
}

function calculateModulus() {
    previousOperand = `${currentOperand} mod`;
    operation = 'mod';
    currentOperand = '';
    updateDisplay();
}

function calculatePercentage() {
    const num = parseFloat(currentOperand);
    const result = (num / 100).toString();
    updateScientificFunction('%', result);
}

// Memory Functions
function clearMemory() {
    memory = 0;
}

function memoryRecall() {
    currentOperand = memory.toString();
    updateDisplay();
}

function memoryAdd() {
    memory += parseFloat(currentOperand) || 0;
}

function memorySubtract() {
    memory -= parseFloat(currentOperand) || 0;
}

// Financial Calculators
function calculateSimpleInterest() {
    const p = parseFloat(document.getElementById('principal').value);
    const r = parseFloat(document.getElementById('rate').value);
    const t = parseFloat(document.getElementById('time').value);
    if (isNaN(p) || isNaN(r) || isNaN(t)) {
        document.getElementById('si-result').innerText = 'Please enter valid numbers';
        return;
    }
    const interest = (p * r * t) / 100;
    const total = p + interest;
    document.getElementById('si-result').innerHTML = `
        <p>Simple Interest: ${interest.toFixed(2)}</p>
        <p>Total Amount: ${total.toFixed(2)}</p> `;
}

function calculateCompoundInterest() {
    const p = parseFloat(document.getElementById('ci-principal').value);
    const r = parseFloat(document.getElementById('ci-rate').value);
    const t = parseFloat(document.getElementById('ci-time').value);
    const n = parseFloat(document.getElementById('ci-compounds').value);
    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
        document.getElementById('ci-result').innerText = 'Please enter valid numbers';
        return;
    }
    const amount = p * Math.pow(1 + (r / 100) / n, n * t);
    const interest = amount - p;
    document.getElementById('ci-result').innerHTML = `
        <p>Compound Interest: ${interest.toFixed(2)}</p>
        <p>Total Amount: ${amount.toFixed(2)}</p> `;
}

function calculateEMI() {
    const loan = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const tenure = parseFloat(document.getElementById('loan-tenure').value);
    if (isNaN(loan) || isNaN(rate) || isNaN(tenure)) {
        document.getElementById('emi-result').innerText = 'Please enter valid numbers';
        return;
    }
    const monthlyRate = rate / 1200;
    const emi = loan * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - loan;
    document.getElementById('emi-result').innerHTML = `
        <p>EMI: ${emi.toFixed(2)}</p>
        <p>Total Interest: ${totalInterest.toFixed(2)}</p>
        <p>Total Payment: ${totalPayment.toFixed(2)}</p> `;
}

function showSimpleInterestForm() {
    document.querySelectorAll('.financial-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.financial-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('simple-interest-form').classList.add('active');
    document.querySelector('.financial-tabs button:nth-child(1)').classList.add('active');
}

function showCompoundInterestForm() {
    document.querySelectorAll('.financial-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.financial-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('compound-interest-form').classList.add('active');
    document.querySelector('.financial-tabs button:nth-child(2)').classList.add('active');
}

function showEMIForm() {
    document.querySelectorAll('.financial-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.financial-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById('emi-form').classList.add('active');
    document.querySelector('.financial-tabs button:nth-child(3)').classList.add('active');
}

function clearFinancialForm(formId) {
    const form = document.getElementById(formId);
    form.querySelectorAll('input').forEach(input => input.value = '');
    form.querySelector('div[id$="-result"]').innerHTML = '';
}

// Unit Converter
conversionType.addEventListener('change', (e) => {
    const type = e.target.value;
    let html = '';
    if (type === 'length') {
        html = `
            <input type="number" id="length-value" placeholder="Value" autofocus>
            <select id="length-from">
                <option value="mm">Millimeters</option>
                <option value="cm">Centimeters</option>
                <option value="m">Meters</option>
                <option value="km">Kilometers</option>
                <option value="in">Inches</option>
                <option value="ft">Feet</option>
                <option value="yd">Yards</option>
                <option value="mi">Miles</option>
            </select>
            <span>To</span>
            <select id="length-to">
                <option value="mm">Millimeters</option>
                <option value="cm">Centimeters</option>
                <option value="m">Meters</option>
                <option value="km">Kilometers</option>
                <option value="in">Inches</option>
                <option value="ft">Feet</option>
                <option value="yd">Yards</option>
                <option value="mi">Miles</option>
            </select>
            <button onclick="convertLength()">Convert</button>
        `;
    } else if (type === 'weight') {
        html = `
            <input type="number" id="weight-value" placeholder="Value" autofocus>
            <select id="weight-from">
                <option value="mg">Milligrams</option>
                <option value="g">Grams</option>
                <option value="kg">Kilograms</option>
                <option value="oz">Ounces</option>
                <option value="lb">Pounds</option>
                <option value="ton">Tons</option>
            </select>
            <span>To</span>
            <select id="weight-to">
                <option value="mg">Milligrams</option>
                <option value="g">Grams</option>
                <option value="kg">Kilograms</option>
                <option value="oz">Ounces</option>
                <option value="lb">Pounds</option>
                <option value="ton">Tons</option>
            </select>
            <button onclick="convertWeight()">Convert</button>
        `;
    } else if (type === 'temperature') {
        html = `
            <input type="number" id="temp-value" placeholder="Value" autofocus>
            <select id="temp-from">
                <option value="c">Celsius</option>
                <option value="f">Fahrenheit</option>
                <option value="k">Kelvin</option>
            </select>
            <span>To</span>
            <select id="temp-to">
                <option value="c">Celsius</option>
                <option value="f">Fahrenheit</option>
                <option value="k">Kelvin</option>
            </select>
            <button onclick="convertTemperature()">Convert</button>
        `;
    }
    conversionInputs.innerHTML = html;
    
    // Focus the input field after it's created
    setTimeout(() => {
        const inputField = conversionInputs.querySelector('input[type="number"]');
        if (inputField) {
            inputField.focus();
        }
    }, 10);
});

function convertLength() {
    const inputField = document.getElementById('length-value');
    const value = parseFloat(inputField.value);
    const from = document.getElementById('length-from').value;
    const to = document.getElementById('length-to').value;
    
    if (isNaN(value)) {
        conversionResult.innerText = 'Please enter a valid number';
        inputField.focus();
        return;
    }

    let meters;
    switch (from) {
        case 'mm': meters = value / 1000; break;
        case 'cm': meters = value / 100; break;
        case 'm': meters = value; break;
        case 'km': meters = value * 1000; break;
        case 'in': meters = value * 0.0254; break;
        case 'ft': meters = value * 0.3048; break;
        case 'yd': meters = value * 0.9144; break;
        case 'mi': meters = value * 1609.34; break;
    }

    let result;
    switch (to) {
        case 'mm': result = meters * 1000; break;
        case 'cm': result = meters * 100; break;
        case 'm': result = meters; break;
        case 'km': result = meters / 1000; break;
        case 'in': result = meters / 0.0254; break;
        case 'ft': result = meters / 0.3048; break;
        case 'yd': result = meters / 0.9144; break;
        case 'mi': result = meters / 1609.34; break;
    }

    conversionResult.innerText = `${value} ${from} = ${result.toFixed(4)} ${to}`;
    inputField.focus(); // Return focus to input field after conversion
}

function convertWeight() {
    const value = parseFloat(document.getElementById('weight-value').value);
    const from = document.getElementById('weight-from').value;
    const to = document.getElementById('weight-to').value;
    if (isNaN(value)) return conversionResult.innerText = 'Please enter a valid number';

    let grams;
    switch (from) {
        case 'mg': grams = value / 1000; break;
        case 'g': grams = value; break;
        case 'kg': grams = value * 1000; break;
        case 'oz': grams = value * 28.3495; break;
        case 'lb': grams = value * 453.592; break;
        case 'ton': grams = value * 907185; break;
    }

    let result;
    switch (to) {
        case 'mg': result = grams * 1000; break;
        case 'g': result = grams; break;
        case 'kg': result = grams / 1000; break;
        case 'oz': result = grams / 28.3495; break;
        case 'lb': result = grams / 453.592; break;
        case 'ton': result = grams / 907185; break;
    }

    conversionResult.innerText = `${value} ${from} = ${result.toFixed(4)} ${to}`;
}

function convertTemperature() {
    const value = parseFloat(document.getElementById('temp-value').value);
    const from = document.getElementById('temp-from').value;
    const to = document.getElementById('temp-to').value;
    if (isNaN(value)) return conversionResult.innerText = 'Please enter a valid number';

    let celsius;
    switch (from) {
        case 'c': celsius = value; break;
        case 'f': celsius = (value - 32) * 5 / 9; break;
        case 'k': celsius = value - 273.15; break;
    }

    let result;
    switch (to) {
        case 'c': result = celsius; break;
        case 'f': result = (celsius * 9 / 5) + 32; break;
        case 'k': result = celsius + 273.15; break;
    }

    conversionResult.innerText = `${value}°${from.toUpperCase()} = ${result.toFixed(2)}°${to.toUpperCase()}`;
}

// Enhanced Keyboard Support
document.addEventListener("keydown", (e) => {
    // Prevent default for keys we handle
    if ((e.key >= "0" && e.key <= "9") || 
        e.key === "." || 
        e.key === "+" || 
        e.key === "-" || 
        e.key === "*" || 
        e.key === "/" || 
        e.key === "Enter" || 
        e.key === "=" || 
        e.key === "Escape" || 
        e.key === "Backspace" ||
        e.key === "%" ||
        e.key === "^" ||
        e.key === "!") {
        e.preventDefault();
    }

    if (e.key >= "0" && e.key <= "9") appendNumber(e.key);
    else if (e.key === ".") appendNumber(".");
    else if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
        appendOperator(e.key);
    }
    else if (e.key === "%") calculatePercentage();
    else if (e.key === "^") calculatePower();
    else if (e.key === "!") calculateFactorial();
    else if (e.key === "Enter" || e.key === "=") calculate();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "Backspace") deleteLastChar();
    else if (e.key === "m" && e.altKey) memoryAdd();
    else if (e.key === "s" && e.altKey) memorySubtract();
    else if (e.key === "r" && e.altKey) memoryRecall();
    else if (e.key === "c" && e.altKey) clearMemory();
    else if (e.key === "p" && e.altKey) insertPi();
    else if (e.key === "e" && e.altKey) insertE();
});

document.addEventListener('keydown', function(e) {
    // Only handle if we're in converter mode
    if (currentMode !== 'converter') return;
    
    const activeElement = document.activeElement;
    const isConverterInput = activeElement && activeElement.id && 
                           (activeElement.id.includes('value') || 
                            activeElement.id.includes('from') || 
                            activeElement.id.includes('to'));
    
    if (isConverterInput) {
        // Allow navigation with arrow keys in selects
        if (activeElement.tagName === 'SELECT' && 
            (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
            return; // Let the select handle these keys
        }
        
        // Handle Enter key to trigger conversion
        if (e.key === 'Enter') {
            e.preventDefault();
            const type = conversionType.value;
            if (type === 'length') convertLength();
            else if (type === 'weight') convertWeight();
            else if (type === 'temperature') convertTemperature();
        }
    }
});
// Initialize
updateDisplay();
setMode('standard');