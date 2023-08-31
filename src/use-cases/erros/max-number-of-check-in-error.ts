export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of checkIns reached.');
    this.name = 'MaxNumberOfCheckInsError';
  }
}
