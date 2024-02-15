// This function will be called when new command output is received
function handleCommandOutput(data) {
    const outputElement = document.getElementById("commandOutput");
    outputElement.textContent += data; // Append the new data to the command output
  
    // Auto-scroll to the bottom of the output element
    outputElement.scrollTop = outputElement.scrollHeight;
  }
  
  document.getElementById("passwordForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    // Get the password value
    const password = document.getElementById("password").value;
  
    // Send password to the main process
    window.electron.sendPassword(password);
  
    // Clear the password field after sending the password
    document.getElementById("password").value = "";
  });
  
  // Register the handler for command output updates
  window.electron.onCommandOutput(handleCommandOutput);
  