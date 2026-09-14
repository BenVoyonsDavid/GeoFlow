import Link from "next/link";

const pillars = [
  {
    title: "Sources",
    text: "Conserver l’origine exacte des documents, archives, liens et témoignages.",
  },
  {
    title: "Preuves",
    text: "Relier chaque affirmation aux éléments qui la soutiennent ou la contredisent.",
  },
  {
    title: "Enquêtes",
    text: "Tester plusieurs hypothèses sans contaminer l’arbre familial principal.",
  },
  {
    title: "Histoire",
    text: "Explorer les personnes, événements et migrations dans le temps et l’espace.",
  },
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">GeoFlow · v0.1.0</p>
        <h1>La généalogie construite autour des preuves.</h1>
        <p className="lead">
          Un arbre familial ne devrait pas seulement contenir des réponses. Il
          devrait montrer d’où elles viennent, ce qui les confirme et ce qui
          reste encore à découvrir.
        </p>
        <div className="home-actions">
          <Link className="button primary" href="/families">
            Ouvrir GeoFlow
          </Link>
          <a
            className="button secondary"
            href="https://github.com/BenVoyonsDavid/GeoFlow"
            target="_blank"
            rel="noreferrer"
          >
            Voir le dépôt GitHub
          </a>
        </div>
      </section>

      <section className="grid" aria-label="Fondations de GeoFlow">
        {pillars.map((pillar) => (
          <article className="card" key={pillar.title}>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className="status">
        <span className="dot" aria-hidden="true" />
        Premier flux famille → personne → relation → source disponible
      </section>
    </main>
  );
}
