// crypto polyfill for Node.js v16 compatibility
import crypto from 'crypto';

if (!globalThis.crypto) {
  globalThis.crypto = {};
}

if (!globalThis.crypto.getRandomValues) {
  globalThis.crypto.getRandomValues = function(buffer) {
    if (buffer instanceof Uint8Array || buffer instanceof Uint32Array || buffer instanceof Uint16Array) {
      const randomBytes = crypto.randomBytes(buffer.length * buffer.BYTES_PER_ELEMENT);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readUIntBE(i * buffer.BYTES_PER_ELEMENT, buffer.BYTES_PER_ELEMENT);
      }
      return buffer;
    }
    throw new Error('Unsupported buffer type');
  };
}

export default globalThis.crypto;
