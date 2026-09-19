"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { StudentAccess } from "./SiteLinks";

export function MobileMenu() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    menuRef.current?.removeAttribute("open");
  }, []);

  function closeAfterNavigation(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) {
      menuRef.current?.removeAttribute("open");
    }
  }

  return (
    <details className="mobile-menu" ref={menuRef} suppressHydrationWarning>
      <summary aria-label="Abrir menú"><span /><span /></summary>
      <div onClickCapture={closeAfterNavigation}>
        <a href="#master-dub">¿Qué es una MASTER DUB?</a>
        <a href="#curso">Formación anual</a>
        <a href="#instalaciones">Instalaciones</a>
        <a href="#direccion">Profesionales</a>
        <a href="#en-sala">En sala</a>
        <StudentAccess />
        <a href="#informacion">INFÓRMATE</a>
      </div>
    </details>
  );
}
