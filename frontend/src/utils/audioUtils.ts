export const convertFloat32ToInt16 = (buffer: Float32Array): Int16Array => {
  const result = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return result;
};

export const downsampleBuffer = (buffer: Float32Array, rate: number, outRate: number): Float32Array | null => {
  if (outRate >= rate) return null;
  const ratio = rate / outRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.floor((i + 1) * ratio);
    let sum = 0, count = 0;
    for (let j = start; j < end && j < buffer.length; j++) {
      sum += buffer[j];
      count++;
    }
    result[i] = sum / count || 0;
  }
  return result;
};