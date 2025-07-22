// Crypto polyfill for renderer process
declare global {
  interface Window {
    crypto: Crypto;
  }

  var crypto: Crypto;
}

if (typeof window !== 'undefined' && !window.crypto) {
  const mockCrypto = {
    getRandomValues: function<T extends ArrayBufferView>(buffer: T): T {
      // 在渲染进程中，我们可以使用 Math.random() 作为fallback
      if (buffer instanceof Uint8Array) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
      } else if (buffer instanceof Uint16Array) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.floor(Math.random() * 65536);
        }
        return buffer;
      } else if (buffer instanceof Uint32Array) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] = Math.floor(Math.random() * 4294967296);
        }
        return buffer;
      }
      return buffer;
    },
    randomUUID: function(): string {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  } as Crypto;

  window.crypto = mockCrypto;
  (globalThis as Record<string, unknown>).crypto = mockCrypto;
}

export default {};
