import React, { useRef, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Dashboard from "../../assets/dashboard.png";
import {
  useHeroEntrance,
  useScrollFadeUp,
  useStaggerReveal,
} from "../../lib/useAnimations";
import TestimonialSection from "../../components/TestimonialSection/TestimonialSection";
import { SITE_CONTENT } from "../../content/siteContent";

const StackedCard = ({ i, card, smoothStack, isTablet }) => {
  const xRange = isTablet ? [i * 40, (i - 1) * 150] : [i * 80, (i - 1) * 410];
  const yRange = isTablet ? [i * 80, 400] : [i * 140, 520];
  const zRange = [i * -350, 0];

  const xPos = useTransform(smoothStack, [0, 1], xRange);
  const yPos = useTransform(smoothStack, [0, 1], yRange);
  const zPos = useTransform(smoothStack, [0, 1], zRange);
  const rx = useTransform(smoothStack, [0, 1], [55, 0]);
  const rz = useTransform(smoothStack, [0, 1], [-45, 0]);
  const scaleVal = useTransform(smoothStack, [0, 1], [1, 0.75]);

  return (
    <motion.div
      style={{
        x: xPos,
        y: yPos,
        z: zPos,
        rotateX: rx,
        rotateZ: rz,
        scale: scaleVal,
        transformStyle: "preserve-3d",
      }}
      className={`absolute inset-0 bg-linear-to-br ${card.color} rounded-[24px] md:rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.3)] md:shadow-[0_50px_100px_rgba(0,0,0,0.3)] p-6 md:p-10 flex flex-col justify-between border border-white/20 backdrop-blur-xl cursor-default overflow-hidden`}
    >
      <div className="absolute inset-0 bg-white/5 transition-opacity"></div>
      <div
        className="relative z-10 flex justify-between items-start"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="text-white font-black text-[10px] uppercase tracking-widest">
          Feature 0{i + 1}
        </div>
        <span className="material-symbols-outlined text-white">
          arrow_outward
        </span>
      </div>
      <div
        className="relative z-10 mt-auto"
        style={{ transform: "translateZ(50px)" }}
      >
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-black leading-[0.9] mb-4 md:mb-6 transition-all">
          {card.label.split(" ").map((word, index) => (
            <React.Fragment key={index}>
              {word} <br />
            </React.Fragment>
          ))}
        </h3>
        <p className="text-xs sm:text-sm md:text-base opacity-80 mb-4 md:mb-6 text-black/80 font-bold leading-relaxed transition-all duration-500 line-clamp-2 md:line-clamp-3">
          {card.desc}
        </p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const howItWorksRef = useRef(null);
  const dashboardRef = useRef(null);
  const heroRef = useRef(null);
  const heroSectionRef = useRef(null);
  const featuresRef = useRef(null);
  const howHeaderRef = useRef(null);
  const teamRef = useRef(null);
  const teamHeaderRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useHeroEntrance(heroRef);
  useScrollFadeUp(howHeaderRef);
  useStaggerReveal(teamRef, ".team-card");
  useScrollFadeUp(teamHeaderRef);

  const { scrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start center", "end center"],
  });

  const { scrollYProgress: dashScroll } = useScroll({
    target: dashboardRef,
    offset: ["start end", "end start"],
  });

  const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const springScroll = useSpring(dashScroll, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const dashWidth = useTransform(springScroll, [0, 0.4], ["75%", "95%"]);
  const dashScale = useTransform(springScroll, [0, 0.4], [0.85, 1]);
  const dashRotate = useTransform(springScroll, [0, 0.4], [10, 0]);

  const { scrollYProgress: stackScroll } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end center"],
  });

  const smoothStack = useSpring(stackScroll, { stiffness: 100, damping: 30 });

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div className="bg-black min-h-screen selection:bg-primary/30 selection:text-white">
      <Navbar />
      <section
        ref={heroSectionRef}
        className="relative min-h-screen pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between z-20"
      >
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 50 Q 25 45, 50 50 T 100 50"
              stroke="currentColor"
              fill="none"
              strokeWidth="0.1"
              className="text-primary"
            />
            <path
              d="M0 60 Q 25 55, 50 60 T 100 60"
              stroke="currentColor"
              fill="none"
              strokeWidth="0.1"
              className="text-secondary"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1
                ref={heroRef}
                className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-white font-black leading-[0.85] tracking-tighter"
              >
                {SITE_CONTENT.home.hero.title.map((line, index) => (
                  <React.Fragment key={line}>
                    {index === SITE_CONTENT.home.hero.title.length - 1 ? <span className="text-primary italic font-serif font-normal">{line}</span> : line}
                    {index < SITE_CONTENT.home.hero.title.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-20 relative size-24 md:size-32 group cursor-pointer hidden md:flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 group-hover:bg-white/10 transition-colors"></div>
                <div className="absolute inset-0 animate-spin-slow p-2">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible"
                  >
                    <path
                      id="circlePath"
                      d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                      fill="transparent"
                    />
                    <text className="text-[11px] font-black uppercase tracking-[0.2em] fill-white/40">
                      <textPath xlinkHref="#circlePath">
                        OPTIMIZE NOW • OPTIMIZE NOW •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </motion.div>
            </div>

            <div className="lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="max-w-md ml-auto"
              >
                <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
                  {SITE_CONTENT.home.hero.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link
                    to="/dashboard"
                    className="w-full sm:w-auto text-center bg-primary text-black px-10 py-5 rounded-full text-lg font-black tracking-tight hover:scale-105 transition-transform"
                  >
                    {SITE_CONTENT.home.hero.primaryCta}
                  </Link>
                  <Link
                    to="/download"
                    className="w-full sm:w-auto rounded-full px-10 py-5 bg-white/5 border border-white/10 flex items-center justify-center group hover:bg-white/10 transition-colors"
                  >
                    <span className="text-white text-lg fill-1 group-hover:scale-110 transition-transform">
                      {SITE_CONTENT.home.hero.secondaryCta}
                    </span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        {!isMobile && (
          <div className="relative mt-20 lg:-mt-40 -mb-1 z-30 flex justify-center perspective-[3000px]">
            <div
              className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-lg aspect-[1.1/1]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {SITE_CONTENT.home.features.cards.map((card, i) => (
                <StackedCard
                  key={i}
                  i={i}
                  card={card}
                  smoothStack={smoothStack}
                  isTablet={isTablet}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      <section
        className="relative z-10 bg-white rounded-[32px] md:rounded-[40px] py-16 md:py-24 pt-48 sm:pt-60 md:pt-60 pb-32 md:pb-40 px-6 md:px-12"
        id="intelligence"
      >
        <div className="max-w-7xl pt-40 sm:pt-60 md:pt-80 mx-auto" ref={featuresRef}>
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-background-dark mb-6 leading-tight">
              {SITE_CONTENT.home.features.heading}
            </h2>
            <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium">
              {SITE_CONTENT.home.features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SITE_CONTENT.home.features.stats.map((stat, i) => (
              <div
                key={i}
                className="p-8 rounded-[24px] md:rounded-[32px] bg-gray-50 border border-black/5 flex flex-col items-center text-center hover:bg-white hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="size-12 bg-background-dark rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <span className="material-symbols-outlined text-white text-2xl">
                    {stat.icon}
                  </span>
                </div>
                <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                  {stat.label}
                </div>
                <div className="text-3xl md:text-4xl font-black text-background-dark mb-4 group-hover:scale-110 transition-transform">
                  {stat.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {!isMobile && (
        <section
          ref={dashboardRef}
          className="py-24 md:py-32 px-6 bg-black overflow-hidden flex flex-col items-center"
        >
          <motion.div
            style={{
              width: dashWidth,
              scale: dashScale,
              rotateX: dashRotate,
            }}
            className="relative rounded-[32px] md:rounded-[48px] bg-white/5 border border-white/10 p-4 md:p-12 overflow-hidden group backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 mb-6 md:mb-8 px-4">
              <div className="ml-0 md:ml-4 px-3 py-1 bg-white/10 rounded-full text-[10px] text-white/40 font-mono tracking-widest uppercase">
                {SITE_CONTENT.home.preview.label}
              </div>
            </div>

            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/10"
            >
              <img
                src={Dashboard}
                alt="System Optimization Dashboard"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background-dark/80 via-transparent to-transparent pointer-events-none"></div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute top-1/2 right-4 hidden lg:block bg-primary p-6 rounded-3xl shadow-2xl max-w-[200px] border border-white/20"
            >
              <span className="material-symbols-outlined text-black text-4xl mb-4 text-center block" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <div className="text-black font-black text-xs uppercase tracking-widest mb-2 text-center">
                {SITE_CONTENT.home.preview.calloutLabel}
              </div>
              <div className="text-black text-3xl font-black text-center">
                {SITE_CONTENT.home.preview.calloutValue}
              </div>
            </motion.div>
          </motion.div>
          <div className="max-w-7xl mx-auto w-full">
            <div className="mt-16 md:mt-20 grid grid-cols-2 gap-8 md:gap-12 text-center">
              {SITE_CONTENT.home.preview.stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-3">
                    {stat.label}
                  </div>
                  <div className="text-white text-2xl md:text-3xl font-black">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section
        ref={howItWorksRef}
        className="bg-black text-white md:bg-white md:text-background-dark rounded-[32px] md:rounded-[40px] px-6 md:px-20 py-24 md:py-32 mt-0 relative overflow-hidden"
        id="how-it-works"
      >
        <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[radial-gradient(circle_at_center,rgba(99,103,255,0.08)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 max-w-7xl mx-auto">
          <div className="lg:sticky lg:top-32 h-fit mb-12 lg:mb-0">
            <h2
              ref={howHeaderRef}
              className="text-4xl md:text-7xl font-black mb-8 leading-[0.9] tracking-tight"
            >
              How it{" "}
              <span className="text-primary italic font-serif font-normal">
                Works
              </span>
            </h2>
            <p className="text-gray-500 mb-10 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              {SITE_CONTENT.home.howItWorks.description}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center bg-background-dark text-white px-8 md:px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-transform shadow-xl shadow-black/10"
            >
              {SITE_CONTENT.home.howItWorks.cta}
            </Link>
          </div>
          <div className="relative pt-4">
            <div className="absolute left-[19px] top-[20px] bottom-[100px] w-[2px] bg-background-dark/10 hidden sm:block"></div>
            <motion.div
              style={{ height: timelineHeight, top: "20px" }}
              className="absolute left-[19px] w-[2px] bg-primary origin-top shadow-[0_0_15px_rgba(99,103,255,0.5)] max-h-[calc(100%-100px)] hidden sm:block"
            />
            <div className="space-y-16 md:space-y-24 relative">
              {SITE_CONTENT.home.howItWorks.steps.map((item, index) => (
                <div key={item.title} className="relative flex gap-6 md:gap-10">
                  <div className="relative z-10 size-10 min-w-10 rounded-full bg-primary flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(99,103,255,0.3)]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-400 md:text-gray-600 font-bold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <TestimonialSection />
      <Footer />
    </div>
  );
};
export default Home;
