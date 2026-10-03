"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
    const mobileScrub = window.matchMedia("(max-width: 760px)").matches;
    let context: gsap.Context | undefined;
    let initialized = false;
    let latestProgress = 0;
    let duration = 0;
    let mobileSeekPending = false;
    let nativeScrollHandler: (() => void) | undefined;
    let nativeScrollFrame = 0;

    const seekVideo = (progress: number) => {
      if (!duration) return;
      const targetTime = progress * duration;
      if (mobileScrub && (mobileSeekPending || video.seeking)) return;
      if (Math.abs(video.currentTime - targetTime) < 0.025) return;
      if (mobileScrub) mobileSeekPending = true;
      try {
        video.currentTime = targetTime;
      } catch {
        mobileSeekPending = false;
      }
    };

    const updateScene = (progress: number) => {
      const clamped = Math.max(0, Math.min(1, progress));
      latestProgress = clamped;
      seekVideo(clamped);
      const activeCue = Math.min(cues.length - 1, Math.floor(clamped * cues.length));
      cues.forEach((cue, index) => cue.classList.toggle("is-active", index === activeCue));
      if (progressBar) progressBar.style.transform = `scaleX(${clamped})`;
    };

    const onSeeked = () => {
      mobileSeekPending = false;
      if (mobileScrub && duration && Math.abs(video.currentTime - latestProgress * duration) > 0.05) {
        requestAnimationFrame(() => seekVideo(latestProgress));
      }
    };

    const onMetadata = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      duration = video.duration;
      updateScene(latestProgress);
    };

    const setupScrollAnimation = () => {
      if (initialized) return;
      initialized = true;
      video.addEventListener("seeked", onSeeked);
      video.addEventListener("loadedmetadata", onMetadata);
      onMetadata();

      if (mobileScrub) {
        nativeScrollHandler = () => {
          if (nativeScrollFrame) return;
          nativeScrollFrame = requestAnimationFrame(() => {
            nativeScrollFrame = 0;
            const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
            updateScene(-section.getBoundingClientRect().top / scrollRange);
          });
        };
        window.addEventListener("scroll", nativeScrollHandler, { passive: true });
        window.addEventListener("resize", nativeScrollHandler, { passive: true });
        nativeScrollHandler();
      } else {
        context = gsap.context(() => {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            invalidateOnRefresh: true,
            onUpdate: (self) => updateScene(self.progress),
            onRefresh: (self) => updateScene(self.progress),
          });
        }, section);
        ScrollTrigger.refresh();
      }
    };

    setupScrollAnimation();
    video.addEventListener("loadedmetadata", onMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("seeked", onSeeked);
      if (nativeScrollHandler) {
        window.removeEventListener("scroll", nativeScrollHandler);
        window.removeEventListener("resize", nativeScrollHandler);
      }
      if (nativeScrollFrame) cancelAnimationFrame(nativeScrollFrame);
      context?.revert();
    };
  }, []);

  const menuColumns = [categories.slice(0, 4), categories.slice(4)];
  const categoryId = (item: MenuCategory) => `menu-${item.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <main>
      <header className={`site-header${hasScrolled ? " site-header--scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="E.D Ballkan Food home">
          <Image
            src="/images/ed-ballkan-food-logo.svg"
            alt=""
            width={48}
            height={52}
            className="wordmark__logo"
            priority
          />
          <Image
            src="/images/ed-ballkan-food-black-sign.svg"
            alt=""
            width={44}
            height={44}
            className="wordmark__logo wordmark__logo--red"
            priority
          />
          <span className="wordmark__copy">
            <span className="wordmark__name">E.D Ballkan Food</span>
            <span className="wordmark__sub">Albanian restaurant · Sheffield</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#story">Our story</a>
          <a href="#menu">The menu</a>
          <a href="#visit">Find us</a>
          <a className="nav-book" href="tel:01146989760">Call us <span>↗</span></a>
        </nav>
      </header>

      <section className="cinema" id="top" ref={cinemaRef} aria-label="Enter E.D Ballkan Food">
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
          <h1>Come in.<br /><em>Stay awhile.</em></h1>
          <p>Albanian cooking and a warm welcome on Abbeydale Road.</p>
        </div>
        <div className="chapter chapter--interior">
          <h2>Pull up a chair.</h2>
          <p>Take a seat at E.D Ballkan Food in Sheffield.</p>
        </div>
        <div className="chapter chapter--book">
          <h2>Take a look<br /><em>at the menu.</em></h2>
          <p>Scroll on to open our menu book.</p>
        </div>
        <div className="scroll-note"><span className="scroll-note__line" />Scroll to enter</div>
        <div className="scene-count" aria-hidden="true">01 <span /> 03</div>
        </div>
      </section>

      <section className="menu-section menu-section--complete" id="menu" aria-labelledby="menu-title">
        <div className="menu-heading">
          <h2 id="menu-title">The drinks menu</h2>
          <p>Every category and listed item, together in one menu book.</p>
        </div>
        <nav className="menu-index" aria-label="Jump to a drinks category">
          {categories.map((item) => (
            <a key={item} href={`#${categoryId(item)}`}>{item}<span>↓</span></a>
          ))}
        </nav>
        <div className="full-menu-book">
          <div className="full-menu-book__top">
            <span>E.D BALLKAN FOOD · SHEFFIELD</span>
            <span>DRINKS</span>
          </div>
          <div className="full-menu-pages">
            {menuColumns.map((column, columnIndex) => (
              <div className="full-menu-page" key={columnIndex}>
                {column.map((item) => (
                  <section className="full-menu-category" id={categoryId(item)} key={item} aria-labelledby={`${categoryId(item)}-title`}>
                    <h3 id={`${categoryId(item)}-title`}>{item}</h3>
                    <div className="full-menu-list">
                      {menu[item].map((drink) => (
                        <article className="full-menu-row" key={drink.name}>
                          <div className="full-menu-row__top">
                            <h4>{drink.name}</h4>
                            <span>{drink.price}</span>
                          </div>
                          <p>{drink.detail}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
                <span className="full-menu-page__number">0{columnIndex + 1}</span>
              </div>
            ))}
          </div>
          <div className="full-menu-book__bottom">
            <span>DRINKS MENU</span>
            <a href={encodeURI("/images/Balkan Food Restaurant 278x297mm Drink Menu 21May25 2.pdf")} target="_blank" rel="noreferrer">Open original menu ↗</a>
          </div>
        </div>
        <p className="menu-note">This section shows the drinks menu supplied by the restaurant.</p>
      </section>

      <section className="story-section" id="story">
        <div className="story-section__image"><Image src={encodeURI("/images/WhatsApp Image 2026-09-30 at 6.34.00 pm (1).jpeg")} alt="A warmly set restaurant table with a shared Balkan meal" fill priority sizes="(max-width: 760px) 86vw, 40vw" /><span>Made for<br />the middle<br />of the table</span></div>
        <div className="story-section__copy">
          <h2>Albanian cooking,<br /><em>made to share.</em></h2>
          <p>E.D Ballkan Food is an Albanian restaurant on Abbeydale Road. Come for familiar flavours, choose something from the menu, and make an evening of it around the table.</p>
          <a className="text-link" href="#menu">Open the menu <span>↓</span></a>
        </div>
      </section>

      <section className="balkan-table" aria-labelledby="balkan-table-title">
        <div className="balkan-table__heading">
          <h2 id="balkan-table-title">A closer look<br /><em>at the table.</em></h2>
          <p>Food and restaurant photographs from E.D Ballkan Food in Sheffield.</p>
        </div>
        <div className="balkan-table__chapters food-photo-grid">
          {[
            ["WhatsApp Image 2026-09-30 at 6.33.59 pm (2).jpeg", "A dish served at E.D Ballkan Food"],
            ["WhatsApp Image 2026-09-30 at 6.34.00 pm (2).jpeg", "Food from the E.D Ballkan Food kitchen"],
            ["WhatsApp Image 2026-09-30 at 6.53.49 pm.jpeg", "A close view of a restaurant dish"],
            ["WhatsApp Image 2026-09-30 at 6.53.50 pm (2).jpeg", "A plate served at the restaurant"],
            ["WhatsApp Image 2026-09-30 at 7.33.22 pm (1).jpeg", "Food served at E.D Ballkan Food"],
            ["WhatsApp Image 2026-09-30 at 7.33.23 pm.jpeg", "A dish from the restaurant menu"],
          ].map(([file, alt], index) => (
            <figure className="food-photo" key={file}>
              <Image src={encodeURI(`/images/${file}`)} alt={alt} fill sizes="(max-width: 760px) 72vw, 31vw" />
              <figcaption>0{index + 1}</figcaption>
            </figure>
          ))}
        </div>

      </section>

      <section className="dish-scroll" ref={dishScrollRef} aria-label="Food at E.D Ballkan Food">
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
              <h2>The Albanian<br />table.</h2>
              <p>A look at the food and the place on Abbeydale Road.</p>
            </article>
            <article className="dish-scroll__cue">
              <h2>A closer look<br />at the table.</h2>
              <p>See the dishes and restaurant through our photographs.</p>
            </article>
            <article className="dish-scroll__cue">
              <h2>Good food.<br />Good company.</h2>
              <p>Find us on Abbeydale Road, Sheffield.</p>
            </article>
            <article className="dish-scroll__cue">
              <h2>Visit us<br />in Sheffield.</h2>
              <p>Call us for enquiries and current opening times.</p>
            </article>
            <article className="dish-scroll__cue dish-scroll__cue--cta">
              <h2>Browse<br />the drinks list.</h2>
              <a href="#menu">See the drinks menu <span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <div className="dish-scroll__progress" aria-hidden="true"><span className="dish-scroll__progress-bar" /></div>
          <span className="dish-scroll__hint">Scroll through the food</span>
        </div>
      </section>

      <section className="signature-section" aria-labelledby="signature-title">
        <div className="signature-heading">
          <div>
            <h2 id="signature-title">From our<br /><em>restaurant.</em></h2>
          </div>
          <a className="signature-all" href="#menu">View the drinks list <span aria-hidden="true">↗</span></a>
        </div>
        <div className="signature-rail restaurant-photo-rail" aria-label="More restaurant photographs">
          {[
            ["WhatsApp Image 2026-09-30 at 6.53.50 pm (1).jpeg", "A dish from E.D Ballkan Food"],
            ["WhatsApp Image 2026-09-30 at 6.53.54 pm.jpeg", "Food served at E.D Ballkan Food"],
            ["WhatsApp Image 2026-09-30 at 7.33.26 pm.jpeg", "A plate from the restaurant"],
          ].map(([file, alt], index) => (
            <figure className="restaurant-photo-card" key={file}>
              <div className="restaurant-photo-card__image"><Image src={encodeURI(`/images/${file}`)} alt={alt} fill sizes="(max-width: 760px) 80vw, 33vw" /></div>
              <figcaption>Sheffield · Abbeydale Road <span>0{index + 1}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="room-story" aria-labelledby="room-story-title">
        <div className="room-story__art">
          <Image src={encodeURI("/images/WhatsApp Image 2026-09-30 at 12.34.17 pm.jpeg")} alt="The restaurant dining room and bar, ready for an evening service" fill sizes="(max-width: 760px) 86vw, 40vw" />
          <span className="room-story__art-caption">A long evening<br />starts here.</span>
        </div>
        <div className="room-story__copy">
          <h2 id="room-story-title">A place to<br /><em>sit and eat.</em></h2>
          <p>Find E.D Ballkan Food at 233 Abbeydale Road. Call ahead for current opening times or to ask about your visit.</p>
          <a className="text-link" href="tel:01146989760">Call 0114 698 9760 <span>↗</span></a>
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-copy">
          <h2>Find us on<br /><em>Abbeydale Road.</em></h2>
          <p>E.D Ballkan Food · Albanian restaurant in Sheffield</p>
          <div className="visit-details">
            <div><span>Address</span><p>233 Abbeydale Road<br />Sheffield, S7 1FJ</p></div>
            <div><span>Telephone</span><p><a href="tel:01146989760">0114 698 9760</a></p></div>
            <div><span>Opening times</span><p>Call the restaurant for current hours.</p></div>
            <div><span>Follow along</span><p><a href="https://www.instagram.com/e.d_ballkan_food/" target="_blank" rel="noreferrer">Instagram ↗</a></p></div>
          </div>
        </div>
        <div className="visit-actions">
          <a className="gold-button" href="https://www.google.com/maps/search/?api=1&query=E.D+Ballkan+Food%2C+233+Abbeydale+Road%2C+Sheffield%2C+S7+1FJ" target="_blank" rel="noreferrer">Get directions <span>↗</span></a>
          <a className="visit-call" href="tel:01146989760">Call 0114 698 9760</a>
        </div>
      </section>
      <footer className="site-footer">
        <div className="footer-main">
          <a className="wordmark" href="#top" aria-label="E.D Ballkan Food home"><span className="wordmark__name">E.D Ballkan Food</span><span className="wordmark__sub">Albanian restaurant · Sheffield</span></a>
          <p className="footer-line">A table in Sheffield.<br />233 Abbeydale Road, S7 1FJ</p>
          <div className="footer-links">
            <a href="#menu">Drinks menu</a>
            <a href="https://www.google.com/maps/search/?api=1&query=E.D+Ballkan+Food%2C+233+Abbeydale+Road%2C+Sheffield%2C+S7+1FJ" target="_blank" rel="noreferrer">Directions ↗</a>
            <a href="https://www.instagram.com/e.d_ballkan_food/" target="_blank" rel="noreferrer">Instagram ↗</a>
            <a href="tel:01146989760">Call the restaurant ↗</a>
          </div>
        </div>
        <div className="footer-bottom"><span>© E.D Ballkan Food</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}

