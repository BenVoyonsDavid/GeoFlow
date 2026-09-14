import Link from "next/link";
import { createFamily } from "@/app/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FamiliesPage() {
  const families = await db.family.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          persons: true,
          sources: true,
        },
      },
    },
  });

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <Link className="brand" href="/">
            GeoFlow
          </Link>
          <p className="section-kicker">Espaces familiaux</p>
          <h1 className="page-title">Vos familles</h1>
          <p className="page-lead">
            Chaque espace conserve ses personnes, relations, sources, preuves et
            enquêtes séparément.
          </p>
        </div>
      </header>

      <div className="two-column">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Nouvel espace</p>
              <h2>Créer une famille</h2>
            </div>
          </div>

          <form action={createFamily} className="form-stack">
            <label className="field">
              <span>Nom de la famille</span>
              <input
                name="name"
                placeholder="Ex. Famille Pilote"
                required
                autoComplete="off"
              />
            </label>
            <button className="button primary" type="submit">
              Créer la famille
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Bibliothèque</p>
              <h2>Familles existantes</h2>
            </div>
            <span className="count-badge">{families.length}</span>
          </div>

          {families.length === 0 ? (
            <div className="empty-state">
              <strong>Aucune famille pour le moment.</strong>
              <span>Créez le premier espace pour commencer l’arbre.</span>
            </div>
          ) : (
            <div className="list-stack">
              {families.map((family) => (
                <Link
                  className="list-card"
                  href={`/families/${family.id}`}
                  key={family.id}
                >
                  <div>
                    <strong>{family.name}</strong>
                    <span>
                      {family._count.persons} personne
                      {family._count.persons > 1 ? "s" : ""} · {family._count.sources}{" "}
                      source{family._count.sources > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="list-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
