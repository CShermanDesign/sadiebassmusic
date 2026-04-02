(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initForms();
  });

  function initMobileMenu() {
    var hamburger = document.querySelector('.fullscreen-nav');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('menu-open');
      hamburger.classList.toggle('menu-open', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('menu-open');
        hamburger.classList.remove('menu-open');
      });
    });
  }

  function initForms() {
    document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
      form.addEventListener('submit', handleSubmit);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var btn = form.querySelector('[type="submit"]');
    var original = btn.value;
    var wrapper = form.parentElement;

    btn.value = 'Sending...';
    btn.disabled = true;

    fetch(form.action || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        form.style.display = 'none';
        var success = wrapper.querySelector('.success-message');
        if (success) success.style.display = 'block';
        form.reset();
      })
      .catch(function () {
        var error = wrapper.querySelector('.error-message');
        if (error) error.style.display = 'block';
        setTimeout(function () {
          error.style.display = 'none';
        }, 5000);
      })
      .finally(function () {
        btn.value = original;
        btn.disabled = false;
      });
  }
})();
