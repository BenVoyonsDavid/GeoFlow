"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  RelationshipType,
  Sex,
  SourceType,
} from "@/generated/prisma/client";
import { db } from "@/lib/db";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: string) {
  return value.length > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "famille";
}

function readSex(value: string): Sex {
  return Object.values(Sex).includes(value as Sex)
    ? (value as Sex)
    : Sex.UNKNOWN;
}

function readSourceType(value: string): SourceType {
  return Object.values(SourceType).includes(value as SourceType)
    ? (value as SourceType)
    : SourceType.OTHER;
}

export async function createFamily(formData: FormData) {
  const name = text(formData, "name");

  if (!name) {
    throw new Error("Le nom de la famille est obligatoire.");
  }

  const baseSlug = slugify(name);
  const existing = await db.family.findUnique({ where: { slug: baseSlug } });
  const slug = existing
    ? `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`
    : baseSlug;

  const family = await db.family.create({
    data: { name, slug },
  });

  redirect(`/families/${family.id}`);
}

export async function createPerson(formData: FormData) {
  const familyId = text(formData, "familyId");
  const givenNames = text(formData, "givenNames");
  const surname = text(formData, "surname");
  const preferredName = text(formData, "preferredName");
  const notes = text(formData, "notes");
  const sex = readSex(text(formData, "sex"));

  if (!familyId || (!givenNames && !surname)) {
    throw new Error("Une famille et au moins un nom sont obligatoires.");
  }

  const person = await db.person.create({
    data: {
      familyId,
      givenNames: nullable(givenNames),
      surname: nullable(surname),
      preferredName: nullable(preferredName),
      notes: nullable(notes),
      sex,
    },
  });

  revalidatePath(`/families/${familyId}`);
  redirect(`/people/${person.id}`);
}

export async function createRelative(formData: FormData) {
  const personId = text(formData, "personId");
  const role = text(formData, "role");
  const givenNames = text(formData, "givenNames");
  const surname = text(formData, "surname");
  const notes = text(formData, "notes");

  if (!personId || !role || (!givenNames && !surname)) {
    throw new Error("La personne, le lien et au moins un nom sont obligatoires.");
  }

  const person = await db.person.findUnique({
    where: { id: personId },
    select: { familyId: true },
  });

  if (!person) {
    throw new Error("Personne introuvable.");
  }

  let relativeSex = readSex(text(formData, "sex"));
  let type = RelationshipType.OTHER;
  let fromPersonId = personId;
  let relativeIsFrom = false;
  let relationshipNote: string | null = null;

  if (role === "father") {
    relativeSex = Sex.MALE;
    type = RelationshipType.PARENT_CHILD;
    relativeIsFrom = true;
    relationshipNote = "Père";
  } else if (role === "mother") {
    relativeSex = Sex.FEMALE;
    type = RelationshipType.PARENT_CHILD;
    relativeIsFrom = true;
    relationshipNote = "Mère";
  } else if (role === "child") {
    type = RelationshipType.PARENT_CHILD;
    relationshipNote = "Enfant";
  } else if (role === "spouse") {
    type = RelationshipType.COUPLE;
    relationshipNote = "Conjoint(e)";
  }

  const relative = await db.$transaction(async (tx) => {
    const created = await tx.person.create({
      data: {
        familyId: person.familyId,
        givenNames: nullable(givenNames),
        surname: nullable(surname),
        sex: relativeSex,
        notes: nullable(notes),
      },
    });

    await tx.relationship.create({
      data: {
        familyId: person.familyId,
        fromPersonId: relativeIsFrom ? created.id : fromPersonId,
        toPersonId: relativeIsFrom ? personId : created.id,
        type,
        notes: relationshipNote,
      },
    });

    return created;
  });

  revalidatePath(`/people/${personId}`);
  revalidatePath(`/families/${person.familyId}`);
  redirect(`/people/${relative.id}`);
}

export async function addSourceToPerson(formData: FormData) {
  const personId = text(formData, "personId");
  const title = text(formData, "title");
  const type = readSourceType(text(formData, "type"));
  const provider = text(formData, "provider");
  const archivalRef = text(formData, "archivalRef");
  const url = text(formData, "url");
  const notes = text(formData, "notes");

  if (!personId || !title) {
    throw new Error("La personne et le titre de la source sont obligatoires.");
  }

  const person = await db.person.findUnique({
    where: { id: personId },
    select: { familyId: true },
  });

  if (!person) {
    throw new Error("Personne introuvable.");
  }

  await db.source.create({
    data: {
      familyId: person.familyId,
      title,
      type,
      provider: nullable(provider),
      archivalRef: nullable(archivalRef),
      url: nullable(url),
      notes: nullable(notes),
      personLinks: {
        create: {
          personId,
        },
      },
    },
  });

  revalidatePath(`/people/${personId}`);
  revalidatePath(`/families/${person.familyId}`);
}
