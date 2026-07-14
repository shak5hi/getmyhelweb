"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeaderV2 from "@/components/HeaderV2";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "Are GetMyHelp workers background verified?", a: "Yes. Every helper goes through a government ID check, address verification, and reference check before they are onboarded to any society." },
  { q: "What if my helper doesn't show up?", a: "We dispatch a backup helper within hours. You will never be left without support." },
  { q: "How are rates decided for my society?", a: "Rates are set society-wide, based on flat size and work type. Your RWA approves them once — and they apply to every resident." },
  { q: "Who pays the helper?", a: "We do. GetMyHelp employs the helpers directly, pays monthly salaries, and manages attendance. You pay us once a month via invoice." },
  { q: "Can I add or remove services?", a: "Absolutely. You can adjust services, timing, or helper assignments at any time through the society dashboard." },
];

const servicesData = [
  {
    label: "Daily Maid",
    img: "/DailyMaid.png",
    desc: "Professional daily maid services tailored for society homes. Keep your living spaces spotless, dust-free, and tidy with scheduled daily visits.",
    included: [
      "Sweeping and dusting of all rooms",
      "Mopping of floors with standard floor cleaners",
      "Trash disposal and bin bag replacement",
      "Arranging cushions, beds, and light tidying"
    ],
    notIncluded: [
      "Deep stain scrubbing or carpet wash",
      "Deep cleaning of high ceilings/fans",
      "Washing of personal clothes",
      "Running outdoor errands or grocery shopping"
    ]
  },
  {
    label: "Cooking Help",
    img: "/CookingHelp.png",
    desc: "Home-cooked meals prepared in your own kitchen by experienced home chefs. Standardized menus or customized meals according to your dietary needs.",
    included: [
      "Preparing breakfast, lunch, or dinner as per schedule",
      "Chopping vegetables and basic meal prep",
      "Cleaning the stove and kitchen platform post-cooking",
      "Hygiene-first food handling"
    ],
    notIncluded: [
      "Grocery shopping or fetching ingredients",
      "Deep cleaning of chimney or kitchen cabinets",
      "Utensil washing (unless subscribed separately)",
      "Catering for large parties (>8 guests)"
    ]
  },
  {
    label: "Sweeping & Mopping",
    img: "/Sweeping&Mopping.png",
    desc: "Dedicated floor hygiene maintenance. Thorough sweeping and mopping to keep your floors shiny, germ-free, and clean.",
    included: [
      "Dry sweeping of all rooms and balconies",
      "Wet mopping using approved floor cleaner",
      "Stain spot cleaning on tiled surfaces",
      "Moving light furniture to clean underneath"
    ],
    notIncluded: [
      "Polishing or marble restoration",
      "Wall scrubbing or ceiling web removal",
      "Cleaning of balconies in heavy rain/dust storms",
      "Hand-scrubbing stubborn chemical stains"
    ]
  },
  {
    label: "Utensil Washing",
    img: "/UtensilWashing.png",
    desc: "Prompt utensil and dishwashing service to keep your kitchen sink clean and odor-free. Double-sanitized and organized.",
    included: [
      "Washing all kitchen utensils, plates, and cutlery",
      "Cleaning the sink area and wiping wet surfaces",
      "Organizing clean utensils back on racks",
      "Scrubbing pots and pans with high-grade soap"
    ],
    notIncluded: [
      "Cleaning heavy restaurant-grade ovens/grills",
      "Polishing copper or silver cutlery",
      "Organizing kitchen pantries",
      "Discarding expired food from containers"
    ]
  },
  {
    label: "Instant Backup",
    img: "/InstantBackup.png",
    desc: "Never worry about your domestic helper's absence. Get verified and trained backup professionals sent to your doorstep on demand.",
    included: [
      "On-demand backup helper dispatch within hours",
      "Pre-vetted and background-verified professionals",
      "Adherence to your standard society pricing rules",
      "Seamless billing integrated with your monthly plan"
    ],
    notIncluded: [
      "Permanent allocation of the backup worker",
      "Custom menu changes at short notice (for cooks)",
      "Service guarantee if requested after cutoff time (8 AM)",
      "Waiver of standard emergency booking rates"
    ]
  },
  {
    label: "Monthly Plan",
    img: "/MonthlyPlan.png",
    desc: "All-in-one monthly subscriptions combining multiple domestic services. Standardized rates approved by your society's RWA.",
    included: [
      "Consolidated billing for maid, cooking, and utensil services",
      "Guaranteed backup worker availability",
      "Priority support from society relationship managers",
      "Monthly attendance and performance reports"
    ],
    notIncluded: [
      "Prorated refunds for individual days skipped by choice",
      "Ad-hoc task requests outside of your selected plan",
      "Sharing plan benefits with external flats",
      "Custom individual rate negotiations"
    ]
  },
  {
    label: "Society Records",
    img: "/society-heropage.png",
    desc: "Complete transparency with digital logs. Track daily worker attendance, check-in times, and verification certificates in one place.",
    included: [
      "Daily digital check-in/check-out logs",
      "Live attendance status accessible via RWA dashboard",
      "Archived records of helper deployment history",
      "Direct billing invoices and payment tracking"
    ],
    notIncluded: [
      "Modifying logs manually by residents",
      "Direct communication with helpers' personal contacts",
      "CCTV/video monitoring logs",
      "Attendance tracking of personal guests"
    ]
  },
  {
    label: "Worker Verification",
    img: "/WorkerVerification.png",
    desc: "Safety first. Comprehensive background verification for every domestic worker entering the society premises.",
    included: [
      "Government-issued Photo ID verification",
      "Permanent address check and verification",
      "Previous reference check and rating assessment",
      "RWA-approved helper security clearance cards"
    ],
    notIncluded: [
      "Continuous real-time GPS tracking outside society",
      "Provision of legal guarantees for personal helper conduct",
      "Credit history or bank statement verification",
      "Medical or health check certifications"
    ]
  }
];

export default function V2Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const societyRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial center transform state to avoid conflict with Tailwind's -translate classes
      gsap.set(textRef.current, { xPercent: -50, yPercent: -50 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
          pin: pinRef.current,
          pinSpacing: true,
        },
      });

      // Slide image to the right and fade out
      tl.to(imageRef.current, { x: "100vw", opacity: 0, duration: 1.5, ease: "power2.inOut" }, 0);
      
      // Move and shrink text to top-left logo position
      tl.to(textRef.current, {
        left: "2rem",
        top: "2rem",
        xPercent: 0,
        yPercent: 0,
        scale: 0.16,
        transformOrigin: "left top",
        color: "rgba(245, 245, 247, 0.8)",
        duration: 1.5,
        ease: "power2.inOut"
      }, 0);

      tl.to(pinRef.current, { backgroundColor: "#2A005E", duration: 1 }, 0);
      tl.to("#hero-header nav", { color: "#ffffff", duration: 0.8 }, 0);
      tl.to("#hero-header .cta-btn", { color: "#ffffff", borderColor: "rgba(255,255,255,0.4)", backgroundColor: "rgba(255,255,255,0.1)", duration: 0.8 }, 0);
      tl.to(societyRef.current, { opacity: 1, pointerEvents: "auto", duration: 1, ease: "power2.out" }, 1.2);
      tl.to({}, { duration: 0.5 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <main className="w-full overflow-x-hidden" style={{ background: "#F0F2F5" }}>

      {/* ===== ZONE 1: Pinned Hero ===== */}
      <div ref={containerRef} className="relative h-[400vh] w-full">
        <div ref={pinRef} className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-[#F5F5F7]">
          <HeaderV2 />
          <div ref={contentRef} className="relative w-full flex-1 flex flex-col items-center justify-center origin-center">
            <h1 ref={textRef} className="absolute top-1/2 left-1/2 text-[18vw] font-black select-none whitespace-nowrap z-0 tracking-tighter" style={{ color: '#2A005E' }}>
              GetMyHelp
            </h1>
            <div ref={imageRef} className="absolute z-10 top-[15vh] bottom-0 left-0 right-0 flex justify-center items-start pointer-events-none">
              <img src="/hero-image.png" alt="GetMyHelp Hero" className="h-[50vh] md:h-[65vh] lg:h-[75vh] w-auto max-w-[85vw] md:max-w-[70vw] object-contain drop-shadow-2xl scale-[1.1] md:scale-[1.25]" />
            </div>
          </div>
          <div ref={societyRef} className="absolute inset-0 z-20 flex items-center justify-center px-4 md:px-[5vw] pt-24 pb-12 opacity-0 pointer-events-none">
            <div className="flex flex-col md:flex-row w-full w-[95vw] h-full items-center gap-[5vw]">
              <div className="flex-1 flex flex-col justify-center text-left order-2 md:order-1 pr-4 md:pr-[3vw]">
                <div className="relative inline-block w-fit mb-8 md:mb-10">
                  <h2 className="text-[10vw] md:text-[6vw] font-black text-white leading-[1.05] tracking-tight">
                    Your <br />
                    <span className="bg-gradient-to-r from-[#C898FF] to-[#FF9CEE] bg-clip-text text-transparent">society,</span>{" "}
                    <br />your rates.
                  </h2>
                  <svg width="250" height="15" viewBox="0 0 250 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-4 left-2 w-[50%] max-w-[200px]">
                    <path d="M2 13C80 3 180 3 248 10" stroke="url(#swoosh)" strokeWidth="4" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="swoosh" x1="0" y1="0" x2="250" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#D4A5FF" /><stop offset="1" stopColor="#EFA1FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-base text-[#F5F5F7]/70 leading-relaxed">Not whatever the last resident agreed to.</p>
              </div>
              <div className="relative flex-1 flex justify-center items-center h-full w-full order-1 md:order-2">
                <img src="/society-heropage.png" className="w-[85%] md:w-full max-h-[40vh] md:max-h-[70vh] object-contain drop-shadow-2xl scale-[1.0] md:scale-[1.1]" alt="Society" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ZONE 2: Main Page Content (Pronto style) ===== */}

      {/* WHY US — left aligned headline + 3 benefit cards */}
      <section id="why-us" className="w-full bg-[#F0F2F5] px-6 md:px-[5vw] py-[8vh]">
        <div className="w-full max-w-[95vw] mx-auto">
          <p className="text-[3vw] md:text-[1vw] font-bold tracking-[0.2em] text-[#2A005E] uppercase mb-3">WHY GETMYHELP</p>
          <h2 className="text-[10vw] md:text-[5vw] font-black text-gray-900 leading-[1.0] tracking-tight mb-3">
            No more planning<br />around your house<br />help.
          </h2>
          <p className="text-gray-500 text-base mb-10">Verified helpers, standard pricing, instant backups — all managed for your society.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Reliable Attendance", desc: "Helpers who show up, every day, on time." },
              { label: "Society-wide Pricing", desc: "One transparent rate for every flat. Agreed once." },
              { label: "Instant Backup", desc: "Absent helper? A replacement is arranged same-day." },
            ].map(({ label, desc }) => (
              <div key={label} className="bg-[#F3E8FF] rounded-2xl p-6 border border-[#E9D5FF]">
                <p className="text-base font-black text-gray-900 mb-1">{label}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR SERVICES — service grid cards like Pronto */}
      <section className="w-full bg-[#F0F2F5] px-6 md:px-[5vw] py-[6vh]">
        <div className="w-full max-w-[95vw] mx-auto">
          <p className="text-[3vw] md:text-[1vw] font-bold tracking-[0.2em] text-[#2A005E] uppercase mb-3">OUR SERVICES</p>
          <h2 className="text-[9vw] md:text-[4vw] font-black text-gray-900 leading-tight mb-10">
            Trusted house help,<br />standardised for your society.
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {servicesData.map(({ label, img }) => (
              <div
                key={label}
                onClick={() => setActiveService(label)}
                className="group bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#2A005E] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-start"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 flex items-center justify-center">
                  <img src={img} alt={label} className="w-[85%] h-[85%] object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-gray-800">{label}</span>
                  <span className={`text-gray-400 group-hover:text-[#2A005E] transition-colors ${activeService === label ? 'rotate-90' : ''}`}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE MODAL */}
      {activeService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveService(null)}>
          <div 
            className="bg-white w-full w-[95vw] h-full max-h-[95vh] rounded-3xl overflow-y-auto relative shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveService(null)}
              className="absolute top-6 right-6 w-[4vw] h-[4vw] min-w-[40px] min-h-[40px] bg-white/80 backdrop-blur hover:bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 text-xl font-light z-50 transition-colors shadow-sm"
            >
              ✕
            </button>
            
            {/* 1. Top Hero Section */}
            <div className="relative w-full px-8 md:px-[5vw] py-12 md:py-[8vh] overflow-hidden bg-white">
              {/* Purple Gradient */}
              <div className="absolute top-0 left-0 w-[70%] h-[150%] bg-gradient-to-br from-[#F3E8FF] to-transparent opacity-80 pointer-events-none -translate-x-1/4 -translate-y-1/4 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-[4vw] items-center">
                <div>
                  <div className="flex gap-2 text-[2.5vw] md:text-[0.8vw] font-semibold text-gray-400 mb-[4vh]">
                    <span>Home</span> <span className="text-gray-300">/</span>
                    <span>Services</span> <span className="text-gray-300">/</span>
                    <span className="text-gray-800">{activeService}</span>
                  </div>
                  <h2 className="text-[12vw] md:text-[5vw] font-black text-gray-900 mb-6 leading-[1.05] tracking-tight">{activeService}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-[95%]">
                    {servicesData.find(s => s.label === activeService)?.desc || "These are some basic services we provide, and everything can be customised according to you and your subscription plan."}
                  </p>
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdT1TPAeiWG5AJGKwaTA0W-QZXnsLAzxj6hhF42Dz7XG5Abxw/viewform?usp=publish-editor" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-[#2A005E] text-white px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-[#2A005E]/20 text-center"
                  >
                    Request for Society
                  </a>
                </div>
                
                <div className="bg-[#F5F5F7] rounded-[2rem] aspect-[4/3] flex items-center justify-center p-6 md:p-12">
                  <img 
                    src={servicesData.find(s => s.label === activeService)?.img} 
                    alt={activeService} 
                    className="max-h-[30vh] md:max-h-full w-full h-full object-contain" 
                  />
                </div>
              </div>
            </div>

            {/* 2. Included / Not Included */}
            <div className="w-full px-8 md:px-16 py-16 bg-white border-t border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div>
                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-[#F3E8FF] flex items-center justify-center">
                       <span className="text-[#2A005E] text-sm">✓</span>
                     </div>
                     What's included
                   </h3>
                   <ul className="space-y-4">
                     {(servicesData.find(s => s.label === activeService)?.included || ["Standard cleaning according to your society's agreed scope", "Use of basic cleaning materials if requested", "Verified and trained professional", "Free replacements for absent helpers"]).map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                         <span className="text-[#2A005E] mt-0.5">•</span> {item}
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                       <span className="text-red-500 text-sm">✕</span>
                     </div>
                     Not included
                   </h3>
                   <ul className="space-y-4">
                     {(servicesData.find(s => s.label === activeService)?.notIncluded || ["Deep cleaning of unreachable areas", "Heavy lifting or moving furniture", "Tasks outside the agreed society standard list", "External shopping or errands"]).map((item, i) => (
                       <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                         <span className="text-[#2A005E] mt-0.5">•</span> {item}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
            </div>

            {/* 3. More Services Grid */}
            <div className="w-full px-8 md:px-16 py-16 bg-[#F9FAFB] border-t border-gray-100">
               <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 tracking-tight">More ways to keep your home clean</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                 {servicesData.filter(s => s.label !== activeService).map(s => (
                   <div 
                     key={s.label} 
                     className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#2A005E] hover:shadow-md transition-all" 
                     onClick={() => setActiveService(s.label)}
                   >
                     <img src={s.img} alt={s.label} className="w-16 h-16 object-contain mb-3" />
                     <span className="text-[11px] font-bold text-gray-800 text-center leading-tight">{s.label}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* 4. Bottom CTA */}
            <div className="w-full px-8 md:px-16 py-16 bg-white">
               <div className="bg-[#F3E8FF] rounded-3xl p-12 md:p-20 text-center flex flex-col items-center justify-center relative overflow-hidden border border-[#E9D5FF]">
                 <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5 relative z-10 tracking-tight max-w-2xl">
                   Get trusted house help in minutes.
                 </h2>
                 <p className="text-gray-600 mb-8 relative z-10 text-lg">
                   Join the waitlist to be the first in your society to get started.
                 </p>
                 <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdT1TPAeiWG5AJGKwaTA0W-QZXnsLAzxj6hhF42Dz7XG5Abxw/viewform?usp=publish-editor" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-[#2A005E] text-white px-10 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform relative z-10 shadow-xl shadow-[#2A005E]/20 text-center"
                  >
                    Register Interest →
                  </a>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* HOW IT WORKS — Waterfall Timeline */}
      <section id="how-it-works" className="w-full bg-[#0A0A0A] px-6 md:px-[5vw] py-[12vh]">
        <div className="w-full max-w-[95vw] mx-auto">
          
          {/* Section Heading */}
          <div className="mb-16 text-left">
            <p className="text-xs font-bold tracking-[0.2em] text-[#C898FF] uppercase mb-3">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Simple, transparent, <br />and automated.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 border-x border-white/10 relative">
            {/* Desktop grid vertical lines */}
            <div className="hidden md:block absolute top-0 bottom-0 left-[33.33%] w-px bg-white/10" />
            <div className="hidden md:block absolute top-0 bottom-0 left-[66.66%] w-px bg-white/10" />

            {/* Headers */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 border-y border-white/10">
              <div className="py-4 px-6 text-white/50 text-sm tracking-widest font-mono">Step 1</div>
              <div className="hidden md:block py-4 px-6 text-white/50 text-sm tracking-widest font-mono">Step 2</div>
              <div className="hidden md:block py-4 px-6 text-white/50 text-sm tracking-widest font-mono">Step 3</div>
            </div>

            {/* Timeline Area */}
            <div className="col-span-1 md:col-span-3 relative min-h-[500px] flex flex-col md:block pt-12 pb-12 px-6 md:px-0 gap-10">
              
              {/* Step 1 Box */}
              <div className="md:absolute md:top-12 md:left-0 md:w-[33.33%] md:pr-4 flex flex-col items-start md:pl-6">
                <div className="bg-[#FF9CEE] px-4 py-2 mb-1 inline-block border border-black/10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none">SOCIETY</h3>
                </div>
                <div className="bg-[#FF9CEE] px-4 py-2 mb-4 inline-block border border-black/10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none">REGISTERS</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
                  Your RWA signs up. We onboard your existing helpers and bring new verified ones as needed.
                </p>
              </div>

              {/* Mobile Arrow 1 -> 2 */}
              <div className="flex md:hidden justify-center text-white/30 text-2xl my-2">↓</div>

              {/* Desktop Arrow 1 -> 2 */}
              <div className="hidden md:block absolute top-[140px] left-[29%] z-30 text-[#C898FF]/40 text-4xl select-none pointer-events-none rotate-[15deg]">
                ➔
              </div>

              {/* Step 2 Box */}
              <div className="md:absolute md:top-40 md:left-[33.33%] md:w-[33.33%] md:pr-4 flex flex-col items-start md:pl-6">
                <div className="bg-[#C898FF] px-4 py-2 mb-1 inline-block border border-black/10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none">WORKERS GET</h3>
                </div>
                <div className="bg-[#C898FF] px-4 py-2 mb-4 inline-block border border-black/10">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none">VERIFIED</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
                  Background checks, ID verification, and training — every helper is fully cleared before entry.
                </p>
              </div>

              {/* Mobile Arrow 2 -> 3 */}
              <div className="flex md:hidden justify-center text-white/30 text-2xl my-2">↓</div>

              {/* Desktop Arrow 2 -> 3 */}
              <div className="hidden md:block absolute top-[270px] left-[62%] z-30 text-[#C898FF]/40 text-4xl select-none pointer-events-none rotate-[15deg]">
                ➔
              </div>

              {/* Step 3 Box */}
              <div className="md:absolute md:top-72 md:left-[66.66%] md:w-[33.33%] md:pr-4 flex flex-col items-start md:pl-6">
                <div className="bg-[#2A005E] px-4 py-2 mb-1 inline-block border border-white/20">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-none">RESIDENTS</h3>
                </div>
                <div className="bg-[#2A005E] px-4 py-2 mb-4 inline-block border border-white/20">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-none">JUST LIVE</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed max-w-[280px]">
                  Standard pricing. Automatic backups. Attendance tracking. Everything runs on its own.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>



      {/* FAQ — Accordion like Pronto */}
      <section id="faqs" className="w-full bg-[#F0F2F5] px-6 md:px-[5vw] py-[8vh] border-t border-gray-200">
        <div className="w-full max-w-[95vw] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-[4vw] items-center">
            
            {/* Left: FAQs */}
            <div className="flex flex-col lg:pr-8">
              <p className="text-[3vw] md:text-[1vw] font-bold tracking-[0.2em] text-[#2A005E] uppercase mb-3">FAQ'S</p>
              <h2 className="text-[10vw] md:text-[4vw] font-black text-gray-900 mb-10">
                Frequently Asked<br />Questions
              </h2>

              <div className="flex flex-col gap-3 w-full">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-[#C898FF] transition-colors"
                  >
                    <button
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-gray-900 text-sm md:text-base">{faq.q}</span>
                      <span className="text-[#2A005E] text-2xl shrink-0 font-light">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: FAQ Image */}
            <div className="hidden lg:flex w-full h-full items-center justify-center relative">
              <img 
                src="/FAQ.png" 
                alt="FAQ Illustration" 
                className="w-full h-[130%] object-contain object-center drop-shadow-2xl scale-[2.2] translate-y-16" 
              />
            </div>

          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="w-full bg-[#F3E8FF] px-6 md:px-16 py-16 border-t border-[#E9D5FF]">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              Launching soon in your city.
            </h2>
            <p className="text-gray-500 text-base">Be the first society to get set up. Register your interest today.</p>
          </div>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSdT1TPAeiWG5AJGKwaTA0W-QZXnsLAzxj6hhF42Dz7XG5Abxw/viewform?usp=publish-editor" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-[#2A005E] text-white font-bold px-8 py-4 rounded-full text-base hover:scale-105 hover:shadow-lg transition-all whitespace-nowrap text-center"
          >
            Register interest →
          </a>
        </div>
      </section>

      {/* FOOTER — Dark and Editorial */}
      <footer className="w-full bg-[#0A0A0A] px-6 md:px-16 py-16 text-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Logo & Vision Column */}
            <div className="col-span-12 md:col-span-4 flex flex-col items-start gap-4">
              <span className="text-2xl font-black tracking-tight">
                GetMyHelp<span className="text-[#E83F9C] font-normal text-lg">.in</span>
              </span>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                We take complete responsibility for your domestic staffing. No negotiation, no attendance worries, standard flat rates. Completely managed care.
              </p>
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0E9AAE] animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-wider text-white/80 uppercase">Private Beta Active</span>
              </div>
            </div>

            {/* Services Column */}
            <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col items-start gap-4">
              <span className="text-[#C898FF] text-xs font-bold tracking-widest uppercase">Services</span>
              <ul className="flex flex-col gap-2.5 text-sm text-white/60 font-medium w-full">
                {[
                  { display: "Daily Household Cooks", target: "Cooking Help" },
                  { display: "Daily Home Cleaners", target: "Daily Maid" },
                  { display: "Full-Time Maid Staff", target: "Monthly Plan" },
                  { display: "Managed Backups", target: "Instant Backup" }
                ].map(({ display, target }) => (
                  <li 
                    key={display}
                    onClick={() => {
                      setActiveService(target);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {display}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us Column */}
            <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col items-start gap-4">
              <span className="text-[#C898FF] text-xs font-bold tracking-widest uppercase">Contact Us</span>
              <ul className="flex flex-col gap-3 text-sm text-white/60 font-medium">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#E83F9C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 1.72 11.53 11.53 0 00.82 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 11.3 11.3 0 002.81.82A2 2 0 0122 17v2a2 2 0 01-2 2 17 17 0 01-17-17z" />
                  </svg>
                  <a href="tel:+919818595170" className="hover:text-white transition-colors">
                    +91 9818595170
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#E83F9C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@getmyhelp.in" className="hover:text-white transition-colors">
                    support@getmyhelp.in
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-[#E83F9C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Ghaziabad, India<br />
                    <span className="text-[10px] text-white/40">Serving Ghaziabad</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Socials Column */}
            <div className="col-span-12 sm:col-span-4 md:col-span-2 flex flex-col items-start gap-4">
              <span className="text-[#C898FF] text-xs font-bold tracking-widest uppercase">Follow Our Journey</span>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span>Twitter</span>
                  <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span>Instagram</span>
                  <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span>LinkedIn</span>
                  <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
                </a>
              </div>
            </div>

          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">© 2025 GetMyHelp. All rights reserved.</p>
            <p className="text-white/30 text-xs">support@getmyhelp.in</p>
          </div>
        </div>
      </footer>

    </main>
  );
}
