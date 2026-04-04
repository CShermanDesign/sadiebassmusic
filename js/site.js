(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initForms();
    initSliders();
    initPopup();
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

  function initSliders() {
    document.querySelectorAll('.w-slider').forEach(function (slider) {
      var mask = slider.querySelector('.w-slider-mask');
      var slides = slider.querySelectorAll('.w-slide');
      var leftArrow = slider.querySelector('.w-slider-arrow-left');
      var rightArrow = slider.querySelector('.w-slider-arrow-right');
      var nav = slider.querySelector('.w-slider-nav');
      if (!mask || slides.length === 0) return;

      var current = 0;
      var total = slides.length;

      function goTo(index) {
        if (index < 0) index = 0;
        if (index >= total) index = total - 1;
        current = index;
        mask.style.transition = 'transform 0.5s ease';
        mask.style.transform = 'translateX(-' + (current * 100) + '%)';
        if (nav) updateDots();
      }

      function updateDots() {
        var dots = nav.querySelectorAll('div');
        dots.forEach(function (dot, i) {
          dot.classList.toggle('w-active', i === current);
        });
      }

      if (nav) {
        for (var i = 0; i < total; i++) {
          var dot = document.createElement('div');
          dot.className = 'w-slider-dot' + (i === 0 ? ' w-active' : '');
          dot.setAttribute('data-index', i);
          dot.addEventListener('click', function () {
            goTo(parseInt(this.getAttribute('data-index')));
          });
          nav.appendChild(dot);
        }
      }

      if (leftArrow) {
        leftArrow.addEventListener('click', function (e) {
          e.preventDefault();
          goTo(current - 1);
        });
      }
      if (rightArrow) {
        rightArrow.addEventListener('click', function (e) {
          e.preventDefault();
          goTo(current + 1);
        });
      }
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

  function initPopup() {
    var overlay = document.getElementById('popup-overlay');
    var closeBtn = document.getElementById('popup-close');
    var form = document.getElementById('popup-subscriber-form');
    if (!overlay || sessionStorage.getItem('popup-shown')) return;

    setTimeout(function () {
      overlay.classList.add('active');
      sessionStorage.setItem('popup-shown', '1');
    }, 5000);

    function closePopup() {
      overlay.classList.remove('active');
    }

    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('[type="submit"]');
        var original = btn.value;
        btn.value = 'Sending...';
        btn.disabled = true;

        fetch(form.action || window.location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString()
        })
          .then(function (res) {
            if (!res.ok) throw new Error('fail');
            form.style.display = 'none';
            overlay.querySelector('.popup-success').style.display = 'block';
            setTimeout(closePopup, 3000);
          })
          .catch(function () {
            var err = overlay.querySelector('.popup-error');
            err.style.display = 'block';
            setTimeout(function () { err.style.display = 'none'; }, 4000);
          })
          .finally(function () {
            btn.value = original;
            btn.disabled = false;
          });
      });
    }
  }
})();
