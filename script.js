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

  /* Scroll reveals */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
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
})();
