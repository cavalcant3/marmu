import { createMMKV, type MMKV as NativeMMKV } from "react-native-mmkv";

interface StorageOptions {
  id?: string;
  /** Mantido apenas para compatibilidade com chamadas antigas. */
  encrypt?: boolean;
  encryptionKey?: string;
}

/**
 * Adaptador da API de armazenamento usada pelo app para react-native-mmkv v4.
 *
 * A v4 substituiu o construtor `MMKV` por `createMMKV`. Não usamos fallback
 * silencioso no Android: uma falha de inicialização deve ser visível, em vez de
 * simular uma gravação que desaparece quando a tela é recarregada.
 */
export class MMKV {
  private readonly instance: NativeMMKV;

  constructor(options: StorageOptions = {}) {
    this.instance = createMMKV({
      id: options.id || "marmu-default",
      ...(options.encryptionKey ? { encryptionKey: options.encryptionKey } : {}),
    });
  }

  set(key: string, value: string | number | boolean): void {
    this.instance.set(key, value);
  }

  getString(key: string): string | undefined {
    return this.instance.getString(key);
  }

  delete(key: string): void {
    this.instance.remove(key);
  }
}
