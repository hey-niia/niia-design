export interface Experiment {
  name: string;
  description: string;
  stack: string;
  link?: string;
}

export const experiments: Experiment[] = [];
