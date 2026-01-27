import { create } from "zustand";
import type { MapOptions, SourceSpecification } from "maplibre-gl";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";
import type { MappedError } from "../definitions";
import type { MapState, ModalTypes } from "../../components/AppToolbar";

export type AppSideView = "layers" | "settings" | "sources" | "globalState" | "codeEditor";

type MapView = {
  zoom: number;
  center: {
    lng: number;
    lat: number;
  };
};

type VectorLayers = {
  [vectorLayerId: string]: {
    [propertyName: string]: {
      [propertyValue: string]: {};
    };
  };
};

type SourceWithLayers = SourceSpecification & { layers: string[] };

type DebugOptions = Partial<MapOptions> & {
  showTileBoundaries: boolean;
  showCollisionBoxes: boolean;
  showOverdrawInspector: boolean;
};

type OpenLayersDebugOptions = {
  debugToolbox: boolean;
};

export type EditorUiState = {
  errors: MappedError[];
  infos: string[];
  selectedLayerIndex: number | null;
  selectedLayerOriginalId?: string;
  sources: { [key: string]: SourceWithLayers };
  vectorLayers: VectorLayers;
  spec: any;
  mapView: MapView;
  mapState: MapState;
  maplibreGlDebugOptions: DebugOptions;
  openlayersDebugOptions: OpenLayersDebugOptions;
  isOpen: Record<ModalTypes, boolean>;
  fileHandle: FileSystemFileHandle | null;
  activeSideView: AppSideView;
  setActiveSideView: (view: AppSideView) => void;
  setSelectedLayer: (index: number, originalId?: string) => void;
  clearSelectedLayer: () => void;
  setMapView: (mapView: MapView) => void;
  setMapState: (mapState: MapState) => void;
  toggleModal: (modalName: ModalTypes) => void;
  setModal: (modalName: ModalTypes, value: boolean) => void;
  setModalState: (modalState: Partial<Record<ModalTypes, boolean>>) => void;
  setErrors: (errors: MappedError[]) => void;
  setInfos: (infos: string[]) => void;
  setSources: (sources: { [key: string]: SourceWithLayers }) => void;
  setVectorLayers: (vectorLayers: VectorLayers) => void;
  setSpec: (spec: any) => void;
  setFileHandle: (fileHandle: FileSystemFileHandle | null) => void;
  setMaplibreGlDebugOption: (key: keyof DebugOptions, checked: boolean) => void;
  setOpenlayersDebugOption: (key: keyof OpenLayersDebugOptions, checked: boolean) => void;
};

export const useEditorUiStore = create<EditorUiState>((set) => ({
  errors: [],
  infos: [],
  selectedLayerIndex: 0,
  selectedLayerOriginalId: undefined,
  sources: {},
  vectorLayers: {},
  spec: latest,
  mapView: {
    zoom: 0,
    center: {
      lng: 0,
      lat: 0,
    },
  },
  mapState: "map",
  maplibreGlDebugOptions: {
    showTileBoundaries: false,
    showCollisionBoxes: false,
    showOverdrawInspector: false,
  },
  openlayersDebugOptions: {
    debugToolbox: false,
  },
  isOpen: {
    settings: false,
    sources: false,
    open: false,
    shortcuts: false,
    export: false,
    debug: false,
    globalState: false,
    codeEditor: false,
  },
  fileHandle: null,
  activeSideView: "layers",
  setActiveSideView: (view) => set({ activeSideView: view }),
  setSelectedLayer: (index, originalId) => set({
    selectedLayerIndex: index,
    selectedLayerOriginalId: originalId,
  }),
  clearSelectedLayer: () => set({
    selectedLayerIndex: null,
    selectedLayerOriginalId: undefined,
  }),
  setMapView: (mapView) => set({ mapView }),
  setMapState: (mapState) => set({ mapState }),
  toggleModal: (modalName) => set((state) => ({
    isOpen: {
      ...state.isOpen,
      [modalName]: !state.isOpen[modalName],
    },
  })),
  setModal: (modalName, value) => set((state) => ({
    isOpen: {
      ...state.isOpen,
      [modalName]: value,
    },
  })),
  setModalState: (modalState) => set((state) => ({
    isOpen: {
      ...state.isOpen,
      ...modalState,
    },
  })),
  setErrors: (errors) => set({ errors }),
  setInfos: (infos) => set({ infos }),
  setSources: (sources) => set({ sources }),
  setVectorLayers: (vectorLayers) => set({ vectorLayers }),
  setSpec: (spec) => set({ spec }),
  setFileHandle: (fileHandle) => set({ fileHandle }),
  setMaplibreGlDebugOption: (key, checked) => set((state) => ({
    maplibreGlDebugOptions: {
      ...state.maplibreGlDebugOptions,
      [key]: checked,
    },
  })),
  setOpenlayersDebugOption: (key, checked) => set((state) => ({
    openlayersDebugOptions: {
      ...state.openlayersDebugOptions,
      [key]: checked,
    },
  })),
}));
