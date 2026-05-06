import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Trash2, Wifi, Cloud, Monitor, ArrowRight, AlertTriangle,
  Globe, Zap, Shield, ChevronDown, Activity, Bell, BarChart3, Map, FileText
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const stats = [
  { value: '2.01B', label: 'Tonnes of waste generated globally per year', icon: Globe },
  { value: '33%', label: 'Of waste is not managed in an environmentally safe manner', icon: AlertTriangle },
  { value: '70%', label: 'Increase in waste expected by 2050 without intervention', icon: Activity },
  { value: '$375B', label: 'Annual cost of waste mismanagement worldwide', icon: Zap },
];

const archSteps = [
  {
    icon: Wifi,
    label: 'IoT Sensor',
    desc: 'Ultrasonic sensors measure bin fill levels in real-time',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.15)',
  },
  {
    icon: Zap,
    label: 'NodeMCU',
    desc: 'ESP8266 microcontroller processes and transmits data via WiFi',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.15)',
  },
  {
    icon: Cloud,
    label: 'Cloud Platform',
    desc: 'Secure cloud infrastructure stores and processes sensor data',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
  },
  {
    icon: Monitor,
    label: 'Dashboard',
    desc: 'Real-time monitoring dashboard for municipal authorities',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.15)',
  },
];

const features = [
  { icon: Activity, title: 'Real-Time Monitoring', desc: 'Live bin fill levels updated every few seconds via IoT sensors', color: '#60a5fa' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Automatic notifications when bins exceed 80% capacity', color: '#f87171' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Comprehensive charts and reports for data-driven decisions', color: '#4ade80' },
  { icon: Map, title: 'Map View', desc: 'Geographic visualization of all smart bins across the city', color: '#a78bfa' },
  { icon: Shield, title: 'Secure Platform', desc: 'Enterprise-grade security with encrypted data transmission', color: '#fb923c' },
  { icon: FileText, title: 'Collection Reports', desc: 'Detailed logs of all waste collection events and history', color: '#facc15' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(10,15,40,0.8)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(80,120,200,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-sm hidden sm:block">SmartWaste IoT</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate({ to: '/login' })}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
        {/* Background image */}
        <div
          ref={heroRef}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-400 opacity-30"
              style={{
                left: `${(i * 17 + 5) % 100}%`,
                top: `${(i * 23 + 10) % 100}%`,
                animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${(i % 4) * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(96,165,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in"
            style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300">Live IoT Monitoring Platform</span>
          </div>

          {/* Title */}
          <h1
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            IoT Based{' '}
            <span className="gradient-text">Smart Waste</span>
            <br />
            Management System
          </h1>

          {/* Tagline */}
          <p
            className="text-lg sm:text-xl text-blue-200/80 mb-10 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Smart IoT Solution for Real-Time Waste Monitoring — Empowering Municipal Authorities with Intelligent Data
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              onClick={() => navigate({ to: '/login' })}
              className="group px-8 py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-glow flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#problem"
              className="px-8 py-4 rounded-xl font-semibold text-blue-300 text-base transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              style={{ border: '1px solid rgba(96,165,250,0.4)', background: 'rgba(96,165,250,0.08)' }}
            >
              Learn More
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            {[
              { label: 'Smart Bins', value: '5' },
              { label: 'Cities Covered', value: '1' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Alerts Today', value: 'Live' },
            ].map(s => (
              <div key={s.label} className="glass-card-dark p-4 text-center">
                <p className="text-2xl font-bold font-display text-white">{s.value}</p>
                <p className="text-xs text-blue-300/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-blue-400/60" />
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problem" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400">The Problem</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Waste Management Crisis</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Traditional waste collection systems are inefficient, costly, and environmentally harmful. Cities worldwide
              struggle with overflowing bins, missed collections, and reactive management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-card p-6 text-center hover:scale-[1.03] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="font-display font-bold text-3xl text-red-400 mb-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution / Architecture */}
      <section className="py-24 px-6" style={{ background: 'rgba(15,25,60,0.3)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400">The Solution</span>
            </div>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">IoT Architecture Overview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our end-to-end IoT pipeline connects physical sensors to a cloud-powered dashboard, enabling real-time
              monitoring and intelligent waste collection scheduling.
            </p>
          </div>

          {/* Architecture Diagram Image */}
          <div className="glass-card p-4 mb-12 overflow-hidden">
            <img
              src="/assets/generated/architecture-diagram.dim_900x300.png"
              alt="IoT Architecture Diagram"
              className="w-full h-auto rounded-lg object-cover"
              style={{ maxHeight: '300px' }}
            />
          </div>

          {/* Architecture Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5"
              style={{ background: 'linear-gradient(90deg, #60a5fa, #4ade80, #a78bfa, #fb923c)' }}
            />

            {archSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-6 text-center relative hover:scale-[1.03] transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10"
                    style={{ background: step.bg, border: `1px solid ${step.color}40` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-3 text-xs font-bold text-white"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2">{step.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  {i < archSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-4">
                      <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Platform Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything municipal authorities need to manage waste collection intelligently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card p-6 hover:scale-[1.02] transition-all duration-300">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center animated-gradient">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-6">
            Ready to Transform Waste Management?
          </h2>
          <p className="text-blue-200/80 mb-10 text-lg">
            Join the smart city revolution. Access the live monitoring dashboard now.
          </p>
          <button
            onClick={() => navigate({ to: '/login' })}
            className="group px-10 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-glow flex items-center gap-3 mx-auto"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #22c55e)' }}
          >
            Access Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">SmartWaste IoT Platform</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} IoT Smart Waste Management System. Final Year Engineering Project.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname || 'iot-waste-management'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
