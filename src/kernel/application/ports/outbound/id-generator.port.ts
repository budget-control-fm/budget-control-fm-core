export interface IdGeneratorPort {
  generate(): string;
  generate(seed: string): string;
}
