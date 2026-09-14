import Link from "next/link";
import { notFound } from "next/navigation";
import { createPerson } from "@/app/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ familyId: string }>;
};

function personName(person: {
  givenNames: string | null;
  surname: string | null;
  preferredName: string | null;
}) {
  if (person.preferredName) return person.preferredName;
  return [person.givenNames, person.surname].filter(Boolean).join(" ") || "Sans nom";
}

export default async function FamilyPage({ params }: Props) {
  const { familyId } = await params;
  const family = await db.family.findUnique({
    where: { id: familyId },
    include: {
      persons: {
        orderBy: [{ surname: "asc" }, { givenNames: "asc" }],
        include: {
          _count: {
            select: {
              sourceLinks: true,
              events: true,
            },
          },
        },
      },
      _count: {
        select: {
          relationships: true,
          sources: true,
          investigations: true,
        },
      },
    },
  });

  if (!family) notFound();

  return (
    <main className="app-shell">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/families">Familles</Link>
        <span>/</span>
        <span>{family.name}</span>
      </nav>

      <header className="workspace-header">
        <div>
          <p className="section-kicker">Espace familial</p>
          <h1 className="page-title">{family.name}</h1>
          <p className="page-lead">
            {family.persons.length} personne{family.persons.length > 1 ? "s" : ""} ·{" "}
            {family._count.relationships} relation
            {family._count.relationships > 1 ? "s" : ""} · {family._count.sources} source
            {family._count.sources > 1 ? "s" : ""}
          </p>
        </div>
        <div className="header-actions">
          <span className="status-pill">Arbre en construction</span>
        </div>
      </header>

      <div className="workspace-grid">
        <section className="panel span-two">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Personnes</p>
              <h2>Membres de la famille</h2>
            </div>
            <span className="count-badge">{family.persons.length}</span>
          </div>

          {family.persons.length === 0 ? (
            <div className="empty-state">
              <strong>L’arbre est vide.</strong>
              <span>Ajoutez la première personne avec le formulaire.</span>
            </div>
          ) : (
            <div className="people-grid">
              {family.persons.map((person) => (
                <Link className="person-card" href={`/people/${person.id}`} key={person.id}>
                  <div className="avatar" aria-hidden="true">
                    {(person.preferredName || person.givenNames || person.surname || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <div className="person-card-body">
                    <strong>{personName(person)}</strong>
                    <span>{person.sex === "UNKNOWN" ? "Sexe non précisé" : person.sex}</span>
                    <small>
                      {person._count.sourceLinks} source
                      {person._count.sourceLinks > 1 ? "s" : ""} · {person._count.events} événement
                      {person._count.events > 1 ? "s" : ""}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Ajouter</p>
              <h2>Nouvelle personne</h2>
            </div>
          </div>

          <form action={createPerson} className="form-stack">
            <input type="hidden" name="familyId" value={family.id} />

            <label className="field">
              <span>Prénom(s)</span>
              <input name="givenNames" placeholder="Joseph" autoComplete="off" />
            </label>

            <label className="field">
              <span>Nom de famille</span>
              <input name="surname" placeholder="Pilote" autoComplete="off" />
            </label>

            <label className="field">
              <span>Nom préféré</span>
              <input name="preferredName" placeholder="Optionnel" autoComplete="off" />
            </label>

            <label className="field">
              <span>Sexe</span>
              <select name="sex" defaultValue="UNKNOWN">
                <option value="UNKNOWN">Non précisé</option>
                <option value="FEMALE">Féminin</option>
                <option value="MALE">Masculin</option>
                <option value="INTERSEX">Intersexe</option>
                <option value="UNSPECIFIED">Autre / non spécifié</option>
              </select>
            </label>

            <label className="field">
              <span>Notes</span>
              <textarea name="notes" rows={3} placeholder="Informations initiales…" />
            </label>

            <button className="button primary" type="submit">
              Ajouter la personne
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
