



const header = document.querySelector("header");

window.addEventListener ("scroll", function(){
    header.classList.toggle ("sticky", window.scrollY > 100)
});








/*--------------------
Vars
--------------------*/
let progress = 50
let startX = 0
let active = 0
let isDown = false

/*--------------------
Contants
--------------------*/
const speedWheel = 0.02
const speedDrag = -0.1

/*--------------------
Get Z
--------------------*/
const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))

/*--------------------
Items
--------------------*/
const $items = document.querySelectorAll('.carousel-item')
const $cursors = document.querySelectorAll('.cursor')

const displayItems = (item, index, active) => {
  const zIndex = getZindex([...$items], active)[index]
  item.style.setProperty('--zIndex', zIndex)
  item.style.setProperty('--active', (index-active)/$items.length)
}

/*--------------------
Animate
--------------------*/
const animate = () => {
  progress = Math.max(0, Math.min(progress, 100))
  active = Math.floor(progress/100*($items.length-1))
  
  $items.forEach((item, index) => displayItems(item, index, active))
}
animate()

/*--------------------
Click on Items
--------------------*/
$items.forEach((item, i) => {
  item.addEventListener('click', () => {
    progress = (i/$items.length) * 100 + 10
    animate()
  })
})

/*--------------------
Handlers
--------------------*/
const handleWheel = e => {
  const wheelProgress = e.deltaY * speedWheel
  progress = progress + wheelProgress
  animate()
}

const handleMouseMove = (e) => {
  if (e.type === 'mousemove') {
    $cursors.forEach(($cursor) => {
      $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    })
  }
  if (!isDown) return
  const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
  const mouseProgress = (x - startX) * speedDrag
  progress = progress + mouseProgress
  startX = x
  animate()
}

const handleMouseDown = e => {
  isDown = true
  startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
}

const handleMouseUp = () => {
  isDown = false
}

/*--------------------
Listeners
--------------------*/
document.addEventListener('mousewheel', handleWheel)
document.addEventListener('mousedown', handleMouseDown)
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)
document.addEventListener('touchstart', handleMouseDown)
document.addEventListener('touchmove', handleMouseMove)
document.addEventListener('touchend', handleMouseUp)

// contactForm



document.getElementById('hireButton').addEventListener('click', function() {
  var contactForm = document.getElementById('contactForm');
  contactForm.style.display = (contactForm.style.display === 'block') ? 'none' : 'block';
});

document.addEventListener('click', function(event) {
  var contactForm = document.getElementById('contactForm');
  var hireButton = document.getElementById('hireButton');
  
  // Check if the click target is not the contact form or the hire button
  if (event.target !== contactForm && event.target !== hireButton) {
    contactForm.style.display = 'none';
  }
});

// Stop click event propagation within the form
document.getElementById('contactForm').addEventListener('click', function(event) {
  event.stopPropagation();
});




document.addEventListener("DOMContentLoaded", function() {
  var backButton = document.getElementById("backButton");

  window.onscroll = function() {
    // Replace "section1" with the ID of your home section
    var homeSection = document.getElementById("home");

    // Adjust the visibility based on the scroll position
    if (window.scrollY > 500) {
      backButton.style.display = "block";
    } else {
      backButton.style.display = "none";
    }
  };
});

function goToHome() {
  // Replace "section1" with the ID of your home section
  var homeSection = document.getElementById("home");

  // Scroll to the home section
  homeSection.scrollIntoView({ behavior: 'smooth' });
}














