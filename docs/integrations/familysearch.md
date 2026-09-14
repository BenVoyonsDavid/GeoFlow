# FamilySearch integration strategy

## Decision

GeoFlow must **not depend on FamilySearch** to deliver its core product.

FamilySearch third-party API access is intended for qualified solution providers. Their application process currently states that:

- API access is for organizations with software development experience and application marketing history;
- the API provides person/tree data;
- the API does not provide historical-record searchability through this approval path;
- prototypes, proof-of-concepts, personal projects and read-only applications are likely to be rejected;
- solutions that contribute persons, relationships, facts, sources or memories and add analysis/visualizations are favored;
- AI-generated information must not be uploaded without disclosure and approval.

## GeoFlow approach

### Before FamilySearch approval

GeoFlow v0.x will support:

- private GeoFlow trees;
- people and relationships;
- facts and life events;
- manual sources;
- URLs and archival references;
- uploaded photos/documents;
- evidence and conflicting claims;
- investigations and hypotheses;
- GEDCOM import/export;
- source-provider architecture;
- AI-assisted transcription and extraction with human validation.

### Future FamilySearch connector

A future `FamilySearchProvider` may support, subject to FamilySearch approval and API terms:

- Family Tree person lookup;
- person comparison and matching;
- import with user authorization;
- contribution of new persons;
- parent-child and couple relationships;
- facts and life events;
- source citations;
- memories where permitted;
- synchronization/audit history.

## AI rule

GeoFlow AI may suggest an interpretation, but it must never silently publish generated genealogical data to FamilySearch.

Required flow:

1. Source is identified.
2. AI extracts or proposes information.
3. GeoFlow displays the source and reasoning context.
4. User reviews the proposal.
5. User explicitly confirms or rejects it.
6. A separate explicit action is required to contribute approved information to FamilySearch.

## Product alignment with FamilySearch approval criteria

GeoFlow should eventually be able to demonstrate that it:

- attracts new genealogy users;
- contributes meaningful new persons and relationships;
- contributes properly cited sources and memories;
- provides analytical views unavailable in a conventional family tree;
- provides temporal migration maps;
- provides evidence/conflict visualization;
- supports research investigations and alternative hypotheses;
- has a credible marketing and business model;
- has an established beta user base before applying for production access.

## Application timing

Do not submit the FamilySearch provider application while GeoFlow is still only a prototype.

Recommended milestone: submit after the public/private beta has real users, measurable contributions, a product website, a privacy policy, terms of service and a documented marketing strategy.
