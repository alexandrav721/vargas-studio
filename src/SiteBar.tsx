/* The same bar as public/site-bar.js, for the React pages. Styles: public/site-bar.css. */
export default function SiteBar({ backHref, backLabel }: { backHref: string; backLabel: string }) {
  return (
    <nav className="site-bar" aria-label="Vargas Studio">
      <a href={backHref}>← {backLabel}</a>
      <a className="site-home" href="#/">
        Vargas Studio
      </a>
    </nav>
  );
}
