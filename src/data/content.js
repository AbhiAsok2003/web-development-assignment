const img = (n) => `${import.meta.env.BASE_URL}images/${n}.jpg`;

export const NAV_LINKS = [
  { href: "#about", label: "Story" },
  { href: "#experiences", label: "Experiences" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Guests" },
  { href: "#contact", label: "Enquire" },
];

export const MARQUEE = ["Private Pool Villas", "Ayurvedic Spa", "Farm-to-Table Dining", "Sunrise Yoga", "Private Beach", "Sunset Cruises"];

export const STATS = [
  { value: 15, suffix: "+", label: "Years of hospitality" },
  { value: 60, suffix: "", label: "Private villas" },
  { value: 4, suffix: "", label: "Signature restaurants" },
  { value: 98, suffix: "%", label: "Guest satisfaction" },
];

export const EXPERIENCES = [
  { id: "spa", points: ["Signature Abhyanga and Shirodhara therapies","Master Ayurvedic practitioners, personal dosha consultation","Couples pavilion above the water","Herbal steam, detox teas and rest lounge"], duration: "60–120 min", when: "Daily · 9 AM – 8 PM", title: "Ayurvedic Spa", tag: "Restore", img: img("spa"), text: "Herbal rituals, warm oil therapies and massages by master practitioners, in a pavilion above the water." },
  { id: "pool", points: ["Horizon-edge pool with in-water loungers","Private cabanas with butler service","Sunset cocktail hour at the swim-up bar","Heated sections and a shallow family area"], duration: "All day", when: "Daily · 7 AM – 9 PM", title: "Infinity Pool", tag: "Unwind", img: img("pool"), text: "A horizon-edge pool with in-water loungers, cabanas and a sunset cocktail hour." },
  { id: "dining", points: ["Farm-to-table coastal cuisine, seasonal menus","Chef's table and candle-lit dinners on the sand","Fresh-catch seafood grill and Kerala specialities","Curated wine and craft cocktail list"], duration: "Dinner 7 – 11 PM", when: "Reservation recommended", title: "Fine Dining", tag: "Savour", img: img("dining"), text: "Farm-to-table coastal cuisine, chef's tables on the sand and candle-lit dinners under the stars." },
  { id: "yoga", points: ["Sunrise sessions on the open-air deck","Certified teachers, all levels welcome","Breathwork and guided meditation at golden hour","Mats, props and herbal tea provided"], duration: "60 min", when: "6:00 AM & 5:30 PM", title: "Yoga & Meditation", tag: "Awaken", img: img("yoga"), text: "Sunrise sessions on the deck, guided by certified teachers, with breathwork at golden hour." },
  { id: "beach", points: ["Kayaking and stand-up paddle-boarding","Guided snorkelling over the reef","Sunset sailing on a traditional boat","Loungers, towels and beach service"], duration: "Half or full day", when: "Daily · 7 AM – 6 PM", title: "Private Beach", tag: "Explore", img: img("beach"), text: "Kayaking, paddle-boarding, snorkelling and sunset sailing, all steps from your villa." },
];

export const GALLERY = [
  { src: img("about"), alt: "Beachfront villa", cat: "Stay", size: "tall" },
  { src: img("beach"), alt: "Private beach", cat: "Outdoors", size: "" },
  { src: img("spa"), alt: "Spa pavilion", cat: "Wellness", size: "" },
  { src: img("hero"), alt: "Golden hour over the sea", cat: "Outdoors", size: "wide" },
  { src: img("dining"), alt: "Dinner under the stars", cat: "Dining", size: "" },
  { src: img("yoga"), alt: "Sunrise yoga", cat: "Wellness", size: "tall" },
  { src: img("pool"), alt: "Infinity pool", cat: "Stay", size: "" },
  { src: img("forest"), alt: "Nature trail", cat: "Outdoors", size: "wide" },
];

export const REVIEWS = [
  { quote: "The most peaceful five days of our lives. The villa, the food, the staff, everything felt effortless and deeply personal.", name: "Aanya & Rohan", role: "Honeymoon stay" },
  { quote: "I arrived exhausted and left restored. The sunrise yoga and Ayurvedic treatments are worth the trip alone.", name: "Meera Nair", role: "Wellness retreat" },
  { quote: "Our kids still talk about the kayaking and the beach bonfire. A rare place that is perfect for every age.", name: "The Thomas Family", role: "Family holiday" },
];

export const IMAGES = { hero: img("hero"), about: img("about"), beach: img("beach"), forest: img("forest"), pool: img("pool") };
