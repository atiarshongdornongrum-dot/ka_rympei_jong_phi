document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('ctaButton');
  const statusText = document.getElementById('statusText');

  if (button) {
    button.addEventListener('click', () => {
      statusText.textContent = 'Project started';
      button.textContent = 'Started';
      button.disabled = true;
    });
  }
});
