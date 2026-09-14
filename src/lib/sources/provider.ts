export type SourceSearchPerson = {
  givenNames?: string;
  surname?: string;
  birthYear?: number;
  deathYear?: number;
  place?: string;
};

export type SourceCandidate = {
  providerId: string;
  externalId: string;
  title: string;
  url?: string;
  dateText?: string;
  placeText?: string;
  summary?: string;
  confidence?: number;
};

export interface SourceProvider {
  readonly id: string;
  readonly displayName: string;
  readonly supportsPersonSearch: boolean;

  searchPerson?(query: SourceSearchPerson): Promise<SourceCandidate[]>;
}

/**
 * GeoFlow source providers are adapters, not authorities.
 * A provider returns candidates. GeoFlow stores the source separately from
 * any claim or interpretation created from that source.
 */
export class SourceProviderRegistry {
  private readonly providers = new Map<string, SourceProvider>();

  register(provider: SourceProvider) {
    this.providers.set(provider.id, provider);
  }

  get(id: string) {
    return this.providers.get(id);
  }

  list() {
    return [...this.providers.values()];
  }
}
