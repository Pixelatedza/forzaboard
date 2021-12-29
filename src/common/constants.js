export const CONTEXTS = {
  CANVAS: 'canvas',
};

export const PICLASS_FILTERS = {
  D: {
    pi__gt: 0,
    pi__lte: 500,
  },
  C: {
    pi__gt: 500,
    pi__lte: 600,
  },
  B: {
    pi__gt: 600,
    pi__lte: 700,
  },
  A: {
    pi__gt: 700,
    pi__lte: 800,
  },
  S1: {
    pi__gt: 800,
    pi__lte: 900,
  },
  S2: {
    pi__gt: 900,
    pi__lte: 998,
  },
  X: {
    pi__gt: 998,
    pi__lte: 999,
  },
};

export const RecordType = {
  Distance: 'distance',
  Points: 'points',
  Speed: 'speed',
  Duration: 'duration',
  Seconds: 'seconds',
};

export const EventKindRecordType = {
  danger_sign: RecordType.Distance,
  drift_zone: RecordType.Points,
  speed_trap: RecordType.Speed,
  speed_zone: RecordType.Speed,
  the_goliath: RecordType.Duration,
  the_colossus: RecordType.Duration,
  cross_country_sprint: RecordType.Duration,
  road_sprint: RecordType.Duration,
  trail_blazer: RecordType.Seconds,
  dirt_sprint: RecordType.Duration,
  dirt_circuit: RecordType.Duration,
  street: RecordType.Duration,
  drag: RecordType.Duration,
  cross_country_circuit: RecordType.Duration,
  road_circuit: RecordType.Duration,
};
