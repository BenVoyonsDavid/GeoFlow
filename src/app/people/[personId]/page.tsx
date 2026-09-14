import Link from "next/link";
import { notFound } from "next/navigation";
import { addSourceToPerson, createRelative } from "@/app/actions";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ personId: string }>;
};

type NamedPerson = {
  id: string;
  givenNames: string | null;
  surname: string | null;
  preferredName: string | null;
  sex: string;
};

function personName(person: NamedPerson) {
  return (
    person.preferredName ||
    [person.givenNames, person.surname].filter(Boolean).join(" ") ||
    "Sans nom"
  );
}

function parentLabel(person: NamedPerson) {
  if (person.sex === "FEMALE") return "Mère";
  if (person.sex === "MALE") return "Père";
  return "Parent";
}

export default async function PersonPage({ params }: Props) {
  const { personId } = await params;
  const person = await db.person.findUnique({
    where: { id: personId },
    include: {
      family: true,
      sourceLinks: {
        orderBy: { createdAt: "desc" },
        include: { source: true },
      },
      outgoingRelations: {
        orderBy: { createdAt: "desc" },
        include: { toPerson: true },
      },
      incomingRelations: {
        orderBy: { createdAt: "desc" },
        include: { fromPerson: true },
      },
    },
  });

  if (!person) notFound();

  const relations = [
    ...person.incomingRelations.map((relation) => ({
      id: relation.id,
      person: relation.fromPerson,
      label:
        relation.type === "PARENT_CHILD"
          ? parentLabel(relation.fromPerson)
          : relation.type === "COUPLE"
            ? "Conjoint(e)"
            : relation.notes || relation.type,
    })),
    ...person.outgoingRelations.map((relation) => ({
      id: relation.id,
      person: relation.toPerson,
      label:
        relation.type === "PARENT_CHILD"
          ? "Enfant"
          : relation.type === "COUPLE"
            ? "Conjoint(e)"
            : relation.notes || relation.type,
    })),
  ];

  return (
    <main className="app-shell">
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/families">Familles</Link>
        <span>/</span>
        <Link href={`/families/${person.family.id}`}>{person.family.name}</Link>
        <span>/</span>
        <span>{personName(person)}</span>
      </nav>

      <header className="person-hero">
        <div className="avatar avatar-large" aria-hidden="true">
          {(person.preferredName || person.givenNames || person.surname || "?")
            .slice(0, 1)
            .toUpperCase()}
        </div>
        <div>
          <p className="section-kicker">Fiche individuelle</p>
          <h1 className="page-title">{personName(person)}</h1>
          <p className="page-lead">
            {[person.givenNames, person.surname].filter(Boolean).join(" ") || "Identité à compléter"}
            {person.sex !== "UNKNOWN" ? ` · ${person.sex}` : ""}
          </p>
        </div>
      </header>

      <div className="workspace-grid">
        <section className="panel span-two">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Famille</p>
              <h2>Relations</h2>
            </div>
            <span className="count-badge">{relations.length}</span>
          </div>

          {relations.length === 0 ? (
            <div className="empty-state">
              <strong>Aucune relation enregistrée.</strong>
              <span>Ajoutez un parent, un conjoint ou un enfant.</span>
            </div>
          ) : (
            <div className="relation-list">
              {relations.map((relation) => (
                <Link className="relation-card" href={`/people/${relation.person.id}`} key={relation.id}>
                  <div>
                    <span className="relation-label">{relation.label}</span>
                    <strong>{personName(relation.person)}</strong>
                  </div>
                  <span className="list-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Relier</p>
              <h2>Ajouter un proche</h2>
            </div>
          </div>

          <form action={createRelative} className="form-stack">
            <input type="hidden" name="personId" value={person.id} />

            <label className="field">
              <span>Lien</span>
              <select name="role" defaultValue="father" required>
                <option value="father">Père</option>
                <option value="mother">Mère</option>
                <option value="spouse">Conjoint(e)</option>
                <option value="child">Enfant</option>
              </select>
            </label>

            <label className="field">
              <span>Prénom(s)</span>
              <input name="givenNames" placeholder="Prénom" autoComplete="off" />
            </label>

            <label className="field">
              <span>Nom</span>
              <input name="surname" placeholder="Nom de famille" autoComplete="off" />
            </label>

            <label className="field">
              <span>Sexe (conjoint/enfant)</span>
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
              <textarea name="notes" rows={2} placeholder="Optionnel" />
            </label>

            <button className="button primary" type="submit">
              Créer et relier
            </button>
          </form>
        </aside>

        <section className="panel span-two">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Documentation</p>
              <h2>Sources associées</h2>
            </div>
            <span className="count-badge">{person.sourceLinks.length}</span>
          </div>

          {person.sourceLinks.length === 0 ? (
            <div className="empty-state">
              <strong>Aucune source associée.</strong>
              <span>Ajoutez un acte, un recensement, une archive ou un témoignage.</span>
            </div>
          ) : (
            <div className="list-stack">
              {person.sourceLinks.map(({ source }) => (
                <article className="source-card" key={source.id}>
                  <div className="source-card-topline">
                    <span className="source-type">{source.type.replaceAll("_", " ")}</span>
                    {source.provider ? <span>{source.provider}</span> : null}
                  </div>
                  <strong>{source.title}</strong>
                  {source.archivalRef ? <span>Cote : {source.archivalRef}</span> : null}
                  {source.url ? (
                    <a href={source.url} target="_blank" rel="noreferrer">
                      Ouvrir la source ↗
                    </a>
                  ) : null}
                  {source.notes ? <p>{source.notes}</p> : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Documenter</p>
              <h2>Ajouter une source</h2>
            </div>
          </div>

          <form action={addSourceToPerson} className="form-stack">
            <input type="hidden" name="personId" value={person.id} />

            <label className="field">
              <span>Titre</span>
              <input name="title" placeholder="Acte de baptême, recensement…" required />
            </label>

            <label className="field">
              <span>Type</span>
              <select name="type" defaultValue="OTHER">
                <option value="VITAL_RECORD">État civil</option>
                <option value="PARISH_REGISTER">Registre paroissial</option>
                <option value="CENSUS">Recensement</option>
                <option value="NEWSPAPER">Journal</option>
                <option value="OBITUARY">Nécrologie</option>
                <option value="CEMETERY">Cimetière</option>
                <option value="NOTARIAL_RECORD">Acte notarié</option>
                <option value="IMMIGRATION_RECORD">Immigration</option>
                <option value="WEBSITE">Site Web</option>
                <option value="FAMILY_TREE">Arbre généalogique</option>
                <option value="PHOTO">Photo</option>
                <option value="INTERVIEW">Entrevue</option>
                <option value="OTHER">Autre</option>
              </select>
            </label>

            <label className="field">
              <span>Fournisseur</span>
              <input name="provider" placeholder="BAnQ, LAC, archives familiales…" />
            </label>

            <label className="field">
              <span>Cote / référence</span>
              <input name="archivalRef" placeholder="Optionnel" />
            </label>

            <label className="field">
              <span>URL</span>
              <input name="url" type="url" placeholder="https://…" />
            </label>

            <label className="field">
              <span>Notes</span>
              <textarea name="notes" rows={3} placeholder="Pourquoi cette source est pertinente…" />
            </label>

            <button className="button primary" type="submit">
              Ajouter la source
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
