(() => {
  const CONTACT_EMAIL = "hello@bngs.example";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  const yearEl = document.getElementById("year");
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Sticky header state */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile nav */
  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  };

  const openMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    menu.classList.add("is-open");
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* Hero entrance */
  const hero = document.querySelector(".hero");
  if (hero) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("is-ready"));
    });
  }

  /* Scroll reveals — sections + staggered items */
  const reveals = document.querySelectorAll(".reveal");
  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showReveal = (el) => {
    el.classList.add("is-visible");
    el.querySelectorAll(".reveal-item").forEach((item, i) => {
      item.style.setProperty("--reveal-delay", `${0.08 + i * 0.08}s`);
      item.classList.add("is-visible");
    });
  };

  if (prefersReduced) {
    reveals.forEach(showReveal);
    hero?.classList.add("is-ready");
  } else if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach(showReveal);
  }

  /* Service tabs */
  const tabs = document.querySelectorAll(".services__tab");
  const panels = document.querySelectorAll(".services__panel");

  const activateTab = (index) => {
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(index));
    tab.addEventListener("keydown", (e) => {
      let next = index;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      tabs[next].focus();
      activateTab(next);
    });
  });

  /* Contact form → mailto */
  const clearErrors = () => {
    form?.querySelectorAll(".field__error").forEach((el) => {
      el.hidden = true;
      el.textContent = "";
    });
    form?.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
  };

  const showError = (name, message) => {
    const input = form?.elements.namedItem(name);
    const err = form?.querySelector(`[data-error-for="${name}"]`);
    if (input && "classList" in input) input.classList.add("is-invalid");
    if (err) {
      err.textContent = message;
      err.hidden = false;
    }
  };

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    if (success) success.hidden = true;

    const name = String(form.elements.namedItem("name")?.value || "").trim();
    const email = String(form.elements.namedItem("email")?.value || "").trim();
    const message = String(form.elements.namedItem("message")?.value || "").trim();

    let valid = true;

    if (!name) {
      showError("name", "Please enter your name.");
      valid = false;
    }
    if (!email) {
      showError("email", "Please enter your email.");
      valid = false;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      valid = false;
    }
    if (!message) {
      showError("message", "Please enter a message.");
      valid = false;
    }

    if (!valid) return;

    const subject = encodeURIComponent(`BNGS Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    if (success) success.hidden = false;
    window.location.href = mailto;
  });
  /* PayOne Interactive Currency Transfer Calculator */
  const sendInput = document.getElementById("send-amount");
  const receiveInput = document.getElementById("receive-amount");
  const sendCurr = document.getElementById("send-curr");
  const recCurr = document.getElementById("rec-curr");

  const rates = {
    USD: { INR: 83.45, AED: 3.67, EUR: 0.92 },
    EUR: { INR: 90.80, AED: 4.00, USD: 1.09 },
    GBP: { INR: 106.25, AED: 4.67, EUR: 1.17, USD: 1.27 }
  };

  const updateCalculator = () => {
    if (!sendInput || !receiveInput || !sendCurr || !recCurr) return;
    const rawVal = parseFloat(sendInput.value.replace(/,/g, "")) || 0;
    const from = sendCurr.value;
    const to = recCurr.value;

    let rate = 1;
    if (from === to) {
      rate = 1;
    } else if (rates[from] && rates[from][to]) {
      rate = rates[from][to];
    } else {
      rate = 83.45;
    }

    const calculated = (rawVal * rate).toLocaleString("en-US", { maximumFractionDigits: 2 });
    receiveInput.value = calculated;

    const rateBadge = document.querySelector(".rate-badge span");
    if (rateBadge) {
      rateBadge.textContent = `1 ${from} = ${rate} ${to} · Guaranteed FX`;
    }
  };

  if (sendInput) {
    sendInput.addEventListener("input", updateCalculator);
    sendCurr?.addEventListener("change", updateCalculator);
    recCurr?.addEventListener("change", updateCalculator);
    updateCalculator();
  }
})();
