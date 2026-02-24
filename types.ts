
export enum InputType {
  Text = 'text',
  Image = 'image',
}

export enum Verdict {
  Genuine = 'Genuine',
  Fake = 'Fake',
  PotentiallyMisleading = 'Potentially Misleading',
  Inconclusive = 'Inconclusive',
  Unknown = 'Unknown'
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResult {
  verdict: Verdict;
  explanation: string;
  sources: GroundingSource[];
}

export interface ImageData {
  base64: string;
  mimeType: string;
}
