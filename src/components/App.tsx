import React from "react";
import cloneDeep from "lodash.clonedeep";
import clamp from "lodash.clamp";
import buffer from "buffer";
import get from "lodash.get";
import { unset } from "lodash";
import { arrayMoveMutable } from "array-move";
import hash from "string-hash";
import { PMTiles } from "pmtiles";
import { type Map, type LayerSpecification, type StyleSpecification, type ValidationError, type SourceSpecification } from "maplibre-gl";
import { validateStyleMin } from "@maplibre/maplibre-gl-style-spec";
import latest from "@maplibre/maplibre-gl-style-spec/dist/latest.json";

import MapMaplibreGl from "./MapMaplibreGl";
import MapOpenLayers from "./MapOpenLayers";
import CodeEditor from "./CodeEditor";
import LayerList from "./LayerList";
import LayerEditor from "./LayerEditor";
import { type MapState } from "./AppToolbar";
import toolbar from "../config/toolbar.json";
import AppToolbar from "./AppToolbar";
import AppLayout from "./AppLayout";
import AppIconRail from "./AppIconRail";
import SettingsPanel from "./SettingsPanel";
import SourcesPanel from "./SourcesPanel";
import MessagePanel from "./AppMessagePanel";

import ModalSettings from "./modals/ModalSettings";
import ModalExport from "./modals/ModalExport";
import ModalSources from "./modals/ModalSources";
import ModalOpen from "./modals/ModalOpen";
import ModalShortcuts from "./modals/ModalShortcuts";
import ModalDebug from "./modals/ModalDebug";
import GlobalStatePanel from "./GlobalStatePanel";

import { downloadGlyphsMetadata, downloadSpriteMetadata } from "../libs/metadata";
import style from "../libs/style";
import { undoMessages, redoMessages } from "../libs/diffmessage";
import { createStyleStore, type IStyleStore } from "../libs/store/style-store-factory";
import { RevisionStore } from "../libs/revisions";
import LayerWatcher from "../libs/layerwatcher";
import tokens from "../config/tokens.json";
import isEqual from "lodash.isequal";
import { type MapOptions } from "maplibre-gl";
import { type MappedError, type OnStyleChangedOpts, type StyleSpecificationWithId } from "../libs/definitions";

// Buffer must be defined globally for @maplibre/maplibre-gl-style-spec validate() function to succeed.
window.Buffer = buffer.Buffer;

function setFetchAccessToken(url: string, mapStyle: StyleSpecification) {
  const matchesTilehosting = url.match(/\.tilehosting\.com/);
  const matchesMaptiler = url.match(/\.maptiler\.com/);
  const matchesThunderforest = url.match(/\.thunderforest\.com/);
  const matchesLocationIQ = url.match(/\.locationiq\.com/);
  if (matchesTilehosting || matchesMaptiler) {
    const accessToken = style.getAccessToken("openmaptiles", mapStyle, { allowFallback: true });
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else if (matchesThunderforest) {
    const accessToken = style.getAccessToken("thunderforest", mapStyle, { allowFallback: true });
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else if (matchesLocationIQ) {
    const accessToken = style.getAccessToken("locationiq", mapStyle, { allowFallback: true });
    if (accessToken) {
      return url.replace("{key}", accessToken);
    }
  }
  else {
    return url;
  }
}

function updateRootSpec(spec: any, fieldName: string, newValues: any) {
  return {
    ...spec,
    $root: {
      ...spec.$root,
      [fieldName]: {
        ...spec.$root[fieldName],
        values: newValues
      }
    }
  };
}

type AppSideView = "layers" | "settings" | "sources" | "globalState" | "codeEditor";

type AppState = {
  errors: MappedError[],
  infos: string[],
  mapStyle: StyleSpecificationWithId,
  dirtyMapStyle?: StyleSpecification,
  selectedLayerIndex: number | null,
  selectedLayerOriginalId?: string,
  sources: { [key: string]: SourceSpecification & { layers: string[] } },
  vectorLayers: {},
  spec: any,
  mapView: {
    zoom: number,
    center: {
      lng: number,
      lat: number,
    },
  },
  maplibreGlDebugOptions: Partial<MapOptions> & {
    showTileBoundaries: boolean,
    showCollisionBoxes: boolean,
    showOverdrawInspector: boolean,
  },
  openlayersDebugOptions: {
    debugToolbox: boolean,
  },
  mapState: MapState
  isOpen: {
    settings: boolean
    sources: boolean
    open: boolean
    shortcuts: boolean
    export: boolean
    debug: boolean
    globalState: boolean
    codeEditor: boolean
    [key: string]: boolean
  }
  fileHandle: FileSystemFileHandle | null
  activeSideView: AppSideView
};

export default class App extends React.Component<any, AppState> {
  revisionStore: RevisionStore;
  styleStore: IStyleStore | null = null;
  layerWatcher: LayerWatcher;

  constructor(props: any) {
    super(props);

    this.revisionStore = new RevisionStore();
    this.configureKeyboardShortcuts();

    this.state = {
      errors: [],
      infos: [],
      mapStyle: style.emptyStyle,
      selectedLayerIndex: 0,
      sources: {},
      vectorLayers: {},
      mapState: "map",
      activeSideView: "layers",
      spec: latest,
      mapView: {
        zoom: 0,
        center: {
          lng: 0,
          lat: 0,
        },
      },
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
        codeEditor: false
      },
      fileHandle: null,
    };

    this.layerWatcher = new LayerWatcher({
      onVectorLayersChange: v => this.setState({ vectorLayers: v })
    });
  }

  setSideView = (view: AppSideView) => {
    if (view !== "layers") {
      this.setState({
        activeSideView: view,
        selectedLayerIndex: null,
      }, () => {
        this.setStateInUrl();
      });
    } else {
      this.setState({ activeSideView: view });
    }

    // Keep modals for now if needed, but primarily use panels
    if (view === "codeEditor") {
      this.toggleModal("codeEditor");
    }
    if (view === "globalState") {
      this.toggleModal("globalState");
    }
  }

  toggleModal = (modalName: keyof AppState["isOpen"]) => {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: !this.state.isOpen[modalName]
      }
    });
  };

  configureKeyboardShortcuts = () => {
    const shortcuts = [
      {
        key: "?",
        handler: () => {
          this.toggleModal("shortcuts");
        }
      },
      {
        key: "o",
        handler: () => {
          this.toggleModal("open");
        }
      },
      {
        key: "e",
        handler: () => {
          this.toggleModal("export");
        }
      },
      {
        key: "d",
        handler: () => {
          this.setSideView("sources");
        }
      },
      {
        key: "s",
        handler: () => {
          this.setSideView("settings");
        }
      },
      {
        key: "g",
        handler: () => {
          this.toggleModal("globalState");
        }
      },
      {
        key: "i",
        handler: () => {
          this.setMapState(
            this.state.mapState === "map" ? "inspect" : "map"
          );
        }
      },
      {
        key: "m",
        handler: () => {
          (document.querySelector(".maplibregl-canvas") as HTMLCanvasElement).focus();
        }
      },
      {
        key: "!",
        handler: () => {
          this.toggleModal("debug");
        }
      },
    ];

    document.body.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        (e.target as HTMLElement).blur();
        document.body.focus();
      }
      else if (this.state.isOpen.shortcuts || document.activeElement === document.body) {
        const shortcut = shortcuts.find((shortcut) => {
          return (shortcut.key === e.key);
        });

        if (shortcut) {
          this.setModal("shortcuts", false);
          shortcut.handler();
        }
      }
    });
  };

  handleKeyPress = (e: KeyboardEvent) => {
    if (navigator.platform.toUpperCase().indexOf("MAC") >= 0) {
      if (e.metaKey && e.shiftKey && e.keyCode === 90) {
        e.preventDefault();
        this.onRedo();
      }
      else if (e.metaKey && e.keyCode === 90) {
        e.preventDefault();
        this.onUndo();
      }
    }
    else {
      if (e.ctrlKey && e.keyCode === 90) {
        e.preventDefault();
        this.onUndo();
      }
      else if (e.ctrlKey && e.keyCode === 89) {
        e.preventDefault();
        this.onRedo();
      }
    }
  };

  async componentDidMount() {
    this.styleStore = await createStyleStore((mapStyle, opts) => this.onStyleChanged(mapStyle, opts));
    window.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  }

  saveStyle(snapshotStyle: StyleSpecificationWithId) {
    this.styleStore?.save(snapshotStyle);
  }

  updateFonts(urlTemplate: string) {
    const metadata: { [key: string]: string } = this.state.mapStyle.metadata || {} as any;
    const accessToken = metadata["maputnik:openmaptiles_access_token"] || tokens.openmaptiles;

    const glyphUrl = (typeof urlTemplate === "string") ? urlTemplate.replace("{key}", accessToken) : urlTemplate;
    downloadGlyphsMetadata(glyphUrl).then(fonts => {
      this.setState({ spec: updateRootSpec(this.state.spec, "glyphs", fonts) });
    });
  }

  updateIcons(baseUrl: string) {
    downloadSpriteMetadata(baseUrl).then(icons => {
      this.setState({ spec: updateRootSpec(this.state.spec, "sprite", icons) });
    });
  }

  onChangeMetadataProperty = (property: string, value: any) => {
    // If we're changing renderer reset the map state.
    if (
      property === "maputnik:renderer" &&
      value !== get(this.state.mapStyle, ["metadata", "maputnik:renderer"], "mlgljs")
    ) {
      this.setState({
        mapState: "map"
      });
    }

    const changedStyle = {
      ...this.state.mapStyle,
      metadata: {
        ...(this.state.mapStyle as any).metadata,
        [property]: value
      }
    };

    this.onStyleChanged(changedStyle);
  };

  onStyleChanged = (newStyle: StyleSpecificationWithId, opts: OnStyleChangedOpts = {}): void => {
    opts = {
      save: true,
      addRevision: true,
      initialLoad: false,
      ...opts,
    };

    // For the style object, find the urls that has "{key}" and insert the correct API keys
    // Without this, going from e.g. MapTiler to OpenLayers and back will lose the maptlier key.

    if (newStyle.glyphs && typeof newStyle.glyphs === "string") {
      newStyle.glyphs = setFetchAccessToken(newStyle.glyphs, newStyle);
    }

    if (newStyle.sprite && typeof newStyle.sprite === "string") {
      newStyle.sprite = setFetchAccessToken(newStyle.sprite, newStyle);
    }

    for (const [_sourceId, source] of Object.entries(newStyle.sources)) {
      if (source && "url" in source && typeof source.url === "string") {
        source.url = setFetchAccessToken(source.url, newStyle);
      }
    }


    if (opts.initialLoad) {
      this.getInitialStateFromUrl(newStyle);
    }

    const errors: ValidationError[] = validateStyleMin(newStyle) || [];
    // The validate function doesn't give us errors for duplicate error with
    // empty string for layer.id, manually deal with that here.
    const layerErrors: (Error | ValidationError)[] = [];
    if (newStyle && newStyle.layers) {
      const foundLayers = new global.Map();
      newStyle.layers.forEach((layer, index) => {
        if (layer.id === "" && foundLayers.has(layer.id)) {
          const error = new Error(
            `layers[${index}]: duplicate layer id [empty_string], previously used`
          );
          layerErrors.push(error);
        }
        foundLayers.set(layer.id, true);
      });
    }

    const mappedErrors: MappedError[] = layerErrors.concat(errors).map(error => {
      // Special case: Duplicate layer id
      const dupMatch = error.message.match(/layers\[(\d+)\]: (duplicate layer id "?(.*)"?, previously used)/);
      if (dupMatch) {
        const [, index, message] = dupMatch;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key: "id",
              message,
            }
          }
        };
      }

      // Special case: Invalid source
      const invalidSourceMatch = error.message.match(/layers\[(\d+)\]: (source "(?:.*)" not found)/);
      if (invalidSourceMatch) {
        const [, index, message] = invalidSourceMatch;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key: "source",
              message,
            }
          }
        };
      }

      const layerMatch = error.message.match(/layers\[(\d+)\]\.(?:(\S+)\.)?(\S+): (.*)/);
      if (layerMatch) {
        const [, index, group, property, message] = layerMatch;
        const key = (group && property) ? [group, property].join(".") : property;
        return {
          message: error.message,
          parsed: {
            type: "layer",
            data: {
              index: parseInt(index, 10),
              key,
              message
            }
          }
        };
      }
      else {
        return {
          message: error.message,
        };
      }
    });

    let dirtyMapStyle: StyleSpecification | undefined = undefined;
    if (errors.length > 0) {
      dirtyMapStyle = cloneDeep(newStyle);

      for (const error of errors) {
        const { message } = error;
        if (message) {
          try {
            const objPath = message.split(":")[0];
            // Errors can be deply nested for example 'layers[0].filter[1][1][0]' we only care upto the property 'layers[0].filter'
            const unsetPath = objPath.match(/^\S+?\[\d+\]\.[^[]+/)![0];
            unset(dirtyMapStyle, unsetPath);
          }
          catch (err) {
            console.warn(message + " " + err);
          }
        }
      }
    }

    if (newStyle.glyphs !== this.state.mapStyle.glyphs) {
      this.updateFonts(newStyle.glyphs as string);
    }
    if (newStyle.sprite !== this.state.mapStyle.sprite) {
      this.updateIcons(newStyle.sprite as string);
    }

    if (opts.addRevision) {
      this.revisionStore.addRevision(newStyle);
    }
    if (opts.save) {
      this.saveStyle(newStyle);
    }

    this.setState({
      mapStyle: newStyle,
      dirtyMapStyle: dirtyMapStyle,
      errors: mappedErrors,
    }, () => {
      this.fetchSources();
      this.setStateInUrl();
    });

  };

  onUndo = () => {
    const activeStyle = this.revisionStore.undo();

    const messages = undoMessages(this.state.mapStyle, activeStyle);
    this.onStyleChanged(activeStyle, { addRevision: false });
    this.setState({
      infos: messages,
    });
  };

  onRedo = () => {
    const activeStyle = this.revisionStore.redo();
    const messages = redoMessages(this.state.mapStyle, activeStyle);
    this.onStyleChanged(activeStyle, { addRevision: false });
    this.setState({
      infos: messages,
    });
  };

  onMoveLayer = (move: { oldIndex: number; newIndex: number }) => {
    let { oldIndex, newIndex } = move;
    let layers = this.state.mapStyle.layers;
    oldIndex = clamp(oldIndex, 0, layers.length - 1);
    newIndex = clamp(newIndex, 0, layers.length - 1);
    if (oldIndex === newIndex) return;

    if (oldIndex === this.state.selectedLayerIndex) {
      this.setState({
        selectedLayerIndex: newIndex
      });
    }

    layers = layers.slice(0);
    arrayMoveMutable(layers, oldIndex, newIndex);
    this.onLayersChange(layers);
  };

  onLayersChange = (changedLayers: LayerSpecification[]) => {
    const changedStyle = {
      ...this.state.mapStyle,
      layers: changedLayers
    };
    this.onStyleChanged(changedStyle);
  };

  onLayerDestroy = (index: number) => {
    const layers = this.state.mapStyle.layers;
    const remainingLayers = layers.slice(0);
    remainingLayers.splice(index, 1);
    this.onLayersChange(remainingLayers);
  };

  onLayerCopy = (index: number) => {
    const layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0);

    const clonedLayer = cloneDeep(changedLayers[index]);
    clonedLayer.id = clonedLayer.id + "-copy";
    changedLayers.splice(index, 0, clonedLayer);
    this.onLayersChange(changedLayers);
  };

  onLayerVisibilityToggle = (index: number) => {
    const layers = this.state.mapStyle.layers;
    const changedLayers = layers.slice(0);

    const layer = { ...changedLayers[index] };
    const changedLayout = "layout" in layer ? { ...layer.layout } : {};
    changedLayout.visibility = changedLayout.visibility === "none" ? "visible" : "none";

    layer.layout = changedLayout;
    changedLayers[index] = layer;
    this.onLayersChange(changedLayers);
  };


  onLayerIdChange = (index: number, _oldId: string, newId: string) => {
    const changedLayers = this.state.mapStyle.layers.slice(0);
    changedLayers[index] = {
      ...changedLayers[index],
      id: newId
    };

    this.onLayersChange(changedLayers);
  };

  onLayerChanged = (index: number, layer: LayerSpecification) => {
    const changedLayers = this.state.mapStyle.layers.slice(0);
    changedLayers[index] = layer;

    this.onLayersChange(changedLayers);
  };

  setMapState = (newState: MapState) => {
    this.setState({
      mapState: newState
    }, this.setStateInUrl);
  };

  setDefaultValues = (styleObj: StyleSpecificationWithId) => {
    const metadata: { [key: string]: string } = styleObj.metadata || {} as any;
    if (metadata["maputnik:renderer"] === undefined) {
      const changedStyle = {
        ...styleObj,
        metadata: {
          ...styleObj.metadata as any,
          "maputnik:renderer": "mlgljs"
        }
      };
      return changedStyle;
    } else {
      return styleObj;
    }
  };

  openStyle = (styleObj: StyleSpecificationWithId, fileHandle: FileSystemFileHandle | null) => {
    this.setState({ fileHandle: fileHandle });
    styleObj = this.setDefaultValues(styleObj);
    this.onStyleChanged(styleObj);
  };

  async fetchSources() {
    const sourceList: { [key: string]: SourceSpecification & { layers: string[] } } = {};
    for (const key of Object.keys(this.state.mapStyle.sources)) {
      const source = this.state.mapStyle.sources[key];
      if (source.type !== "vector" || !("url" in source)) {
        sourceList[key] = this.state.sources[key] || { ...this.state.mapStyle.sources[key] };
        if (sourceList[key].layers === undefined) {
          sourceList[key].layers = [];
        }
      } else {
        sourceList[key] = {
          type: source.type,
          layers: []
        };

        let url = source.url;

        try {
          url = setFetchAccessToken(url!, this.state.mapStyle);
        } catch (err) {
          console.warn("Failed to setFetchAccessToken: ", err);
        }

        const setVectorLayers = (json: any) => {
          if (!Object.prototype.hasOwnProperty.call(json, "vector_layers")) {
            return;
          }

          for (const layer of json.vector_layers) {
            sourceList[key].layers.push(layer.id);
          }
        };

        try {
          if (url!.startsWith("pmtiles://")) {
            const json = await (new PMTiles(url!.substring(10))).getTileJson("");
            setVectorLayers(json);
          } else {
            const response = await fetch(url!, { mode: "cors" });
            const json = await response.json();
            setVectorLayers(json);
          }
        } catch (err) {
          console.error(`Failed to process source for url: '${url}', ${err}`);
        }
      }
    }

    if (!isEqual(this.state.sources, sourceList)) {
      console.debug("Setting sources", sourceList);
      this.setState({
        sources: sourceList
      });
    }
  }

  _getRenderer() {
    const metadata: { [key: string]: string } = this.state.mapStyle.metadata || {} as any;
    return metadata["maputnik:renderer"] || "mlgljs";
  }

  onMapChange = (mapView: {
    zoom: number,
    center: {
      lng: number,
      lat: number,
    },
  }) => {
    this.setState({
      mapView,
    });
  };

  mapRenderer() {
    const { mapStyle, dirtyMapStyle } = this.state;

    const mapProps = {
      mapStyle: (dirtyMapStyle || mapStyle),
      replaceAccessTokens: (mapStyle: StyleSpecification) => {
        return style.replaceAccessTokens(mapStyle, {
          allowFallback: true
        });
      },
      onDataChange: (e: { map: Map }) => {
        this.layerWatcher.analyzeMap(e.map);
        this.fetchSources();
      },
    };

    const renderer = this._getRenderer();

    let mapElement;

    // Check if OL code has been loaded?
    if (renderer === "ol") {
      mapElement = <MapOpenLayers
        {...mapProps}
        onChange={this.onMapChange}
        debugToolbox={this.state.openlayersDebugOptions.debugToolbox}
        onLayerSelect={(layerId) => this.onLayerSelect(+layerId)}
      />;
    } else {

      mapElement = <MapMaplibreGl {...mapProps}
        onChange={this.onMapChange}
        options={this.state.maplibreGlDebugOptions}
        inspectModeEnabled={this.state.mapState === "inspect"}
        highlightedLayer={this.state.mapStyle.layers[this.state.selectedLayerIndex]}
        onLayerSelect={this.onLayerSelect} />;
    }

    let filterName;
    if (this.state.mapState.match(/^filter-/)) {
      filterName = this.state.mapState.replace(/^filter-/, "");
    }
    const elementStyle: { filter?: string } = {};
    if (filterName) {
      elementStyle.filter = `url('#${filterName}')`;
    }

    return <div style={elementStyle} className="maputnik-map__container" data-wd-key="maplibre:container">
      {mapElement}
    </div>;
  }

  setStateInUrl = () => {
    const { mapState, mapStyle, isOpen } = this.state;
    const { selectedLayerIndex } = this.state;
    const url = new URL(location.href);
    const hashVal = hash(JSON.stringify(mapStyle));
    url.searchParams.set("layer", `${hashVal}~${selectedLayerIndex}`);

    const openModals = Object.entries(isOpen)
      .map(([key, val]) => (val === true ? key : null))
      .filter(val => val !== null);

    if (openModals.length > 0) {
      url.searchParams.set("modal", openModals.join(","));
    }
    else {
      url.searchParams.delete("modal");
    }

    if (mapState === "map") {
      url.searchParams.delete("view");
    }
    else if (mapState === "inspect") {
      url.searchParams.set("view", "inspect");
    }

    history.replaceState({ selectedLayerIndex }, "Maputnik", url.href);
  };

  getInitialStateFromUrl = (mapStyle: StyleSpecification) => {
    const url = new URL(location.href);
    const modalParam = url.searchParams.get("modal");

    if (modalParam && modalParam !== "") {
      const modals = modalParam.split(",");
      const modalObj: { [key: string]: boolean } = {};
      modals.forEach(modalName => {
        modalObj[modalName] = true;
      });

      this.setState({
        isOpen: {
          ...this.state.isOpen,
          ...modalObj,
        }
      });
    }

    const view = url.searchParams.get("view");
    if (view && view !== "") {
      this.setMapState(view as MapState);
    }

    const path = url.searchParams.get("layer");
    if (path) {
      try {
        const parts = path.split("~");
        const [hashVal, selectedLayerIndex] = [
          parts[0],
          parseInt(parts[1], 10),
        ];

        let valid = true;
        if (hashVal !== "-") {
          const currentHashVal = hash(JSON.stringify(mapStyle));
          if (currentHashVal !== parseInt(hashVal, 10)) {
            valid = false;
          }
        }
        if (valid && mapStyle.layers[selectedLayerIndex]) {
          this.setState({
            selectedLayerIndex,
            selectedLayerOriginalId: mapStyle.layers[selectedLayerIndex].id,
          });
        }
      }
      catch (err) {
        console.warn(err);
      }
    }
  };

  onLayerSelect = (index: number) => {
    this.setState({
      selectedLayerIndex: index,
      selectedLayerOriginalId: this.state.mapStyle.layers[index].id,
    }, this.setStateInUrl);
  };

  onLayerClose = () => {
    this.setState({
      selectedLayerIndex: null,
      selectedLayerOriginalId: undefined, // Clear the ID
    }, this.setStateInUrl);
  };

  setModal(modalName: keyof AppState["isOpen"], value: boolean) {
    this.setState({
      isOpen: {
        ...this.state.isOpen,
        [modalName]: value
      }
    }, this.setStateInUrl);
  }

  render() {
    const { isOpen, mapStyle } = this.state;
    // LayerList needs sources from state
    const { sources, errors, selectedLayerIndex } = this.state;

    const sidePanelContent = (() => {
      switch (this.state.activeSideView) {
        case "layers":
          return <LayerList
            onMoveLayer={this.onMoveLayer}
            onLayerDestroy={this.onLayerDestroy}
            onLayerCopy={this.onLayerCopy}
            onLayerVisibilityToggle={this.onLayerVisibilityToggle}
            onLayersChange={this.onLayersChange}
            onLayerChanged={this.onLayerChanged}
            onLayerIdChange={this.onLayerIdChange}
            onLayerSelect={this.onLayerSelect}
            selectedLayerIndex={selectedLayerIndex}
            layers={mapStyle.layers}
            sources={sources}
            errors={errors}
          />;
        case "settings":
          return <SettingsPanel
            mapStyle={mapStyle}
            onStyleChanged={this.onStyleChanged}
            onChangeMetadataProperty={this.onChangeMetadataProperty}
          />;
        case "sources":
          return <SourcesPanel
            mapStyle={mapStyle}
            onStyleChanged={this.onStyleChanged}
          />;
        case "globalState":
          // @ts-ignore
          return <GlobalStatePanel
            mapStyle={mapStyle}
            onStyleChanged={this.onStyleChanged}
          />
        case "codeEditor":
          // @ts-ignore
          return <CodeEditor
            value={mapStyle}
            onChange={this.onStyleChanged}
          // onClose prop removed from component
          />
        default:
          return null;
      }
    })();

    const modals = [
      <ModalSettings
        key="modal-settings"
        isOpen={isOpen.settings}
        onOpenToggle={() => this.toggleModal("settings")}
        onStyleChanged={this.onStyleChanged}
        mapStyle={mapStyle}
        onChangeMetadataProperty={this.onChangeMetadataProperty}
      />,
      <ModalExport
        key="modal-export"
        isOpen={isOpen.export}
        onOpenToggle={() => this.toggleModal("export")}
        mapStyle={mapStyle}
        onStyleChanged={this.onStyleChanged}
      />,
      <ModalSources
        key="modal-sources"
        isOpen={isOpen.sources}
        onOpenToggle={() => this.toggleModal("sources")}
        mapStyle={mapStyle}
        onStyleChanged={this.onStyleChanged}
      />,
      <ModalOpen
        key="modal-open"
        isOpen={isOpen.open}
        onOpenToggle={() => this.toggleModal("open")}
        onStyleOpen={this.openStyle}
      />,
      <ModalShortcuts
        key="modal-shortcuts"
        isOpen={isOpen.shortcuts}
        onOpenToggle={() => this.toggleModal("shortcuts")}
      />,
      <ModalDebug
        key="modal-debug"
        renderer={this._getRenderer()}
        mapView={this.state.mapView}
        isOpen={isOpen.debug}
        onOpenToggle={() => this.toggleModal("debug")}
        maplibreGlDebugOptions={this.state.maplibreGlDebugOptions}
        openlayersDebugOptions={this.state.openlayersDebugOptions}
        onChangeMaplibreGlDebug={this.onChangeMaplibreGlDebug}
        onChangeOpenlayersDebug={this.onChangeOpenlayersDebug}
      />
    ];

    // Note: ModalCodeEditor was not in imports in the original file I saw?
    // Let me check imports. codeEditor logic was:
    // <ToolbarAction wdKey="nav:code-editor" onClick={() => this.props.onToggleModal("codeEditor")}>
    // And in render?
    // It seems CodeEditor might have been displayed separately?
    // Original render had:
    // { this.state.isOpen.codeEditor && <CodeEditor ... /> }
    // I should check that.

    // For now I will put CodeEditor in the bottom panel or similar if active.

    // Actually, let's restore the original layout logic but adapted.
    // The original layout used AppLayout.

    return <AppLayout
      toolbar={
        <AppToolbar
          mapStyle={mapStyle}
          onStyleChanged={this.onStyleChanged}
          onToggleModal={this.toggleModal}
          mapState={this.state.mapState}
          setMapState={this.setMapState}
        />
      }
      iconRail={
        <AppIconRail
          activeView={this.state.activeSideView as any}
          activeModal={null}
          onViewChange={(view) => this.setSideView(view)}
          onToggleModal={(name) => {
            if (name === "settings" || name === "sources" || name === "globalState" || name === "codeEditor") {
              this.setSideView(name);
            } else {
              this.toggleModal(name as any);
            }
          }}
        />
      }
      layerList={sidePanelContent || <div></div>}
      listClassName={
        this.state.activeSideView === "codeEditor" ? "maputnik-layout-list--extra-wide" :
          this.state.activeSideView !== "layers" ? "maputnik-layout-list--wide" : ""
      }
      layerEditor={
        (selectedLayerIndex !== null && selectedLayerIndex >= 0 && selectedLayerIndex < mapStyle.layers.length) &&
        <LayerEditor
          layer={mapStyle.layers[selectedLayerIndex]}
          layerIndex={selectedLayerIndex}
          onLayerChanged={this.onLayerChanged}
          sources={sources}
          vectorLayers={this.state.vectorLayers}
          spec={this.state.spec}
          onLayerIdChange={this.onLayerIdChange}
          onLayerDestroy={this.onLayerDestroy}
          isFirstLayer={selectedLayerIndex === 0}
          isLastLayer={selectedLayerIndex === mapStyle.layers.length - 1}
          onMoveLayer={this.onMoveLayer}
          onLayerCopy={this.onLayerCopy}
          onLayerVisibilityToggle={this.onLayerVisibilityToggle}
          onClose={this.onLayerClose}
          errors={errors}
        />
      }
      map={this.mapRenderer()}
      bottom={null}
      modals={modals}
    />;
  }
}
