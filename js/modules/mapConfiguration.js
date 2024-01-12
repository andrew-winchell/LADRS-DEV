define([
    "esri/views/MapView",
    "esri/views/SceneView",
    "js/modules/layers.js"
], (MapView, SceneView, layersModule) => {

    const map = layersModule.map;

    const mapView = new MapView({
        map: map,
        container: "view-div",
        zoom: 3,
        center: [-97, 39],
        popupEnabled: true,
        popup: { // popup options when any feature layer is clicked on the map
            dockEnabled: true,
            dockOptions: {
                position: "bottom-right",
                breakpoint: false
            }
        }
    });

    const sceneView = new SceneView({
        map: map,
        container: "inset-div",
        popupEnabled: true,
        popup: { // popup options when any feature layer is clicked on the map
            dockEnabled: true,
            dockOptions: {
                position: "bottom-right",
                breakpoint: false
            }
        }
    });

    return {
        mapView: mapView,
        sceneView: sceneView,
        activeView: map,
        container: "view-div"
    };
    
});