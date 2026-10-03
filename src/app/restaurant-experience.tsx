"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
// Mobile browser chrome changes visual viewport height during scroll. Keep
// ScrollTrigger measurements stable while the address bar expands or collapses.
ScrollTrigger.config({ ignoreMobileResize: true });

type MenuCategory = "Red Wine" | "White Wine" | "Rose Wine" | "Beers" | "Spirits" | "Liqueurs" | "Soft Drinks" | "Hot Drinks";
type Drink = { name: string; detail: string; price: string };

const menu: Record<MenuCategory, Drink[]> = {
  "Red Wine": [
    { name: "Duka Reserva Superiore", detail: "Albanian · bottle", price: "£60.00" },
    { name: "Duka Reserva", detail: "Albanian · bottle", price: "£50.00" },
    { name: "Duka Tempranillo", detail: "Albanian · bottle", price: "£40.00" },
    { name: "Amicale", detail: "Bottle", price: "£40.00" },
    { name: "Primitivo", detail: "Bottle", price: "£40.00" },
    { name: "Valpolicella", detail: "Bottle", price: "£30.00" },
    { name: "Chianti Classico", detail: "Bottle", price: "£30.00" },
    { name: "Shiraz", detail: "125ml £4.00 · 175ml £6.00 · 250ml £8.00", price: "Bottle £25.00" },
  ],
  "White Wine": [
    { name: "Duka White Shesh", detail: "Albanian · bottle", price: "£30.00" },
    { name: "Pinot Grigio", detail: "125ml £4.00 · 175ml £6.00 · 250ml £8.00", price: "Bottle £25.00" },
  ],
  "Rose Wine": [
    { name: "Pinot Grigio Blush", detail: "125ml £4.00 · 175ml £6.00 · 250ml £8.00", price: "Bottle £25.00" },
  ],
  "Beers": [
    { name: "PEJA", detail: "Albanian Pilsner", price: "£4.50" },
    { name: "Corona", detail: "Beer", price: "£4.50" },
    { name: "Heineken", detail: "Beer", price: "£4.50" },
    { name: "Budweiser", detail: "Beer", price: "£4.00" },
    { name: "Peroni – Nastro Azzurro", detail: "Beer", price: "£4.00" },
  ],
  "Spirits": [
    { name: "Whiskey", detail: "Monkey Shoulder, Jameson, Jack Daniel’s, JW Red Label, JW Black Label", price: "Single £4.50 · Double £9.00" },
    { name: "Gin", detail: "Tanqueray London Dry Gin, Bombay Sapphire, Gordon’s", price: "Single £4.00 · Double £8.00" },
    { name: "Brandy", detail: "Remy Martin V.S.O.P, Vecchia Romagna Riserva, Skenderbeu (Albanian)", price: "Single £4.00 · Double £8.00" },
    { name: "Rum", detail: "Bacardi, Captain Morgan Spiced Gold", price: "Single £4.00 · Double £8.00" },
    { name: "Vodka", detail: "Absolut, Grey Goose", price: "Single £4.00 · Double £8.00" },
  ],
  "Liqueurs": [
    { name: "Baileys", detail: "Single or double", price: "£4.50 · £9.00" },
    { name: "Disarono", detail: "Single or double", price: "£4.50 · £9.00" },
    { name: "Lemoncello", detail: "Single or double", price: "£4.00 · £8.00" },
    { name: "Orange Pong", detail: "Albanian · single or double", price: "£4.00 · £8.00" },
    { name: "Raki", detail: "Single or double", price: "£3.50 · £7.00" },
  ],
  "Soft Drinks": [
    { name: "Bravo Peach", detail: "Pjeshke", price: "£2.50" },
    { name: "Bravo Apple", detail: "Molle", price: "£2.50" },
    { name: "Bravo Strawberry", detail: "Luleshtrydhye", price: "£2.50" },
    { name: "Bravo Red Grape", detail: "Rrushi", price: "£2.50" },
    { name: "Fanta Exotic", detail: "Soft drink", price: "£2.50" },
    { name: "B52", detail: "Energy drink", price: "£2.00" },
    { name: "Red Bull", detail: "Energy drink", price: "£2.50" },
    { name: "Lemon Soda", detail: "Soft drink", price: "£2.50" },
    { name: "San Pellegrino Orange", detail: "Soft drink", price: "£2.50" },
    { name: "Coca Cola", detail: "Soft drink", price: "£2.00" },
    { name: "Diet Coke", detail: "Soft drink", price: "£2.00" },
    { name: "Fanta Orange", detail: "Soft drink", price: "£2.00" },
    { name: "Still Water", detail: "Water", price: "£2.00" },
    { name: "Premium Still Water", detail: "Water", price: "£2.50" },
    { name: "Strathmore Still Water", detail: "Water", price: "£2.50" },
    { name: "Strathmore Sparkling Water", detail: "Sparkling water", price: "£2.50" },
    { name: "Dhallt", detail: "Traditional Albanian drink", price: "£2.00" },
  ],
  "Hot Drinks": [
    { name: "Single Espresso", detail: "Coffee", price: "£2.00" },
    { name: "Double Espresso", detail: "Coffee", price: "£3.00" },
    { name: "Single Machiato", detail: "Coffee", price: "£2.50" },
    { name: "Double Machiato", detail: "Coffee", price: "£3.50" },
    { name: "Latte", detail: "Coffee", price: "£3.50" },
    { name: "Cappuccino", detail: "Coffee", price: "£3.50" },
    { name: "Americano", detail: "Coffee", price: "£2.50" },
    { name: "Hot Chocolate", detail: "Hot drink", price: "£3.50" },
    { name: "Freddo Espresso", detail: "Cold espresso", price: "£3.00" },
  ],
};

const categories = Object.keys(menu) as MenuCategory[];

export default function RestaurantExperience() {
  const cinemaRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dishScrollRef = useRef<HTMLElement>(null);
  const dishVideoRef = useRef<HTMLVideoElement>(null);
  const [category, setCategory] = useState<MenuCategory>("Red Wine");
  const [bookingMessage, setBookingMessage] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setHasScrolled(window.scrollY > 72);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const section = cinemaRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let disposed = false;
    let videoTweenAdded = false;
    let desktopVideoReadyHandler: (() => void) | undefined;
    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const FRAME_COUNT = 72;
    const canvas = canvasRef.current;
    const ctx = isMobile && canvas ? canvas.getContext("2d") : null;
    const frames: (HTMLImageElement | undefined)[] = [];
    const frameState = { frame: 0 };
    let shownFrame = -1;

    // Cover-fit draw of the nearest already-loaded frame at or before `index`.
    const drawFrame = (index: number) => {
      if (!ctx || !canvas) return;
      let img: HTMLImageElement | undefined;
      for (let i = index; i >= 0 && !img; i--) {
        if (frames[i]?.complete && frames[i]!.naturalWidth) img = frames[i];
      }
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) * 0.52, w, h);
      shownFrame = index;
    };

    const sizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      drawFrame(Math.max(shownFrame, 0));
    };

    if (ctx) {
      // Image sequence instead of seeking a <video>: mobile browsers do not seek
      // reliably from scroll, but drawing a still frame always works.
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = document.createElement("img");
        img.decoding = "async";
        img.onload = () => { if (i === 0 || i <= Math.round(frameState.frame)) drawFrame(Math.round(frameState.frame)); };
        img.src = `/frames/f${String(i + 1).padStart(3, "0")}.webp`;
        frames[i] = img;
      }
      sizeCanvas();
      window.addEventListener("resize", sizeCanvas);
    }

    const context = gsap.context(() => {
      gsap.set(".chapter--interior, .chapter--book", { autoAlpha: 0, y: 22 });
      gsap.set(".book-cover", { rotationY: 0 });

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (isMobile ? "+=1900" : "+=3200"),
          scrub: isMobile ? true : 0.45,
          pin: !isMobile,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (ctx) {
        story.fromTo(
          frameState,
          { frame: 0 },
          {
            frame: FRAME_COUNT - 1,
            duration: 1,
            ease: "none",
            onUpdate: () => {
              const f = Math.round(frameState.frame);
              if (f !== shownFrame) drawFrame(f);
            },
          },
          0,
        );
      }

      desktopVideoReadyHandler = () => {
        if (disposed || isMobile || videoTweenAdded ||
            video.readyState < HTMLMediaElement.HAVE_METADATA ||
            !Number.isFinite(video.duration) || video.duration <= 0) return;
        videoTweenAdded = true;
        story.fromTo(
          video,
          { currentTime: 0 },
          { currentTime: video.duration, duration: 1, ease: "none", immediateRender: false },
          0,
        );
        ScrollTrigger.refresh();
      };

      if (!isMobile) {
        video.addEventListener("loadedmetadata", desktopVideoReadyHandler);
        desktopVideoReadyHandler();
      }

      story.to(".chapter--arrival", { autoAlpha: 0, y: -18, duration: 0.08 }, 0.28);
      story.fromTo(
        ".chapter--interior",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.08 },
        0.39,
      );
      story.to(".chapter--interior", { autoAlpha: 0, y: -18, duration: 0.07 }, 0.69);
      story.fromTo(
        ".chapter--book",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.08 },
        0.74,
      );
      story.to(".chapter--book", { autoAlpha: 0, y: -12, duration: 0.06 }, 0.98);

      const menuOpening = gsap.timeline({
        scrollTrigger: isMobile
          ? {
              trigger: ".menu-book",
              start: "top 85%",
              end: "center 40%",
              scrub: true,
              invalidateOnRefresh: true,
            }
          : {
              trigger: "#menu",
              start: "top top",
              end: "+=1200",
              scrub: 0.45,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
      });
      menuOpening.fromTo(
        ".menu-book",
        { scale: 0.84, y: 28 },
        { scale: 1, y: 0, duration: 0.25, ease: "none" },
        0,
      );
      menuOpening.to(".book-cover", { rotationY: -168, duration: 0.75, ease: "none" }, 0.2);
    });

    const refreshAfterLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      refreshAfterLoad();
    } else {
      window.addEventListener("load", refreshAfterLoad, { once: true });
    }
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", refreshAfterLoad);
      disposed = true;
      // GSAP context reverts the animation; detach the video readiness listener too.
      if (desktopVideoReadyHandler) {
        video.removeEventListener("loadedmetadata", desktopVideoReadyHandler);
      }
      window.removeEventListener("resize", sizeCanvas);
      context.revert();
    };
  }, []);

  useEffect(() => {
    const section = dishScrollRef.current;
    const video = dishVideoRef.current;
    if (!section || !video) return;

    const cues = gsap.utils.toArray<HTMLElement>(".dish-scroll__cue", section);
    const progressBar = section.querySelector<HTMLElement>(".dish-scroll__progress-bar");
    let context: gsap.Context | undefined;
    let initialized = false;

    const setupScrollAnimation = () => {
      if (initialized || !Number.isFinite(video.duration) || video.duration <= 0) return;
      initialized = true;
      const duration = video.duration;

      context = gsap.context(() => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });

        timeline.fromTo(
          video,
          { currentTime: 0 },
          { currentTime: duration, duration: 1, ease: "none", immediateRender: false },
          0,
        );

        const cueSpacing = 0.2;
        cues.forEach((cue, index) => {
          const at = 0.025 + index * cueSpacing;
          timeline.fromTo(
            cue,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.035, ease: "none" },
            at,
          );
          if (index < cues.length - 1) {
            timeline.to(cue, { autoAlpha: 0, y: -10, duration: 0.035, ease: "none" }, at + 0.15);
          }
        });

        if (progressBar) {
          timeline.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0);
        }
      }, section);

      ScrollTrigger.refresh();
    };

    video.addEventListener("loadedmetadata", setupScrollAnimation);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setupScrollAnimation();

    return () => {
      video.removeEventListener("loadedmetadata", setupScrollAnimation);
      context?.revert();
    };
  }, []);

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBookingMessage(
      `Thanks, ${String(form.get("name") || "there")} — your table request is ready. Connect a booking service to receive real reservations.`,
    );
    event.currentTarget.reset();
  };

  const dishes = menu[category];
  const pageBreak = Math.ceil(dishes.length / 2);

  return (
    <main>
      <header className={`site-header${hasScrolled ? " site-header--scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Balkan Foods home">
          <span className="wordmark__name">Balkan Foods</span>
          <span className="wordmark__sub">A table worth travelling for</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#story">Our story</a>
          <a href="#menu">The menu</a>
          <a href="#visit">Find us</a>
          <a className="nav-book" href="#book">Book a table <span>↗</span></a>
        </nav>
      </header>

      <section className="cinema" id="top" ref={cinemaRef} aria-label="Journey into Balkan Foods">
        <div className="cinema-stage">
        <video
          ref={videoRef}
          className="cinema__video"
          src="/videos/restaurant-entry.mp4"
          poster="/videos/restaurant-poster.webp"
          muted
          playsInline
          preload="metadata"
          aria-label="A view travelling from the restaurant entrance into the dining room and toward the menu"
        />
        <canvas ref={canvasRef} className="cinema__canvas" aria-hidden="true" />
        <div className="cinema__shade" />
        <div className="chapter chapter--arrival">
          <span className="eyebrow">Manchester · The Balkans at heart</span>
          <h1>Come in.<br /><em>Stay awhile.</em></h1>
          <p>Good food, generous tables, and evenings that take their time.</p>
        </div>
        <div className="chapter chapter--interior">
          <span className="eyebrow">A little warmth from the Balkans</span>
          <h2>Pull up a chair.</h2>
          <p>Cooked slowly. Grilled over fire. Shared with everyone.</p>
        </div>
        <div className="chapter chapter--book">
          <span className="eyebrow">The evening starts here</span>
          <h2>Take a look<br /><em>at the menu.</em></h2>
          <p>Scroll on to open our menu book.</p>
        </div>
        <div className="scroll-note"><span className="scroll-note__line" />Scroll to enter</div>
        <div className="scene-count" aria-hidden="true">01 <span /> 03</div>
        </div>
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="menu-heading">
          <span className="eyebrow">A little something for everyone</span>
          <h2 id="menu-title">The drinks menu</h2>
          <p>Wines, spirits, Albanian favourites and something for every table.</p>
        </div>
        <div className="book-wrap">
          <div className="menu-book" aria-label={`${category} menu`}>
            <div className="book-spine" aria-hidden="true" />
            <div className="book-pages">
              <MenuBookPage items={dishes.slice(0, pageBreak)} category={category} page={categories.indexOf(category) * 2 + 1} side="left" />
              <MenuBookPage items={dishes.slice(pageBreak)} category={category} page={categories.indexOf(category) * 2 + 2} side="right" />
            </div>
            <div className="book-cover" aria-hidden="true">
              <span className="cover-small">BALKAN FOODS · MANCHESTER</span>
              <span className="cover-rule" />
              <span className="cover-title">The<br /><em>Menu</em></span>
              <span className="cover-bottom">GOOD FOOD · GOOD COMPANY</span>
              <span className="cover-stamp">BF</span>
            </div>
          </div>
          <div className="menu-controls" aria-label="Menu chapters">
            {categories.map((item, index) => (
              <button key={item} type="button" className={`chapter-tab${category === item ? " is-active" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>
                <span>0{index + 1}</span>{item}
              </button>
            ))}
          </div>
          <p className="menu-note">Select a chapter to turn the pages. <a href={encodeURI("/images/Balkan Food Restaurant 278x297mm Drink Menu 21May25 2.pdf")} target="_blank" rel="noreferrer">View the original menu ↗</a></p>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-section__image"><Image src={encodeURI("/images/WhatsApp Image 2026-09-30 at 6.34.00 pm (1).jpeg")} alt="A warmly set restaurant table with a shared Balkan meal" fill priority sizes="(max-width: 760px) 86vw, 40vw" /><span>Made for<br />the middle<br />of the table</span></div>
        <div className="story-section__copy">
          <span className="eyebrow eyebrow--dark">Our table, your table</span>
          <h2>From the Balkans,<br /><em>with warmth.</em></h2>
          <p>Inspired by the generous food and long evenings of the Balkans, our kitchen brings familiar flavours to the table. Tear the bread, pass the ajvar, order another round. There’s always room for one more.</p>
          <a className="text-link" href="#menu">Open the menu <span>↓</span></a>
        </div>
      </section>

      <section className="balkan-table" aria-labelledby="balkan-table-title">
        <div className="balkan-table__heading">
          <span className="eyebrow eyebrow--dark">The Balkan table</span>
          <h2 id="balkan-table-title">Food made for<br /><em>passing around.</em></h2>
          <p>Start with something small. Order another plate for the middle. Leave room for something sweet.</p>
        </div>
        <div className="balkan-table__chapters">
          <a className="table-chapter table-chapter--fire" href="#menu" style={{ backgroundImage: `linear-gradient(0deg, #11120fe8, #11120f22 80%), url("${encodeURI("/images/WhatsApp Image 2026-09-30 at 6.33.59 pm.jpeg")}")` }}>
            <span className="table-chapter__number">01 / THE FIRE</span>
            <span className="table-chapter__title">From the grill</span>
            <span className="table-chapter__copy">Char, smoke, fresh lepinja.</span>
            <span className="table-chapter__arrow" aria-hidden="true">↗</span>
          </a>
          <a className="table-chapter table-chapter--share" href="#menu" style={{ backgroundImage: `linear-gradient(0deg, #11120fe8, #11120f22 80%), url("${encodeURI("/images/WhatsApp Image 2026-09-30 at 12.34.14 pm (1).jpeg")}")` }}>
            <span className="table-chapter__number">02 / THE TABLE</span>
            <span className="table-chapter__title">Made to share</span>
            <span className="table-chapter__copy">A little of everything, together.</span>
            <span className="table-chapter__arrow" aria-hidden="true">↗</span>
          </a>
          <a className="table-chapter table-chapter--sweet" href="#menu" style={{ backgroundImage: `linear-gradient(0deg, #11120fe8, #11120f22 80%), url("${encodeURI("/images/WhatsApp Image 2026-09-30 at 6.33.59 pm (1).jpeg")}")` }}>
            <span className="table-chapter__number">03 / THE LAST BITE</span>
            <span className="table-chapter__title">Something sweet</span>
            <span className="table-chapter__copy">One more reason to stay.</span>
            <span className="table-chapter__arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="dish-scroll" ref={dishScrollRef} aria-label="Balkan Foods dishes">
        <div className="dish-scroll__stage">
          <video
            ref={dishVideoRef}
            className="dish-scroll__video"
            src="/videos/dishes.mp4"
            muted
            playsInline
            preload="auto"
            aria-label="Restaurant dishes presented across a table"
          />
          <div className="dish-scroll__shade" aria-hidden="true" />
          <div className="dish-scroll__copy">
            <article className="dish-scroll__cue">
              <span className="dish-scroll__eyebrow">01 · From our kitchen</span>
              <h2>A table made<br />for sharing.</h2>
              <p>Generous plates, familiar flavours, and room for everyone.</p>
            </article>
            <article className="dish-scroll__cue">
              <span className="dish-scroll__eyebrow">02 · Straight from the grill</span>
              <h2>Smoky, warm,<br />made to order.</h2>
              <p>Fire-grilled favourites, served fresh to the table.</p>
            </article>
            <article className="dish-scroll__cue">
              <span className="dish-scroll__eyebrow">03 · The Balkan table</span>
              <h2>Pass a plate.<br />Stay a while.</h2>
              <p>A little of everything tastes better together.</p>
            </article>
            <article className="dish-scroll__cue">
              <span className="dish-scroll__eyebrow">04 · A sweet finish</span>
              <h2>Save room<br />for one more.</h2>
              <p>Make an evening of it, from first plate to last bite.</p>
            </article>
            <article className="dish-scroll__cue dish-scroll__cue--cta">
              <span className="dish-scroll__eyebrow">05 · Find your favourite</span>
              <h2>Explore<br />the menu.</h2>
              <a href="#menu">Open the drinks menu <span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <div className="dish-scroll__progress" aria-hidden="true"><span className="dish-scroll__progress-bar" /></div>
          <span className="dish-scroll__hint">Scroll to savour the menu</span>
        </div>
      </section>

      <section className="signature-section" aria-labelledby="signature-title">
        <div className="signature-heading">
          <div>
            <span className="eyebrow">From our kitchen</span>
            <h2 id="signature-title">The ones you<br /><em>come back for.</em></h2>
          </div>
          <a className="signature-all" href="#menu">Explore the menu <span aria-hidden="true">↗</span></a>
        </div>
        <div className="signature-rail" aria-label="Featured Balkan dishes">
          {[
            { name: "Ćevapi", detail: "Grilled beef and lamb, flatbread, kajmak, onion", price: "£19", tag: "STRAIGHT FROM THE GRILL", image: "/images/WhatsApp Image 2026-09-30 at 6.53.50 pm.jpeg", alt: "Grilled ćevapi served on a plate" },
            { name: "Mixed grill for two", detail: "Ćevapi, chicken, sausage, flatbread, sides", price: "£46", tag: "MADE FOR THE MIDDLE", image: "/images/WhatsApp Image 2026-09-30 at 12.34.14 pm.jpeg", alt: "A generous Balkan mixed grill platter" },
            { name: "Warm palačinke", detail: "Thin pancakes, chocolate, toasted hazelnut", price: "£9", tag: "SAVE ROOM FOR SWEET", image: "/images/WhatsApp Image 2026-09-30 at 6.33.59 pm (1).jpeg", alt: "A plated dessert from the restaurant" },
          ].map((dish, index) => (
            <article className="signature-card" key={dish.name}>
              <div className={`signature-card__image signature-card__image--${index + 1}`}>
                <Image className="signature-card__photo" src={encodeURI(dish.image)} alt={dish.alt} fill sizes="(max-width: 760px) 78vw, 33vw" />
                <span className="signature-card__label">{dish.tag}</span>
                <span className="signature-card__index">0{index + 1}</span>
              </div>
              <div className="signature-card__info">
                <div><h3>{dish.name}</h3><span>{dish.price}</span></div>
                <p>{dish.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="signature-hint"><span aria-hidden="true">←</span> Swipe to discover <span aria-hidden="true">→</span></p>
      </section>

      <section className="room-story" aria-labelledby="room-story-title">
        <div className="room-story__art">
          <Image src={encodeURI("/images/WhatsApp Image 2026-09-30 at 12.34.17 pm.jpeg")} alt="The restaurant dining room and bar, ready for an evening service" fill sizes="(max-width: 760px) 86vw, 40vw" />
          <span className="room-story__art-caption">A long evening<br />starts here.</span>
        </div>
        <div className="room-story__copy">
          <span className="eyebrow eyebrow--dark">Stay a little longer</span>
          <h2 id="room-story-title">A room for<br /><em>one more story.</em></h2>
          <p>Good food brings everyone in. The long conversations are what keep the evening going. Pull up a chair, pass a plate, and make yourself at home.</p>
          <a className="text-link" href="#book">Save your seat <span>↗</span></a>
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-copy">
          <span className="eyebrow">Make an evening of it</span>
          <h2>A seat at<br /><em>our table.</em></h2>
          <p>Come hungry. Leave happy. We’ll keep a place for you.</p>
          <div className="visit-details">
            <div><span>Find us</span><p>Manchester, United Kingdom<br />Exact address to be added</p></div>
            <div><span>Opening hours</span><p>Tuesday–Sunday<br />12:00–22:00 · Monday closed</p></div>
            <div><span>Call us</span><p>Phone number to be added</p></div>
            <div><span>Good to know</span><p>Walk-ins welcome · Dietary needs catered for</p></div>
          </div>
        </div>
        <form className="booking-card" id="book" onSubmit={submitBooking}>
          <span className="eyebrow eyebrow--dark">Your evening, made</span>
          <h3>Book a table</h3>
          <label>Your name<input name="name" autoComplete="name" placeholder="Name" required /></label>
          <div className="form-row">
            <label>Date<input name="date" type="date" required /></label>
            <label>Time<select name="time" defaultValue="19:00"><option>17:30</option><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option></select></label>
          </div>
          <label>Guests<select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option><option value="5">5 guests</option><option value="6+">6+ guests</option></select></label>
          <button className="gold-button" type="submit">Request a table <span>↗</span></button>
          <p className="booking-hint">Demo form — connect your reservation provider to accept bookings.</p>
          {bookingMessage && <p className="booking-message" role="status">{bookingMessage}</p>}
        </form>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#top"><span className="wordmark__name">Balkan Foods</span><span className="wordmark__sub">A table worth travelling for</span></a>
        <span>Manchester · Balkan cooking · Good company</span>
        <a href="#top">Back to the entrance ↑</a>
      </footer>
    </main>
  );
}

function MenuBookPage({ items, category, page, side }: { items: Drink[]; category: MenuCategory; page: number; side: "left" | "right" }) {
  return (
    <div className={`book-page book-page--${side}`}>
      <span className="page-kicker">{side === "left" ? "Balkan Foods · Manchester" : "From our drinks list"}</span>
      {side === "left" && <h3>{category}</h3>}
      <div className="book-menu-list">
        {items.map((item) => (
          <div className="book-menu-item" key={item.name}>
            <div className="book-menu-item__top">
              <h4>{item.name}</h4>
              <span>{item.price}</span>
            </div>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
      <span className="page-number">{String(page).padStart(2, "0")}</span>
    </div>
  );
}
