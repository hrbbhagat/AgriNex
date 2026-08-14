// AGRO SPACE Master Interactivity & GSAP Animation Script

document.addEventListener("DOMContentLoaded", function () {
  // 1. Custom Mouse Follower Cursor Effect
  const crsr = document.querySelector("#cursor");
  const blur = document.querySelector("#cursor-blur");

  if (crsr && blur) {
    document.addEventListener("mousemove", function (dets) {
      crsr.style.left = `${dets.x}px`;
      crsr.style.top = `${dets.y}px`;
      blur.style.left = `${dets.x - 225}px`;
      blur.style.top = `${dets.y - 225}px`;
    });
  }

  // Hover cursor expansion
  const hoverTargets = document.querySelectorAll(
    "#nav h4, #nav a, .card, .elem, #arrow, .cta-primary-btn, .cta-secondary-btn, .workflow-step, .t-card, .faq-question"
  );
  hoverTargets.forEach(function (elem) {
    elem.addEventListener("mouseenter", function () {
      if (crsr) {
        crsr.style.transform = "scale(3)";
        crsr.style.border = "1px solid #fff";
        crsr.style.backgroundColor = "transparent";
      }
    });
    elem.addEventListener("mouseleave", function () {
      if (crsr) {
        crsr.style.transform = "scale(1)";
        crsr.style.border = "0px solid #95C11E";
        crsr.style.backgroundColor = "#95C11E";
      }
    });
  });

  // 2. Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // 3. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((other) => other.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  // 4. Animated Stats Counter Trigger
  let animatedStats = false;
  function animateCounters() {
    const counters = document.querySelectorAll(".counter-num");
    counters.forEach((counter) => {
      const target = parseFloat(counter.getAttribute("data-target"));
      const isFloat = target % 1 !== 0;
      let count = 0;
      const speed = target / 60;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = isFloat ? count.toFixed(1) : Math.ceil(count).toLocaleString();
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = isFloat ? target.toFixed(1) : target.toLocaleString();
        }
      };
      updateCount();
    });
  }

  // Observer for Stats Counter
  const statsSec = document.querySelector("#stats-counter-sec");
  if (statsSec) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedStats) {
        animatedStats = true;
        animateCounters();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSec);
  }

  // 5. GSAP ScrollTrigger Animations
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Nav Background Shift on Scroll
    gsap.to("#nav", {
      backgroundColor: "#000",
      duration: 0.5,
      height: "90px",
      scrollTrigger: {
        trigger: "#nav",
        scroller: "body",
        start: "top -10%",
        end: "top -11%",
        scrub: 1,
      },
    });

    // Main Background Shift
    gsap.to("#main", {
      backgroundColor: "#000",
      scrollTrigger: {
        trigger: "#main",
        scroller: "body",
        start: "top -25%",
        end: "top -70%",
        scrub: 2,
      },
    });

    // About Us Fade & Slide
    gsap.from("#about-us img, #about-us-in", {
      y: 90,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: "#about-us",
        scroller: "body",
        start: "top 70%",
        end: "top 65%",
        scrub: 1,
      },
    });

    // AI Cards Stagger Scale
    gsap.from(".card", {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      scrollTrigger: {
        trigger: "#cards-container",
        scroller: "body",
        start: "top 70%",
        end: "top 60%",
        scrub: 1,
      },
    });

    // Quote Colons Shift
    gsap.from("#colon1", {
      y: -70,
      x: -70,
      scrollTrigger: {
        trigger: "#colon1",
        scroller: "body",
        start: "top 55%",
        end: "top 45%",
        scrub: 4,
      },
    });

    gsap.from("#colon2", {
      y: 70,
      x: 70,
      scrollTrigger: {
        trigger: "#colon2",
        scroller: "body",
        start: "top 55%",
        end: "top 45%",
        scrub: 4,
      },
    });

    // Page 4 Heading Shift
    gsap.from("#page4 h1", {
      y: 50,
      scrollTrigger: {
        trigger: "#page4 h1",
        scroller: "body",
        start: "top 75%",
        end: "top 70%",
        scrub: 3,
      },
    });

    // Workflow Steps Fade In
    gsap.from(".workflow-step", {
      y: 40,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".workflow-grid",
        scroller: "body",
        start: "top 75%",
        end: "top 60%",
        scrub: 1,
      },
    });
  }
});

// Global NPK Calculator Function
function calculateNPK() {
  const crop = document.getElementById("calc-crop").value;
  const acres = parseFloat(document.getElementById("calc-acres").value) || 1;

  let baseN = 45, baseP = 20, baseK = 20;

  if (crop === "rice") { baseN = 50; baseP = 25; baseK = 25; }
  else if (crop === "wheat") { baseN = 60; baseP = 30; baseK = 20; }
  else if (crop === "maize") { baseN = 55; baseP = 25; baseK = 30; }
  else if (crop === "cotton") { baseN = 40; baseP = 20; baseK = 20; }
  else if (crop === "sugarcane") { baseN = 75; baseP = 35; baseK = 40; }

  document.getElementById("res-n").innerText = (baseN * acres).toFixed(0) + " kg";
  document.getElementById("res-p").innerText = (baseP * acres).toFixed(0) + " kg";
  document.getElementById("res-k").innerText = (baseK * acres).toFixed(0) + " kg";

  document.getElementById("calc-result").style.display = "block";
}
