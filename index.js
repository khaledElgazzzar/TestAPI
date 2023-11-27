// API endpoint URL
const apiUrl = '';

// Initial state for microphone status and login status
let microphoneStatus = false;
let loginStatus = true;

// Function to set the color of the button based on the microphone status
function setButtonColor(status) {
    const circleButton = document.querySelector('.circle-button');
    circleButton.classList.remove('success-false', 'success-true');
    circleButton.classList.add(status ? 'success-true' : 'success-false');
}

// Function to fetch the initial microphone status from the API on page load
async function fetchInitialMicrophoneStatus() {
    try {
        const response = await fetch(apiUrl, { mode: 'no-cors' });
        const data = await response.text();
        microphoneStatus = data === 'true';
        setButtonColor(microphoneStatus);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to make API request and toggle the microphone status
async function makeApiRequest() {
    try {
        await fetch(apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ microphone_status: microphoneStatus }),
        });
        console.log(`Request sent successfully with microphone_status: ${microphoneStatus}`);
        microphoneStatus = !microphoneStatus;
        setButtonColor(microphoneStatus);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to update the login status on the API
async function updateLoginStatus(newValue) {
    try {
        await fetch(apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login_status: newValue }),
        });
        console.log(`Login status updated to: ${newValue}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch the initial login status on page load and update it to true
window.addEventListener('load', async () => {
    await updateLoginStatus(true);
    console.log('Login status set to true.');
});

// Update the login status to false before the page is closed
window.addEventListener('beforeunload', () => {
    updateLoginStatus(false);
    // Cancel the default behavior to show a confirmation dialog
          event.preventDefault();
    // Display a custom confirmation message
    event.returnValue = 'Are you sure you want to leave?';
    console.log('Login status set to false before page close.');
    navigator.sendBeacon(apiUrl, JSON.stringify({ login_status: false }));
});
    window.addEventListener('visibilitychange', function() {
      if (window.visibilityState === 'hidden') {
        // User switched to another tab or minimized the browser
          updateLoginStatus(false);
        // Perform actions here, like displaying a message
        console.log('Tab is now hidden');
      } else {
        // User switched back to the tab
        // Perform actions here, like removing the message
        console.log('Tab is now visible');
          updateLoginStatus(true);
      }
    });
// Fetch the initial microphone status on page load
fetchInitialMicrophoneStatus();
