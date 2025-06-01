export type AnalyzeSegmentResponse =
  | {
      hasError: true;
      type: string;
      description: string;
      original: string;
      correction: string;
    }
  | {
      hasError: false;
      type: null;
      description: string;
      original: null;
      correction: null;
    };
