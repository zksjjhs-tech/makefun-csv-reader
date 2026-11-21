/** Parse one CSV case using the recovery rules in the bounty brief. */
export function run(input) {
  const text = String(input.text);
  const header = input.header === true;
  const rows = [];
  const errors = [];
  const plainRecord = /([^"\r\n]*)(?:\r?\n|$)/y;
  const plain = /[^,\r\n]+/y;
  const lineBreak = /\r\n?|\n/g;
  const escapes = /""|\r\n?/g;
  const length = text.length;
  let cursor = text.charCodeAt(0) === 0xfeff ? 1 : 0;
  let line = 1;
  let recordLine = 1;
  let recordStart = cursor;
  let fieldStart = cursor;
  let columns = null;
  let width;
  let fields = [];
  let field = '';
  let hasContent = false;
  let quoted = false;
  let junk = false;

  function error(code) {
    const row = header && columns === null ? null : rows.length;
    return { code, line: recordLine, row };
  }

  function finishField() {
    if (junk) errors.push(error('quote_junk'));
    fields.push(field);
    field = '';
    quoted = false;
    junk = false;
  }

  function emitRecord(record) {
    width ??= record.length;
    if (header && columns === null) {
      columns = record;
    } else {
      if (record.length < width) {
        errors.push({ ...error('short_row'), fields: record.length });
        while (record.length < width) record.push('');
      } else if (record.length > width) {
        errors.push({ ...error('long_row'), extra: record.slice(width) });
        record.length = width;
      }
      rows.push(record);
    }
  }

  function finishRecord() {
    if (!hasContent) return;
    finishField();
    emitRecord(fields);
    fields = [];
    hasContent = false;
  }

  while (cursor < length) {
    // Most records need neither quoted-field parsing nor error recovery.
    if (cursor === recordStart) {
      plainRecord.lastIndex = cursor;
      const match = plainRecord.exec(text);
      if (match && plainRecord.lastIndex > cursor) {
        if (match[1] !== '') emitRecord(match[1].split(','));
        cursor = fieldStart = recordStart = plainRecord.lastIndex;
        recordLine = ++line;
        continue;
      }
    }
    const code = text.charCodeAt(cursor);
    if (code === 44) {
      hasContent = true;
      finishField();
      fieldStart = ++cursor;
      continue;
    }
    if (code === 10 || (code === 13 && text.charCodeAt(cursor + 1) === 10)) {
      finishRecord();
      cursor += code === 13 ? 2 : 1;
      fieldStart = recordStart = cursor;
      recordLine = ++line;
      continue;
    }
    if (code === 13) {
      errors.push(error('stray_cr'));
      cursor++;
      continue;
    }

    hasContent = true;
    if (code === 34 && cursor === fieldStart) {
      let close = text.indexOf('"', cursor + 1);
      while (close !== -1 && text.charCodeAt(close + 1) === 34) {
        close = text.indexOf('"', close + 2);
      }
      if (close !== -1) {
        const raw = text.slice(cursor + 1, close);
        lineBreak.lastIndex = 0;
        while (lineBreak.exec(raw) !== null) line++;
        field = raw.replace(escapes, (match) => match === '""' ? '"' : '\n');
        quoted = true;
        cursor = close + 1;
        continue;
      }
      errors.push(error('unterminated_quote'));
    }

    plain.lastIndex = cursor;
    field += plain.exec(text)[0];
    cursor = plain.lastIndex;
    junk ||= quoted;
  }
  finishRecord();
  return { columns: header ? (columns ?? []) : null, rows, errors };
}
