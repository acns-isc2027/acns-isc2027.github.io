/* ACNS 2027 workshop website — small enhancements; the page also works without JavaScript. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  /* Collapsible navigation on small screens */
  var COMPACT_NAV = "(max-width: 51.99em)"; /* keep in sync with css/style.css */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var compact = window.matchMedia(COMPACT_NAV);

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (header && toggle && nav) {
    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
    });

    nav.addEventListener("click", function (event) {
      if (compact.matches && event.target.closest("a")) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (isOpen() && !header.contains(event.target)) {
        setOpen(false);
      }
    });

    header.addEventListener("focusout", function (event) {
      if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
        setOpen(false);
      }
    });

    if (compact.addEventListener) {
      compact.addEventListener("change", function () {
        setOpen(false);
      });
    }
  }

  /* E-mail addresses are written as "name [at] domain [dot] tld" in the HTML;
     turn them into mailto links. */
  Array.prototype.forEach.call(document.querySelectorAll("a.email"), function (link) {
    var address = link.textContent
      .replace(/\s*\[at\]\s*/i, "@")
      .replace(/\s*\[dot\]\s*/gi, ".")
      .trim();
    link.href = "mailto:" + address;
  });

  /* The AoE deadline is a single instant worldwide (19 Feb 2027 23:59:59 UTC-12).
     Countdown uses the same absolute deadline for all visitors. */
  var submissionClock = document.getElementById("submission-countdown");
  var countdownContainer = document.getElementById("submission-deadline-countdown");
  if (submissionClock && countdownContainer) {
    var closesAt = Date.parse(submissionClock.getAttribute("data-deadline"));
    var countdownTitle = document.getElementById("submission-countdown-title");
    var countdownValues = {};
    ["days", "hours", "minutes", "seconds"].forEach(function (unit) {
      countdownValues[unit] = submissionClock.querySelector('[data-countdown-unit="' + unit + '"]');
    });

    if (!isNaN(closesAt)) {
      var intervalId;
      function renderCountdown() {
        var remaining = Math.max(0, Math.ceil((closesAt - Date.now()) / 1000));
        if (remaining === 0) {
          countdownTitle.textContent = "Submission deadline has passed";
          submissionClock.hidden = true;
          if (intervalId) window.clearInterval(intervalId);
        } else {
          var days = Math.floor(remaining / 86400);
          var hours = Math.floor((remaining % 86400) / 3600);
          var minutes = Math.floor((remaining % 3600) / 60);
          var seconds = remaining % 60;
          countdownValues.days.textContent = String(days);
          countdownValues.hours.textContent = String(hours).padStart(2, "0");
          countdownValues.minutes.textContent = String(minutes).padStart(2, "0");
          countdownValues.seconds.textContent = String(seconds).padStart(2, "0");
        }
      }

      renderCountdown();
      countdownContainer.hidden = false;
      if (closesAt > Date.now()) {
        intervalId = window.setInterval(renderCountdown, 1000);
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) renderCountdown();
        });
      }
    }
  }

  /* Smooth scrolling for in-page links, enabled after loading so that
     links to a section (e.g. #call-for-papers) open at that section directly. */
  window.addEventListener("load", function () {
    window.requestAnimationFrame(function () {
      root.classList.add("smooth-scroll");
    });
  });
})();