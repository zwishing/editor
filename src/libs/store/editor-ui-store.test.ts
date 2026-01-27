import { describe, it, expect, beforeEach } from "vitest";
import { useEditorUiStore } from "./editor-ui-store";

describe("editor-ui-store", () => {
  beforeEach(() => {
    useEditorUiStore.setState(useEditorUiStore.getInitialState(), true);
  });

  it("updates active side view", () => {
    useEditorUiStore.getState().setActiveSideView("settings");
    expect(useEditorUiStore.getState().activeSideView).toBe("settings");
  });

  it("toggles modal visibility", () => {
    const store = useEditorUiStore.getState();
    expect(store.isOpen.debug).toBe(false);
    store.toggleModal("debug");
    expect(useEditorUiStore.getState().isOpen.debug).toBe(true);
    store.setModal("debug", false);
    expect(useEditorUiStore.getState().isOpen.debug).toBe(false);
  });

  it("updates selected layer and clears selection", () => {
    const store = useEditorUiStore.getState();
    store.setSelectedLayer(2, "layer-2");
    expect(useEditorUiStore.getState().selectedLayerIndex).toBe(2);
    expect(useEditorUiStore.getState().selectedLayerOriginalId).toBe("layer-2");
    store.clearSelectedLayer();
    expect(useEditorUiStore.getState().selectedLayerIndex).toBeNull();
    expect(useEditorUiStore.getState().selectedLayerOriginalId).toBeUndefined();
  });

  it("updates map view and map state", () => {
    const store = useEditorUiStore.getState();
    store.setMapView({ zoom: 3, center: { lng: 10, lat: 20 } });
    store.setMapState("inspect");
    expect(useEditorUiStore.getState().mapView.zoom).toBe(3);
    expect(useEditorUiStore.getState().mapView.center.lng).toBe(10);
    expect(useEditorUiStore.getState().mapState).toBe("inspect");
  });

  it("updates errors and infos", () => {
    const store = useEditorUiStore.getState();
    store.setErrors([{ message: "error" }]);
    store.setInfos(["info"]);
    expect(useEditorUiStore.getState().errors).toHaveLength(1);
    expect(useEditorUiStore.getState().infos).toEqual(["info"]);
  });
});
