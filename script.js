/* ============================================================
   LUMIERE - Fine Dining Restaurant | script.js
   ============================================================ */

// ========== PRELOADER ==========
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 2000);
});

// ========== CUSTOM CURSOR ==========
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor scale on hover
document.querySelectorAll('a, button, .table-unit, .tab-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(1.8)';
    follower.style.opacity = '0.8';
    follower.style.transform += ' scale(1.4)';
  });
  el.addEventListener('mouseleave', () => {
    follower.style.opacity = '0.5';
  });
});

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ========== HAMBURGER / MOBILE MENU ==========
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
}

// ========== SCROLL REVEAL ==========
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ========== MENU TABS ==========
const tabBtns = document.querySelectorAll('.tab-btn');
const menuPanels = document.querySelectorAll('.menu-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    menuPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('tab-' + target).classList.add('active');

    // Re-trigger reveals in new panel
    document.querySelectorAll('#tab-' + target + ' .reveal').forEach(el => {
      el.classList.remove('visible');
      revealObserver.observe(el);
    });
  });
});

// ========== TABLE SELECTION ==========
const tableUnits = document.querySelectorAll('.table-unit:not(.occupied)');
const selectedInfo = document.getElementById('selectedInfo');
const selectedText = document.getElementById('selectedText');
const resTableInput = document.getElementById('resTable');

let selectedTable = null;

tableUnits.forEach(unit => {
  unit.addEventListener('click', () => {
    if (selectedTable === unit) {
      // Deselect
      unit.classList.remove('selected');
      selectedTable = null;
      selectedText.textContent = 'Click a table to select it for reservation';
      selectedInfo.classList.remove('has-selection');
      if (resTableInput) resTableInput.value = '';
      return;
    }

    // Deselect previous
    if (selectedTable) selectedTable.classList.remove('selected');

    unit.classList.add('selected');
    selectedTable = unit;

    const tableName = unit.dataset.table;
    const seats = unit.dataset.seats;
    const displayText = 'Table ' + tableName + ' selected  |  ' + seats + ' seat(s)';
    selectedText.textContent = displayText;
    selectedInfo.classList.add('has-selection');

    if (resTableInput) {
      resTableInput.value = 'Table ' + tableName + ' (' + seats + ' Seats)';
    }

    // Smooth scroll to reservation
    setTimeout(() => {
      document.getElementById('reservation').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
  });
});

// ========== RESERVATION FORM ==========
const form = document.getElementById('reservationForm');
const successMsg = document.getElementById('successMsg');

// Set min date to today
const dateInput = document.getElementById('resDate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('resName').value.trim();
  const phone = document.getElementById('resPhone').value.trim();
  const email = document.getElementById('resEmail').value.trim();
  const guests = document.getElementById('resGuests').value;
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;

  // Simple validation
  if (!name || !phone || !email || !guests || !date || !time) {
    shakeForm();
    showToast('Please fill in all required fields.');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address.');
    return;
  }

  // Simulate submission
  const submitBtn = form.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Confirming...';

  setTimeout(() => {
    form.style.display = 'none';
    successMsg.classList.add('show');
  }, 1500);
});

function shakeForm() {
  form.style.animation = 'shakeForm 0.4s ease';
  setTimeout(() => form.style.animation = '', 400);
}

function resetForm() {
  form.reset();
  form.style.display = 'flex';
  successMsg.classList.remove('show');
  form.querySelector('.btn-submit').disabled = false;
  form.querySelector('.btn-text').textContent = 'Confirm Reservation';
  if (resTableInput) resTableInput.value = '';
  if (selectedTable) {
    selectedTable.classList.remove('selected');
    selectedTable = null;
    selectedText.textContent = 'Click a table to select it for reservation';
    selectedInfo.classList.remove('has-selection');
  }
}

// Shake animation injection
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeForm {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ========== TOAST NOTIFICATION ==========
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem;
    background: #1C1510; border: 1px solid #E8732A;
    color: #F5EDD8; padding: 1rem 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.75rem; letter-spacing:
