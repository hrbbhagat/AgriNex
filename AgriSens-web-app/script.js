// AGRO SPACE Animation & Interactivity Script

document.addEventListener("DOMContentLoaded", function () {
  // Cursor Effect
  const crsr = document.querySelector("#cursor");
  const blur = document.querySelector("#cursor-blur");

  if (crsr && blur) {
    document.addEventListener("mousemove", function (dets) {
      crsr.style.left = `${dets.x}px`;
      crsr.style.top = `${dets.y}px`;
      blur.style.left = `${dets.x - 250}px`;
      blur.style.top = `${dets.y - 250}px`;
    });
  }

  const h4all = document.querySelectorAll("#nav h4, #nav a, .card, .elem, #arrow");
  h4all.forEach(function (elem) {
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

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          targetElem.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // GSAP Animations with ScrollTrigger
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to("#nav", {
      backgroundColor: "#000",
      duration: 0.5,
      height: "110px",
      scrollTrigger: {
        trigger: "#nav",
        scroller: "body",
        start: "top -10%",
        end: "top -11%",
        scrub: 1,
      },
    });

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

    gsap.from(".card", {
      scale: 0.8,
      duration: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".card",
        scroller: "body",
        start: "top 70%",
        end: "top 65%",
        scrub: 1,
      },
    });

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
  }
});
