"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MenuCategory = "To Begin" | "From the Grill" | "Balkan Classics" | "Sweet Things";
type Dish = { name: string; detail: string; price: string };

const menu: Record<MenuCategory, Dish[]> = {
  "To Begin": [
    { name: "Warm lepinja", detail: "House bread, ajvar, whipped kajmak", price: "£6" },
    { name: "Shopska salad", detail: "Tomato, cucumber, peppers, grated sirene", price: "£9" },
    { name: "Balkan mezze", detail: "Ajvar, olives, sirene, pickled vegetables", price: "£13" },
    { name: "Crispy filo parcels", detail: "Spinach, herbs, yoghurt dip", price: "£10" },
  ],
  "From the Grill": [
    { name: "Ćevapi", detail: "Grilled beef and lamb, flatbread, kajmak, onion", price: "£19" },
    { name: "Pljeskavica", detail: "Balkan-style grilled patty, ajvar, fries", price: "£21" },
    { name: "Mixed grill for two", detail: "Ćevapi, chicken, sausage, flatbread, sides", price: "£46" },
    { name: "Grilled chicken skewers", detail: "Marinated chicken, lemon, herb salad", price: "£18" },
  ],
  "Balkan Classics": [
    { name: "Sarma", detail: "Slow-cooked cabbage rolls, rice, smoked paprika", price: "£18" },
    { name: "Burek", detail: "Flaky pastry, spiced beef, cultured yoghurt", price: "£16" },
    { name: "Stuffed peppers", detail: "Rice, herbs, tomato, seasonal greens", price: "£17" },
    { name: "Slow-braised lamb", detail: "Root vegetables, rosemary, pan juices", price: "£25" },
  ],
  "Sweet Things": [
    { name: "Baklava", detail: "Walnut, honey, orange blossom", price: "£8" },
    { name: "Tufahija", detail: "Poached apple, walnut, vanilla cream", price: "£8" },
    { name: "Warm palačinke", detail: "Thin pancakes, chocolate, toasted hazelnut", price: "£9" },
    { name: "Seasonal sorbet", detail: "Three scoops, changing with the season", price: "£7" },
  ],
};

const categories = Object.keys(menu) as MenuCategory[];

export default function RestaurantExperience() {
  const cinemaRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [category, setCategory] = useState<MenuCategory>("To Begin");
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

    let context: gsap.Context | undefined;
    let disposed = false;
    let mobileStoryActive = false;
    let videoTweenAdded = false;
    let desktopVideoReadyHandler: (() => void) | undefined;
    const isMobile = window.matchMedia("(max-width: 699px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const startMobileVideo = () => {
      if (disposed || !isMobile || !mobileStoryActive || !video.paused) return;
      // Muted inline playback is started by the user's scroll gesture. Mobile
      // browsers may defer downloading video until this point.
      void video.play().catch(() => {});
    };

    const onCanPlay = () => startMobileVideo();

    context = gsap.context(() => {
      gsap.set(".chapter--interior, .chapter--book", { autoAlpha: 0, y: 22 });
      gsap.set(".book-cover", { rotationY: 0 });

      const story = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => (isMobile ? "+=1900" : "+=3200"),
          scrub: isMobile ? true : 0.45,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => {
            mobileStoryActive = true;
            startMobileVideo();
          },
          onEnterBack: () => {
            mobileStoryActive = true;
            if (isMobile && video.ended) video.currentTime = 0;
            startMobileVideo();
          },
          onLeave: () => {
            mobileStoryActive = false;
            if (isMobile) video.pause();
          },
          onLeaveBack: () => {
            mobileStoryActive = false;
            if (isMobile) video.pause();
          },
        },
      });

      if (isMobile) {
        // Keep a visible scroll response even if a mobile browser delays or blocks
        // video playback; this also makes the poster act as a moving camera shot.
        story.fromTo(
          video,
          { scale: 1, yPercent: 0, transformOrigin: "50% 54%" },
          { scale: 1.13, yPercent: -1.5, duration: 1, ease: "none" },
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
      } else {
        video.addEventListener("canplay", onCanPlay);
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
        scrollTrigger: {
          trigger: "#menu",
          start: "top top",
          end: () => (isMobile ? "+=700" : "+=1200"),
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
    }, section);

    ScrollTrigger.refresh();

    return () => {
      disposed = true;
      mobileStoryActive = false;
      // GSAP context reverts the animation; detach the video readiness listener too.
      if (desktopVideoReadyHandler) {
        video.removeEventListener("loadedmetadata", desktopVideoReadyHandler);
      }
      video.removeEventListener("canplay", onCanPlay);
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
  const half = Math.ceil(dishes.length / 2);

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
        <video
          ref={videoRef}
          className="cinema__video"
          src="/videos/restaurant-entry.mp4"
          poster="/videos/restaurant-poster.webp"
          muted
          playsInline
          preload="auto"
          aria-label="A view travelling from the restaurant entrance into the dining room and toward the menu"
        />
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
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="menu-heading">
          <span className="eyebrow">A little something for everyone</span>
          <h2 id="menu-title">The menu book</h2>
          <p>Scroll to open it. Choose a chapter to browse the menu.</p>
        </div>
        <div className="book-wrap">
          <div className="menu-book" aria-label={`${category} menu`}>
            <div className="book-spine" aria-hidden="true" />
            <div className="book-pages">
              <div className="book-page book-page--left">
                <span className="page-kicker">Balkan Foods · Manchester</span>
                <h3>{category}</h3>
                <div className="dish-list">
                  {dishes.slice(0, half).map((dish) => <DishRow key={dish.name} dish={dish} />)}
                </div>
                <span className="page-number">{String(categories.indexOf(category) * 2 + 1).padStart(2, "0")}</span>
              </div>
              <div className="book-page book-page--right">
                <span className="page-kicker">Cooked with care · Shared with love</span>
                <div className="dish-list dish-list--right">
                  {dishes.slice(half).map((dish) => <DishRow key={dish.name} dish={dish} />)}
                </div>
                <div className="page-bottom-note">Ask us about today’s specials<br />and our selection of Balkan wines.</div>
                <span className="page-number">{String(categories.indexOf(category) * 2 + 2).padStart(2, "0")}</span>
              </div>
            </div>
            <div className="book-cover" aria-hidden="true">
              <span className="cover-small">BALKAN FOODS</span>
              <span className="cover-rule" />
              <span className="cover-title">The<br /><em>Menu</em></span>
              <span className="cover-bottom">GOOD FOOD · GOOD COMPANY</span>
              <span className="cover-stamp">BF</span>
            </div>
          </div>
          <div className="menu-controls" aria-label="Menu chapters">
            {categories.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`chapter-tab${category === item ? " is-active" : ""}`}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                <span>0{index + 1}</span>{item}
              </button>
            ))}
          </div>
          <p className="menu-note">Sample menu and prices for the website demo. Replace these with the restaurant’s confirmed menu.</p>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-section__image" aria-hidden="true"><span>Made for<br />the middle<br />of the table</span></div>
        <div className="story-section__copy">
          <span className="eyebrow eyebrow--dark">Our table, your table</span>
          <h2>From the Balkans,<br /><em>with warmth.</em></h2>
          <p>Inspired by the generous food and long evenings of the Balkans, our kitchen brings familiar flavours to the table. Tear the bread, pass the ajvar, order another round. There’s always room for one more.</p>
          <a className="text-link" href="#menu">Open the menu <span>↓</span></a>
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

function DishRow({ dish }: { dish: Dish }) {
  return (
    <article className="dish-row">
      <div className="dish-row__heading"><h4>{dish.name}</h4><span>{dish.price}</span></div>
      <p>{dish.detail}</p>
    </article>
  );
}
