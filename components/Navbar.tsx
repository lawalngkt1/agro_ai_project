'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, X, Sprout, FlaskConical, ScanLine, InfoIcon } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/crop', label: 'Crop Rec.', icon: Sprout },
  { href: '/soil', label: 'Soil Analysis', icon: FlaskConical },
  { href: '/plant', label: 'Plant Detection', icon: ScanLine },
  { href: '/about', label: 'About', icon: InfoIcon }
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(34,197,94,0.12)',
        boxShadow: '0 1px 24px rgba(21,128,61,0.07)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(22,163,74,0.3)',
            }}
          >
            <Leaf size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#14532d', letterSpacing: '-0.3px' }}>
            AgroAI
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#15803d' : '#3d5a44',
                  backgroundColor: active ? 'rgba(22,163,74,0.1)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>


        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 8,
            border: '1px solid rgba(22,163,74,0.2)',
            background: 'transparent',
            cursor: 'pointer',
            color: '#15803d',
          }}
          className="md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(22,163,74,0.1)',
            backgroundColor: 'rgba(255,255,255,0.98)',
            padding: '12px 24px 20px',
          }}
          className="md:hidden"
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 14px',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#15803d' : '#3d5a44',
                  backgroundColor: active ? 'rgba(22,163,74,0.08)' : 'transparent',
                  textDecoration: 'none',
                  marginBottom: 4,
                }}
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
