class Constants {
  public static fields(count: number) {
    const fields: { name: string; maxCount: number }[] = [];

    for (let i = 0; i < count; i++) {
      fields.push({ name: `scan_copy_${i}`, maxCount: 1 });
    }

    return fields;
  }
}

export default Constants;
