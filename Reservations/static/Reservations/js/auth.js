 document.addEventListener('DOMContentLoaded', () => {
            const formSlider = document.getElementById('formSlider');
            const loginForm = document.getElementById('login-form');
            const signupForm = document.getElementById('signup-form');
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            // const ownerCheckbox = document.getElementById('owner-checkbox');
            // const ownerCodeField = document.getElementById('owner-code-field');
            const formViewport = document.querySelector('.form-slider-viewport');


            // ownerCheckbox.checked = false;
            // ownerCodeField.classList.remove('visible');
            
            let currentMode = 'login'; // Track current state
            let loginHeight = 0; // Height of Login form content
            let signupHeight = 0; // Max Height of Signup form content (owner code visible)

            // Function to calculate the required heights
            function calculateFormHeights() {
                // 1. Temporarily ensure the owner code field is visible to measure the MAX height of the signup form
                // const wasOwnerCodeVisible = ownerCodeField.classList.contains('visible');
                // ownerCodeField.classList.add('visible');
                
                // 2. Measure the actual heights (including the form's internal padding)
                loginHeight = loginForm.offsetHeight; 
                signupHeight = signupForm.offsetHeight; // This is the MAX height.
                
                // 3. Restore the original visibility state of the owner code field
                // This ensures that the state on the screen matches the state in the checkbox.
                // if (!wasOwnerCodeVisible && !ownerCheckbox.checked) {
                //      ownerCodeField.classList.remove('visible');
                // }
                
                // 4. Set the initial viewport height to the current mode's height
                // This ensures the page loads with the correct, shorter Login height.
                formViewport.style.height = (currentMode === 'login' ? loginHeight : signupHeight) + 'px';
            }
            
            // Initial setup: Calculate heights and set viewport
            calculateFormHeights();

            // Function to handle the form transition (vertical scroll and height change)
            function switchMode(newMode) {
                if (newMode === currentMode) return;
                
                let transformValue;
                let targetHeight;

                if (newMode === 'signup') {
                    // Slide up by the exact height of the Login form
                    transformValue = `-${loginHeight}px`; 
                    // Smoothly EXPAND the viewport to the max signup height
                    targetHeight = signupHeight; 
                } else {
                    // Slide down to 0
                    transformValue = '0';
                    // Smoothly SHRINK the viewport to the Login height
                    targetHeight = loginHeight;

                    // Reset conditional field when switching back to Login
                    // ownerCheckbox.checked = false;
                    // ownerCodeField.classList.remove('visible');
                }
                
                // Apply the height and transform simultaneously for smooth transition
                formViewport.style.height = `${targetHeight}px`;
                formSlider.style.transform = `translateY(${transformValue})`;

                // FIX: Blur any active element (like a button) to remove potential lingering focus/glow/shadow after click
                if (document.activeElement) {
                    document.activeElement.blur();
                }

                // Update button active states
                loginBtn.classList.toggle('active', newMode === 'login');
                signupBtn.classList.toggle('active', newMode === 'signup');
                
                currentMode = newMode;
            }
            
            // Event listeners for mode switching
            loginBtn.addEventListener('click', () => switchMode('login'));
            signupBtn.addEventListener('click', () => switchMode('signup'));

            // Event listener for the conditional field logic (Owner Code)
            
            
            // Recalculate the heights on window resize to maintain responsiveness
            window.addEventListener('resize', calculateFormHeights);
        });