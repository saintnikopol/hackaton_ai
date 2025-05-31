export interface ResourceStatistics {
  cpuUsage: number;
  ramUsage: number;
  storageUsage: number;
}

export interface ResourceStaticData {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
}

export interface EventPayloadMapping {
  statistics: ResourceStatistics;
  getStaticData: ResourceStaticData;
}

declare global {
  interface Window {
    electron: {
      subscribeStatistics: (
        callback: (data: ResourceStatistics) => void,
      ) => void;
      getStaticData: () => Promise<ResourceStaticData>;
    };
  }
}
