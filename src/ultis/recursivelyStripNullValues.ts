function recursivelyStripNullValues(value: unknown): unknown {
  if (Array.isArray(value)) {
    // Preserve array instance, only transform its items
    return value.map(recursivelyStripNullValues);
  }
  if (value !== null && typeof value === 'object') {
    // Preserve the original object's prototype (e.g. TypeORM entities)
    const obj = value as Record<string, unknown>;
    for (const [key, nested] of Object.entries(obj)) {
      if (nested === null) {
        delete obj[key];
      } else {
        obj[key] = recursivelyStripNullValues(nested) as unknown;
      }
    }
    return obj;
  }
  if (value !== null) {
    return value;
  }
}
export default recursivelyStripNullValues;