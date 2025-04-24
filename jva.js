document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');
    const showPasswordBtn = document.getElementById('show-password-btn');
    const showConfirmPasswordBtn = document.getElementById('show-confirm-password-btn');
    
    // Toggle password visibility
    showPasswordBtn.addEventListener('click', function() {
      if (passwordField.type === 'password') {
        passwordField.type = 'text';
        showPasswordBtn.textContent = 'Hide';
      } else {
        passwordField.type = 'password';
        showPasswordBtn.textContent = 'Show';
      }
    });
  
    // Toggle confirm password visibility
    showConfirmPasswordBtn.addEventListener('click', function() {
      if (confirmPasswordField.type === 'password') {
        confirmPasswordField.type = 'text';
        showConfirmPasswordBtn.textContent = 'Hide';
      } else {
        confirmPasswordField.type = 'password';
        showConfirmPasswordBtn.textContent = 'Show';
      }
    });
  });
  