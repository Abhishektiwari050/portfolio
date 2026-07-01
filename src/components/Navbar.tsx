import React from 'react';

export const Navbar: React.FC = () => {
  const isAnatomyPage = typeof window !== 'undefined' && window.location.pathname.includes('anatomy');

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isCreative = params?.get('side') === 'creative';

  const navLinks = [
    { label: '// INTRO', href: isAnatomyPage ? '/#hero' : '#hero', isActive: !isAnatomyPage && (typeof window !== 'undefined' && window.location.hash === '#hero') },
    { label: '// WORK', href: isAnatomyPage ? '/#aetheris' : '#aetheris', isActive: !isAnatomyPage && (typeof window !== 'undefined' && window.location.hash === '#aetheris') },
    { label: '// ANATOMY', href: isAnatomyPage ? '#anatomy' : '/anatomy.html', isActive: isAnatomyPage },
    { label: '// CONTACT', href: isAnatomyPage ? '/#connect' : '#connect', isActive: !isAnatomyPage && (typeof window !== 'undefined' && window.location.hash === '#connect') },
    ...(isAnatomyPage ? [] : [
      isCreative 
        ? { label: '// DEV MODE', href: '/index.html?side=development', isActive: false }
        : { label: '// CREATIVE MODE', href: '/index.html?side=creative', isActive: false }
    ])
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        minWidth: '500px',
        maxWidth: '90%',
        height: '54px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.15))', /* Liquid Glass */
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.65)', /* Glossy edge */
        borderRadius: '27px', /* Island pill */
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.03), inset 0 6px 12px rgba(255, 255, 255, 0.4)', /* Inner glass reflection */
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'background 0.3s, transform 0.3s',
      }}
    >
      {/* Left: Branding */}
      <a
        href={isAnatomyPage ? '/' : '#hero'}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          textDecoration: 'none',
          letterSpacing: '0.12em',
        }}
      >
        [ ARCHITECT ]
      </a>

      {/* Right: Navigation Links */}
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        {navLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: '0.6rem',
              color: link.isActive ? 'var(--accent-indigo)' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              transition: 'color 0.25s',
              fontWeight: link.isActive ? 700 : 500,
            }}
            onMouseEnter={(e) => {
              if (!link.isActive) e.currentTarget.style.color = 'var(--accent-indigo)';
            }}
            onMouseLeave={(e) => {
              if (!link.isActive) e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
};
