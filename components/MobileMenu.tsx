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
        <a href="#curso">Curso anual</a>
        <a href="#metodologia">Metodología</a>
        <a href="#intensivo">Intensivo</a>
        <a href="#direccion">Dirección</a>
        <StudentAccess />
        <a href="#informacion">Información</a>
      </div>
    </details>
  );
}
