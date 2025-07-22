// Enhanced crypto polyfill for Node.js v16 compatibility
const crypto = require('crypto');

// 创建一个更完整的 crypto polyfill
const cryptoPolyfill = {
  getRandomValues: function(buffer) {
    if (!buffer) throw new Error('buffer is required');

    // 支持多种类型的 TypedArray
    if (buffer instanceof Uint8Array) {
      const randomBytes = crypto.randomBytes(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes[i];
      }
      return buffer;
    } else if (buffer instanceof Uint16Array) {
      const randomBytes = crypto.randomBytes(buffer.length * 2);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readUInt16BE(i * 2) % 65536;
      }
      return buffer;
    } else if (buffer instanceof Uint32Array) {
      const randomBytes = crypto.randomBytes(buffer.length * 4);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readUInt32BE(i * 4);
      }
      return buffer;
    } else if (buffer instanceof Int8Array) {
      const randomBytes = crypto.randomBytes(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readInt8(i);
      }
      return buffer;
    } else if (buffer instanceof Int16Array) {
      const randomBytes = crypto.randomBytes(buffer.length * 2);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readInt16BE(i * 2);
      }
      return buffer;
    } else if (buffer instanceof Int32Array) {
      const randomBytes = crypto.randomBytes(buffer.length * 4);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = randomBytes.readInt32BE(i * 4);
      }
      return buffer;
    } else {
      throw new Error('Unsupported buffer type: ' + buffer.constructor.name);
    }
  },

  randomUUID: function() {
    return crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

// 设置全局 crypto 对象
if (typeof globalThis !== 'undefined') {
  if (!globalThis.crypto) {
    globalThis.crypto = cryptoPolyfill;
  } else {
    // 如果已存在，只补充缺失的方法
    if (!globalThis.crypto.getRandomValues) {
      globalThis.crypto.getRandomValues = cryptoPolyfill.getRandomValues;
    }
    if (!globalThis.crypto.randomUUID) {
      globalThis.crypto.randomUUID = cryptoPolyfill.randomUUID;
    }
  }
}

if (typeof global !== 'undefined') {
  if (!global.crypto) {
    global.crypto = cryptoPolyfill;
  } else {
    if (!global.crypto.getRandomValues) {
      global.crypto.getRandomValues = cryptoPolyfill.getRandomValues;
    }
    if (!global.crypto.randomUUID) {
      global.crypto.randomUUID = cryptoPolyfill.randomUUID;
    }
  }
}

module.exports = cryptoPolyfill;
