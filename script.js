document.addEventListener('DOMContentLoaded', () => {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const copyButton = document.getElementById('copyButton');
    const lengthSlider = document.getElementById('length');
    const lengthValueSpan = document.getElementById('lengthValue');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateButton = document.getElementById('generateButton');

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    // Update length display on slider change
    lengthSlider.addEventListener('input', () => {
        lengthValueSpan.textContent = lengthSlider.value;
    });

    // Generate password function
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        let characterPool = '';
        let generatedPassword = '';

        if (uppercaseCheckbox.checked) characterPool += charSets.uppercase;
        if (lowercaseCheckbox.checked) characterPool += charSets.lowercase;
        if (numbersCheckbox.checked) characterPool += charSets.numbers;
        if (symbolsCheckbox.checked) characterPool += charSets.symbols;

        if (characterPool === '') {
            passwordDisplay.value = 'Select at least one character set!';
            return;
        }

        // Ensure at least one character from each selected set (if possible and length allows)
        let guaranteedChars = '';
        if (uppercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.uppercase);
        if (lowercaseCheckbox.checked) guaranteedChars += getRandomChar(charSets.lowercase);
        if (numbersCheckbox.checked) guaranteedChars += getRandomChar(charSets.numbers);
        if (symbolsCheckbox.checked) guaranteedChars += getRandomChar(charSets.symbols);

        // Fill the rest of the password length
        const remainingLength = length - guaranteedChars.length;
        for (let i = 0; i < remainingLength; i++) {
            generatedPassword += getRandomChar(characterPool);
        }

        // Add guaranteed characters and shuffle
        generatedPassword += guaranteedChars;
        generatedPassword = shuffleString(generatedPassword);

        // Ensure the final password is exactly the desired length (in case guaranteed chars exceeded length)
        passwordDisplay.value = generatedPassword.slice(0, length);
    }

    function getRandomChar(str) {
        const randomIndex = Math.floor(Math.random() * str.length);
        return str[randomIndex];
    }

    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return arr.join('');
    }

    // Copy to clipboard function
    copyButton.addEventListener('click', () => {
        if (!passwordDisplay.value || passwordDisplay.value === 'Select at least one character set!') return;

        passwordDisplay.select(); // Select the text field content
        passwordDisplay.setSelectionRange(0, 99999); // For mobile devices

        try {
            navigator.clipboard.writeText(passwordDisplay.value)
                .then(() => {
                    // Optional: Provide feedback to the user
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers or if permissions fail
                    try {
                        document.execCommand('copy');
                        copyButton.textContent = 'Copied!';
                         setTimeout(() => {
                            copyButton.textContent = 'Copy';
                        }, 1500);
                    } catch (execErr) {
                         console.error('Fallback copy failed: ', execErr);
                         alert('Failed to copy password.');
                    }
                });
        } catch (err) {
            console.error('Clipboard API not available: ', err);
             alert('Failed to copy password.');
        }
    });

    // Generate password on button click
    generateButton.addEventListener('click', generatePassword);

    // Generate an initial password on load
    generatePassword();
});
