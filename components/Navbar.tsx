"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  Menu,
  X,
  Sprout,
  FlaskConical,
  ScanLine,
  Info,
} from "lucide-react";

const toolLinks = [
  { href: "/crop", label: "Crop Rec.", icon: Sprout },
  { href: "/soil", label: "Soil Analysis", icon: FlaskConical },
  { href: "/plant", label: "Plant Detection", icon: ScanLine },
];

const infoLinks = [{ href: "/about", label: "About AgroAI", icon: Info }];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(34,197,94,0.12)",
        boxShadow: "0 1px 24px rgba(21,128,61,0.07)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(22,163,74,0.3)",
            }}
          >
            <Leaf size={18} color="#fff" />
          </div>

          <span
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: "#14532d",
              letterSpacing: "-0.3px",
            }}
          >
            AgroAI
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
          className="hidden md:flex"
        >
          {/* TOOL LINKS */}
          <div style={{ display: "flex", gap: 6 }}>
            {toolLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 12px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "#15803d" : "#3d5a44",
                    backgroundColor: active
                      ? "rgba(22,163,74,0.1)"
                      : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* DIVIDER */}
          <div
            style={{
              width: 1,
              height: 22,
              background: "rgba(22,163,74,0.15)",
            }}
          />

          {/* INFO LINKS */}
          {infoLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#15803d" : "#3d5a44",
                  backgroundColor: active
                    ? "rgba(22,163,74,0.1)"
                    : "transparent",
                  textDecoration: "none",
                }}
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            border: "1px solid rgba(22,163,74,0.2)",
            background: "transparent",
            color: "#15803d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(22,163,74,0.1)",
            backgroundColor: "rgba(255,255,255,0.98)",
            padding: "12px 24px 20px",
          }}
          className="md:hidden"
        >
          {[...toolLinks, ...infoLinks].map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#15803d" : "#3d5a44",
                  backgroundColor: active
                    ? "rgba(22,163,74,0.08)"
                    : "transparent",
                  textDecoration: "none",
                  marginBottom: 6,
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
