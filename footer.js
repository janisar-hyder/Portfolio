// Get the footer element
const footer = document.getElementById('page-footer');

// Calculate the height of the footer
const footerHeight = footer.clientHeight;

// Calculate the total height of the page including content and footer
const totalPageHeight = document.documentElement.scrollHeight;

// Calculate the height of the visible portion of the browser window
const windowHeight = window.innerHeight;

// Calculate the threshold position to show the footer
const threshold = totalPageHeight - (windowHeight + footerHeight);

// Function to check scroll position and toggle footer visibility
function checkScrollPosition() {
  const scrollPosition = window.scrollY || window.pageYOffset;

  if (scrollPosition >= threshold) {
    footer.classList.remove('hidden');
  } else {
    footer.classList.add('hidden');
  }
}

// Attach the checkScrollPosition function to the scroll event
window.addEventListener('scroll', checkScrollPosition);

// Initial check when the page loads
checkScrollPosition();
