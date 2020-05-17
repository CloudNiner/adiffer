export const osmEpoch = 1347432900;

export const dateToSequence = (date: Date): string => {
  const epoch = Math.floor(date.getTime() / 1000);
  return Math.floor(((epoch - osmEpoch) / 60)).toString();
}

export const sequenceToDate = (sequence: string): Date | null => {
  const sequenceInt = parseInt(sequence, 10);
  if (isNaN(sequenceInt) || sequenceInt < 0) {
    return null;
  }
  const epoch = sequenceInt * 60 + osmEpoch;
  return new Date(epoch * 1000);
}

export const isSequenceValid = (sequence: string): boolean => {
  const sequenceDate = sequenceToDate(sequence);
  return Boolean(sequenceDate) && sequenceDate!.getTime() < new Date().getTime();
}
