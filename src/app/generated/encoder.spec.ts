import { CustomHttpParameterCodec } from '../generated/encoder';

describe('CustomHttpParameterCodec', () => {
  let codec: CustomHttpParameterCodec;

  beforeEach(() => {
    codec = new CustomHttpParameterCodec();
  });

  it('should encode key using encodeURIComponent', () => {
    const key = 'test key';
    const encodedKey = codec.encodeKey(key);
    expect(encodedKey).toBe(encodeURIComponent(key));
  });

  it('should encode value using encodeURIComponent', () => {
    const value = 'test value';
    const encodedValue = codec.encodeValue(value);
    expect(encodedValue).toBe(encodeURIComponent(value));
  });

  it('should decode key using decodeURIComponent', () => {
    const encodedKey = 'test%20key';
    const decodedKey = codec.decodeKey(encodedKey);

    expect(decodedKey).toBe(decodeURIComponent(encodedKey));
  });

  it('should decode value using decodeURIComponent', () => {
    const encodedValue = 'test%20value';
    const decodedValue = codec.decodeValue(encodedValue);
    expect(decodedValue).toBe(decodeURIComponent(encodedValue));
  });
});
