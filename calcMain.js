// Caches the display element once for better performance
const display = document.getElementById('display');

// --- Core Functionality ---

function appendToDisplay(value) {
    // Optional: Prevent the cursor from staying on the button after click
    if (document.activeElement) {
        document.activeElement.blur();
    }
    
    // Simple check to prevent double operators (like "5++")
    const lastChar = display.value.slice(-1);
    const operators = ['+', '-', '*', '/', '%', '.'];
    
    if (operators.includes(value) && operators.includes(lastChar)) {
        // If the user presses another operator, replace the old one
        display.value = display.value.slice(0, -1) + value; 
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.toString().slice(0, -1);
}

function calculateResult() {
    try {
        // Simple Input Validation (optional but recommended for security)
        if (/[^0-9+\-*/().%]/.test(display.value)) {
            display.value = "Error";
            return;
        }

        // CRITICAL FIX: Replace ALL "%" with "/100" to prevent the trailing '*' error.
        // The /g flag means "global" replacement (replace all occurrences).
        let expression = display.value.replace(/%/g, '/100');
        
        // Use eval() for calculation
        let result = eval(expression);

        // Optional: Handle common JavaScript floating point inaccuracies (e.g., 0.1 + 0.2)
        if (!Number.isInteger(result)) {
            // Limits result to 8 decimal places and removes trailing zeros
            result = parseFloat(result.toFixed(8)); 
        }

        display.value = result;

    } catch (error) {
        display.value = 'Error';
        // Auto-clear the error message after a short delay for better user experience
        setTimeout(() => display.value = '', 1500); 
    }
}

// --- Keyboard Input Support ---

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Allowed keys for input (numbers, decimals, and operators)
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '%'];
    
    if (allowedKeys.includes(key)) {
        appendToDisplay(key);
    } 
    
    // Handle Enter (Calculate) and prevent the browser's default behavior
    else if (key === 'Enter') {
        event.preventDefault(); 
        calculateResult();
    } 
    
    // Handle Backspace (Delete Last)
    else if (key === 'Backspace') {
        deleteLast();
    } 
    
    // Handle Escape (Clear All)
    else if (key === 'Escape') {
        clearDisplay();
    }
});
