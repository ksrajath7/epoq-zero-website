// Theme detection and early setup
(function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && savedTheme !== 'lego') {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
})();

// Wait for DOM to load to attach toggle actions
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.theme-toggle');
  
  function updateToggleButtons() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const isSubdirectory = window.location.pathname.includes('/projects/');
    const assetPath = isSubdirectory 
      ? '../assets/pngtree-wow-text-on-comic-background-with-cloud-png-image_13819523.png' 
      : './assets/pngtree-wow-text-on-comic-background-with-cloud-png-image_13819523.png';

    toggles.forEach(toggle => {
      if (currentTheme === 'comic' || currentTheme === 'lego') {
        // In Comic Mode (or Lego Mode fallback), show Dark Mode toggle (moon)
        toggle.innerHTML = '🌙';
        toggle.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        // In Default Mode, show the WOW comic image
        toggle.innerHTML = `<img src="${assetPath}" alt="Comic Mode Toggle" class="wow-toggle-img">`;
        toggle.setAttribute('aria-label', 'Switch to Comic Mode');
      }
    });

    // Update Superman speech bubble text dynamically if it exists
    const supermanText = document.querySelector('.superman-speech-text');
    if (supermanText) {
      if (currentTheme === 'comic') {
        supermanText.textContent = 'Awesome! ⚡';
      } else {
        supermanText.textContent = 'Try Comic Mode! 🦸‍♂️';
      }
    }
  }

  // Inject Superman Guide dynamically for Desktop
  function initSupermanGuide() {
    const desktopToggle = document.querySelector('.theme-toggle.desktop-only');
    if (!desktopToggle) return;

    // Check if dismissed
    if (localStorage.getItem('superman-dismissed') === 'true') return;

    // Wrap the desktop toggle button in .theme-toggle-wrapper to establish relative context
    let wrapper = desktopToggle.parentElement;
    if (!wrapper.classList.contains('theme-toggle-wrapper')) {
      wrapper = document.createElement('div');
      wrapper.className = 'theme-toggle-wrapper';
      desktopToggle.parentNode.insertBefore(wrapper, desktopToggle);
      wrapper.appendChild(desktopToggle);
    }

    // Create guide container
    const guide = document.createElement('div');
    guide.className = 'superman-guide';

    const currentTheme = document.documentElement.getAttribute('data-theme');
    let speechText = 'Try Comic Mode! 🦸‍♂️';
    if (currentTheme === 'comic') speechText = 'Awesome! ⚡';

    guide.innerHTML = `
      <div class="superman-speech-bubble">
        <span class="superman-speech-text">${speechText}</span>
        <button class="superman-close-btn" aria-label="Dismiss">&times;</button>
      </div>
      <svg class="superman-svg" viewBox="0 0 100 120" width="70" height="84" xmlns="http://www.w3.org/2000/svg">
        <!-- Cape -->
        <path class="superman-cape" d="M 40 54 C 20 60, 15 85, 35 102 C 50 105, 65 102, 80 85 C 85 60, 60 54, 60 54 C 55 75, 45 75, 40 54 Z" fill="#e63946" stroke="#1a1a1a" stroke-width="2.5" />
        <!-- Left Arm (on hip) -->
        <path d="M 40 56 Q 32 60 38 68" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round" />
        <circle cx="38" cy="68" r="3.5" fill="#ffd1b3" stroke="#1a1a1a" stroke-width="2" />
        <!-- Left Leg -->
        <rect x="44" y="82" width="5" height="12" fill="#2563eb" stroke="#1a1a1a" stroke-width="2" />
        <path d="M 44 94 L 49 94 L 49 100 C 49 101, 41 101, 41 100 L 44 94" fill="#e63946" stroke="#1a1a1a" stroke-width="2" />
        <!-- Right Leg -->
        <rect x="51" y="82" width="5" height="12" fill="#2563eb" stroke="#1a1a1a" stroke-width="2" />
        <path d="M 51 94 L 56 94 L 59 100 C 59 101, 51 101, 51 100 L 51 94" fill="#e63946" stroke="#1a1a1a" stroke-width="2" />
        <!-- Body (Blue suit) -->
        <path d="M 40 54 L 60 54 L 57 76 L 43 76 Z" fill="#2563eb" stroke="#1a1a1a" stroke-width="2.5" />
        <!-- S Shield -->
        <polygon points="46,58 54,58 56,64 50,69 44,64" fill="#ffe600" stroke="#1a1a1a" stroke-width="1.5" />
        <path d="M 48 60.5 C 48 59, 52 59, 52 61 C 52 62, 48 63, 48 64 C 48 66, 52 66, 52 65" stroke="#e63946" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <!-- Belt -->
        <rect x="43" y="76" width="14" height="6" fill="#ffe600" stroke="#1a1a1a" stroke-width="2" />
        <rect x="49" y="76" width="2" height="6" fill="#e63946" stroke="#1a1a1a" stroke-width="1.2" />
        <!-- Neck -->
        <rect x="47" y="49" width="6" height="6" fill="#ffd1b3" stroke="#1a1a1a" stroke-width="2" />
        <!-- Head -->
        <circle cx="50" cy="36" r="14" fill="#ffd1b3" stroke="#1a1a1a" stroke-width="2" />
        <circle cx="45" cy="35" r="1.5" fill="#1a1a1a" />
        <circle cx="55" cy="35" r="1.5" fill="#1a1a1a" />
        <path d="M 47 42 Q 50 45 53 42" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" />
        <!-- Hair -->
        <path d="M 36 34 C 36 22, 64 22, 64 34 C 64 27, 60 26, 56 27 C 50 25, 42 27, 36 34 Z" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1.5" />
        <path class="superman-hair-curl" d="M 48 31 C 48 35, 52 35, 52 38 C 53 35, 50 33, 50 31 Z" fill="#1a1a1a" />
        <!-- Right Arm (pointing) -->
        <g class="superman-arm-pointing">
          <path d="M 60 52 L 40 28 L 44 24 L 60 47 Z" fill="#2563eb" stroke="#1a1a1a" stroke-width="2" />
          <circle cx="42" cy="26" r="4" fill="#ffd1b3" stroke="#1a1a1a" stroke-width="2" />
          <path d="M 42 26 L 28 10 C 26 8, 24 10, 26 12 L 39 28 L 42 26 Z" fill="#ffd1b3" stroke="#1a1a1a" stroke-width="2" />
        </g>
      </svg>
    `;

    // Close button dismiss handler
    const closeBtn = guide.querySelector('.superman-close-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      guide.classList.add('dismissed');
      localStorage.setItem('superman-dismissed', 'true');
      setTimeout(() => {
        guide.remove();
      }, 400); // Wait for transition to complete
    });

    wrapper.appendChild(guide);
  }

  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      if (currentTheme === 'comic' || currentTheme === 'lego') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'comic');
        localStorage.setItem('theme', 'comic');
      }
      
      updateToggleButtons();
    });
  });

  // Initial updates on load
  updateToggleButtons();
  // initSupermanGuide();
});
