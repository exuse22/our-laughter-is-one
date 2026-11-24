

"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});



const editions = [
  {
    name: "English Edition",
    subtitle: "A message without borders",
    image: "/IMG_20261112_004141_355.jpg",
    formats: ["Printed Book", "Digital Book"],
    priceETB: 1000,
  },
  {
    name: "Amharic Edition",
    subtitle: "ለአማርኛ አንባቢዎች",
    image: "/IMG_20261112_004141_604.jpg",
    formats: ["Printed Book", "Digital Book"],
    priceETB: 1000,
  },
  {
    name: "Afaan Oromoo Edition",
    subtitle: "Afaan keenya, tokkummaa keenya",
    image: "/IMG_20261112_004141_740.jpg",
    formats: ["Printed Book", "Digital Book"],
    priceETB: 1000,
  },
  {
    name: "Combined Multilingual Edition",
    subtitle: "English • አማርኛ • Afaan Oromoo",
    image: "/IMG_20261112_004141_811.jpg",
    formats: ["Printed Book", "Digital Book"],
    priceETB: 1000,
  },
];



export default function Home() {
  const [selectedFormats, setSelectedFormats] = useState<
  Record<string, string>
>({});
const [usdRate, setUsdRate] = useState<number | null>(null);

useEffect(() => {
  let cancelled = false;

  async function getExchangeRate() {
    try {
      const response = await fetch(
        "https://open.er-api.com/v6/latest/ETB"
      );
      const data = await response.json();

      if (!cancelled && data.result === "success") {
        setUsdRate(data.rates.USD);
      }
    } catch {
      console.log("Could not update exchange rate.");
    }
  }

  getExchangeRate();

  return () => {
    cancelled = true;
  };
}, []);
  return (
    <main className="min-h-screen overflow-hidden bg-[#090806] text-[#f7edda]">
     <header className="sticky top-0 z-50 border-b border-[#c99b42]/60 bg-[#090806]/95 backdrop-blur-xl">
  <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
    <a href="#home" className="font-[var(--font-cormorant)] text-lg font-bold tracking-widest text-[#e8bd65] sm:text-2xl">
      OUR LAUGHTER IS ONE
    </a>

    <nav className="hidden gap-7 text-xs tracking-widest md:flex">
      <a href="#home" className="text-[#e8bd65]">HOME</a>
      <a href="#story" className="hover:text-[#e8bd65]">OUR STORY</a>
      <a href="#book" className="hover:text-[#e8bd65]">THE BOOK</a>
      <a href="#editions" className="hover:text-[#e8bd65]">EDITIONS</a>
      <a href="#contact" className="hover:text-[#e8bd65]">CONTACT</a>
    </nav>

    <a href="#editions" className="inline-flex rounded-full border border-[#c99b42] px-4 py-2 text-xs text-[#e8bd65] hover:bg-[#c99b42] hover:text-black">
      SHOP
    </a>

    <details className="relative md:hidden">
      <summary className="cursor-pointer list-none text-2xl text-[#e8bd65]">
        ☰
      </summary>

      <nav className="absolute right-0 top-10 z-50 w-56 border border-[#c99b42]/60 bg-[#090806] p-5 shadow-xl">
        <div className="flex flex-col gap-5 text-xs tracking-widest text-[#e8bd65]">
          <a href="#home">HOME</a>
          <a href="#story">OUR STORY</a>
          <a href="#book">THE BOOK</a>
          <a href="#editions">EDITIONS</a>
          <a href="#contact">CONTACT</a>
          <a href="#editions">SHOP</a>
        </div>
      </nav>
    </details>
  </div>
</header>

      <section id="home" className="relative isolate min-h-[720px]">
        <div
         className="absolute inset-0 -z-20 bg-contain bg-no-repeat bg-center sm:bg-contain"
          style={{
            backgroundImage: 'url("/IMG_20261111_214536_767.jpg")',
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080706]/90 via-[#080706]/55 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-black/10" />

<div className="mx-auto flex min-h-[720px] max-w-7xl items-center px-6 py-20">
  <div className="max-w-xl text-center md:text-left">

    <p className="text-xs tracking-[0.35em] text-[#e6bd70]">
      A BOOK. A MESSAGE. A SHARED HUMANITY.
    </p>

 
<h1
  className={`${cormorant.className} mt-7 text-5xl font-light leading-[1.08] tracking-tight sm:text-7xl lg:text-8xl`}
>
  <span className="block text-[#f2dfbd]">Different</span>
  <span className="block text-[#f2dfbd]">Languages.</span>
  <span className="block text-[#f2dfbd]">One</span>
  <span className="block italic font-medium text-[#d9ad5c]">
    Laughter.
  </span>
</h1>


    <p className="mx-auto mt-8 max-w-lg text-sm leading-8 text-[#d0c2ac] md:mx-0">
      A celebration of humanity, connection and the beautiful truth
      that brings us together — no matter which language we speak.
    </p>

    <div className="mt-9 flex flex-wrap justify-center gap-4 md:justify-start">
      <a href="#book" className="rounded-full border border-[#f2c66b] bg-gradient-to-b from-[#ffdc8b] to-[#b77b20] px-7 py-4 text-xs font-bold tracking-widest text-[#211406] shadow-[0_0_30px_rgba(226,166,63,0.35)] transition hover:scale-105">
        EXPLORE THE BOOK →
      </a>

      <a href="#story" className="rounded-full border border-[#d4a747] px-7 py-4 text-xs tracking-widest text-[#f3d38e] transition hover:bg-[#d4a747] hover:text-black">
        OUR STORY →
      </a>
    </div>

    <p className="mt-10 text-xs tracking-[0.4em] text-[#e8bd65]">
      READ • SMILE • BE UNITED
    </p>

  </div>
</div>
        <div className="border-y border-[#bd9145]/40 bg-[#0b0906]/90">
          <div className="mx-auto grid max-w-7xl gap-5 px-6 py-7 text-center sm:grid-cols-3">
            <div className="text-sm tracking-widest text-[#e8bd65]">✧ MULTILINGUAL EDITION</div>
            <div className="border-y border-[#bd9145]/30 py-4 text-sm tracking-widest text-[#e8bd65] sm:border-x sm:border-y-0 sm:py-0">✧ A MESSAGE WITHOUT BORDERS</div>
            <div className="text-sm tracking-widest text-[#e8bd65]">✧ FOR A UNITED WORLD</div>
          </div>
        </div>
      </section>

     
<section
  id="story"
  className="relative mx-auto max-w-6xl overflow-hidden px-6 py-28 text-center"
>
  <div className="absolute inset-5 border border-[#c99b42]/20 pointer-events-none" />

  <p className="text-xs tracking-[0.5em] text-[#d9ad5c]">
    OUR PURPOSE
  </p>

  <div className="mx-auto mt-8 h-px w-16 bg-[#d9ad5c]/70" />

  <h2 className="mt-8 font-[var(--font-cormorant)] text-6xl font-light tracking-wide text-[#f2dfbd] sm:text-7xl">
    ሳቃችን አንድ ነው
  </h2>

  <p className="mx-auto mt-9 max-w-3xl text-sm leading-9 tracking-wide text-[#c9bdab] sm:text-base sm:leading-10">
    OUR LAUGHTER IS ONE is more than a book. It is an invitation to
    understand one another, celebrate our differences and discover
    the humanity we share.
  </p>

  <div className="mx-auto mt-12 h-px w-24 bg-gradient-to-r from-transparent via-[#d9ad5c] to-transparent" />
</section>

<section 
  id="book"
  className="border-y border-[#bd9145]/40 bg-gradient-to-b from-[#171108] via-[#100d09] to-[#090806] px-6 py-24"
>
  <div className="mx-auto max-w-6xl">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs tracking-[0.4em] text-[#d9ad5c]">
        THE ONE LAUGHTER IMPACT MISSION
      </p>

      <h2 className="mt-6 font-[var(--font-cormorant)] text-4xl leading-tight text-[#f2dfbd] sm:text-6xl">
        FROM LAUGHTER TO LASTING WEALTH
      </h2>

      <div className="mx-auto mt-8 h-px w-24 bg-[#d9ad5c]" />

      <p className="mt-8 text-lg leading-8 text-[#e8dcc8]">
        Every Book Creates an Opportunity. Every Contribution Builds a Better Future.
      </p>

      <p className="mt-5 text-sm leading-8 text-[#bfb19d]">
        OUR LAUGHTER IS ONE is more than a message of shared humanity.
        It is an opportunity to turn the power of laughter, books and
        collective action into lasting social and economic impact.
      </p>
    </div>

    <div className="mt-20 text-center">
      <p className="text-xs tracking-[0.35em] text-[#d9ad5c]">
        THREE PROGRAMS. ONE SHARED MISSION.
      </p>

      <h3 className="mt-4 font-[var(--font-cormorant)] text-3xl text-[#f2dfbd] sm:text-4xl">
        Building Opportunities for Generations
      </h3>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-3">
      <div className="border border-[#bd9145]/30 bg-[#171108]/70 p-8">
        <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">01</p>
        <h4 className="mt-5 font-[var(--font-cormorant)] text-3xl text-[#f2dfbd]">
          Stocks for Children
        </h4>
        <p className="mt-5 text-sm leading-8 text-[#bfb19d]">
          Helping children take their first steps toward financial
          knowledge and long-term opportunity through investment
          accounts and carefully selected shares, subject to
          applicable laws and safeguards.
        </p>
      </div>

      <div className="border border-[#bd9145]/30 bg-[#171108]/70 p-8">
        <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">02</p>
        <h4 className="mt-5 font-[var(--font-cormorant)] text-3xl text-[#f2dfbd]">
          Renter to Homeowner
        </h4>
        <p className="mt-5 text-sm leading-8 text-[#bfb19d]">
          Creating practical pathways and seed-fund opportunities
          that help renters work toward homeownership, build equity
          and strengthen their financial security.
        </p>
      </div>

      <div className="border border-[#bd9145]/30 bg-[#171108]/70 p-8">
        <p className="text-xs tracking-[0.3em] text-[#d9ad5c]">03</p>
        <h4 className="mt-5 font-[var(--font-cormorant)] text-3xl text-[#f2dfbd]">
          Playground Prototype Development
        </h4>
        <p className="mt-5 text-sm leading-8 text-[#bfb19d]">
          Developing scalable playground models using locally
          manufactured materials to encourage safe recreation,
          cooperation, communication and peaceful communities.
        </p>
      </div>
    </div>

    <div className="mx-auto mt-20 max-w-3xl border-y border-[#bd9145]/30 py-12 text-center">
      <p className="text-xs tracking-[0.35em] text-[#d9ad5c]">
        BE PART OF THE MOVEMENT
      </p>

      <h3 className="mt-5 font-[var(--font-cormorant)] text-3xl text-[#f2dfbd] sm:text-4xl">
        Every Contribution Can Create an Opportunity.
      </h3>

      <p className="mt-6 text-sm leading-8 text-[#bfb19d]">
        Participate by buying the book, investing in the programs,
        or contributing your knowledge, professional services,
        materials, partnerships or other resources.
      </p>

      <p className="mt-8 text-xs leading-7 tracking-widest text-[#d9ad5c]">
        READ • SMILE • BE UNITED
      </p>
    </div>

    <div className="mt-12 text-center">
      <h3 className="font-[var(--font-cormorant)] text-2xl text-[#f2dfbd]">
        Our Promise
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-[#bfb19d]">
        We are committed to transparency, responsible stewardship
        and sharing progress as these programs develop.
      </p>
    </div>
  </div>
</section>
     <section
  id="editions"
  className="bg-[#0b0906] px-6 py-24"
>
  <div className="mx-auto max-w-7xl">
    <div className="text-center">
      <p className="text-xs tracking-[0.4em] text-[#d9ad5c]">
        THE COLLECTION
      </p>

      <h2 className="mt-5 font-[var(--font-cormorant)] text-5xl text-[#f2dfbd] sm:text-6xl">
        Discover Your Edition
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#bfb19d]">
        One message. Different languages. One shared humanity.
      </p>
    </div>

  <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
     
{editions.map((edition) => (
  <div key={edition.name} className="group text-center">

    <div className="relative mx-auto w-full max-w-[240px] rounded-sm bg-gradient-to-br from-[#c6a15e] via-[#7c5724] to-[#e2c17c] p-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition duration-500 group-hover:-translate-y-3">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#171108]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${edition.image}")`,
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>

    <p className="mt-8 text-sm leading-7 tracking-wide text-[#bfb19d]">
      {edition.subtitle}
    </p>

    <div className="mt-6 flex flex-col gap-3">
     {(edition.formats ?? ["Printed Book", "Digital Book"]).map((format) => (
        <button
          key={format}
          type="button"
          onClick={() =>
            setSelectedFormats((previous) => ({
              ...previous,
              [edition.name]: format,
            }))
          }
          className={`rounded-full border px-4 py-3 text-xs tracking-widest transition ${
            selectedFormats[edition.name] === format
              ? "border-[#e8bd65] bg-[#c99b42] text-black"
              : "border-[#bd9145]/60 text-[#e8bd65] hover:bg-[#c99b42]/20"
          }`}
        >
          {format.toUpperCase()}
        </button>
      ))}
    </div>

    {selectedFormats[edition.name] && (
      <p className="mt-4 text-xs text-[#d9ad5c]">
        Selected: {selectedFormats[edition.name]}
      </p>
    )}
<p className="mt-4 text-sm text-[#f2dfbd]">
  {edition.priceETB.toLocaleString()} ETB
</p>

<p className="mt-1 text-xs text-[#bfb19d]">
  {usdRate !== null
    ? `Approximately $${(edition.priceETB * usdRate).toFixed(2)} USD`
    : "Updating USD price..."}
</p>
<button
  type="button"
  disabled={!selectedFormats[edition.name]}
  onClick={() => {
    window.location.href = `/checkout?edition=${encodeURIComponent(
      edition.name
    )}&format=${encodeURIComponent(
      selectedFormats[edition.name]
    )}&price=${edition.priceETB}`;
  }}
  className="mt-5 w-full rounded-full bg-[#c99b42] px-5 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-[#e8bd65] disabled:cursor-not-allowed disabled:opacity-40"
>
  BUY NOW
</button>
  </div>
))}

    </div>

    <div className="mt-20 text-center">
      <div className="mx-auto h-px w-24 bg-[#d9ad5c]" />

      <p className="mt-8 font-[var(--font-cormorant)] text-2xl text-[#f2dfbd]">
        READ • SMILE • BE UNITED
      </p>
    </div>
  </div>
</section>

      <section className="px-6 py-24 text-center">
        <p className="text-xs tracking-[0.4em] text-[#d9ad5c]">OUR BELIEF</p>
        <h2 className="mx-auto mt-6 max-w-4xl font-[var(--font-cormorant)] text-4xl leading-tight sm:text-6xl">
          Our languages may be different.
          <span className="block italic text-[#e9b94f]">Our humanity is shared.</span>
        </h2>
      </section>

      
<footer
  id="contact"
  className="border-t border-[#bd9145]/40 bg-[#080705] px-6 py-16"
>
  <div className="mx-auto grid max-w-7xl gap-12 text-center md:grid-cols-3 md:text-left">

    {/* Brand */}
    <div>
      <h3 className="font-[var(--font-cormorant)] text-3xl tracking-widest text-[#e8bd65]">
        OUR LAUGHTER IS ONE
      </h3>
      <p className="mt-4 text-sm leading-8 text-[#bfb29d]">
        Different languages. One humanity. One shared laughter.
      </p>
      <p className="mt-5 text-xs tracking-[0.3em] text-[#d9ad5c]">
        READ • SMILE • BE UNITED
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-xs tracking-[0.3em] text-[#d9ad5c]">
        QUICK LINKS
      </h4>
      <div className="mt-6 flex flex-col gap-4 text-sm text-[#bfb29d]">
        <a href="#home" className="hover:text-[#e8bd65]">Home</a>
        <a href="#story" className="hover:text-[#e8bd65]">Our Story</a>
        <a href="#book" className="hover:text-[#e8bd65]">The Book</a>
        <a href="#editions" className="hover:text-[#e8bd65]">Editions</a>
      </div>
    </div>

    {/* Contact */}
    <div>
      <h4 className="text-xs tracking-[0.3em] text-[#d9ad5c]">
        CONNECT WITH US
      </h4>
      <p className="mt-6 text-sm text-[#bfb29d]">
        Email: Coming Soon
      </p>
      <p className="mt-4 text-sm text-[#bfb29d]">
        Instagram • TikTok • Facebook
      </p>
    </div>

  </div>

  <div className="mx-auto mt-16 max-w-7xl border-t border-[#bd9145]/20 pt-8 text-center">
    <p className="text-xs text-[#82745e]">
      © 2026 OUR LAUGHTER IS ONE. All rights reserved.
    </p>
  </div>
</footer>

    </main>
  );
}
