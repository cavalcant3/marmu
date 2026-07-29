export class MMKV {
  private store = new Map<string, any>();

  set(key: string, value: any) {
    this.store.set(key, value);
  }

  getString(key: string): string | undefined {
    return this.store.get(key);
  }

  getNumber(key: string): number | undefined {
    return this.store.get(key);
  }

  getBoolean(key: string): boolean | undefined {
    return this.store.get(key);
  }

  delete(key: string) {
    this.store.delete(key);
  }

  contains(key: string): boolean {
    return this.store.has(key);
  }
}
