const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const formatDDMMYY = (d: Date) => {
  d = d || new Date();
  return (
    ('0' + d.getDate()).slice(-2) +
    '/' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '/' +
    ('000' + d.getFullYear()).slice(-4)
  );
};

export const formatYYYYMMDD = (d: Date) => {
  d = d || new Date();
  return (
    ('000' + d.getFullYear()).slice(-4) +
    '-' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + d.getDate()).slice(-2)
  );
};

export const humanize = (d: Date) => {
  d = d || new Date();
  return (
    ('0' + d.getDate()).slice(-2) +
    ' ' +
    MONTHS[d.getMonth()] +
    ' ' +
    ('000' + d.getFullYear()).slice(-4)
  );
};
