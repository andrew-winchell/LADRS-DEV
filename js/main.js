require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/views/SceneView",
    "esri/WebScene",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/smartMapping/statistics/uniqueValues",
    "esri/layers/ElevationLayer",
    "esri/views/draw/Draw",
    "esri/widgets/LayerList",
    "esri/widgets/Sketch",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Editor",
    "esri/geometry/support/webMercatorUtils",
    "esri/widgets/Compass",
    "esri/geometry/Multipoint",
    "esri/geometry/Polyline",
    "esri/geometry/Point",
    "esri/geometry/geometryEngine",
    "esri/widgets/ElevationProfile",
    "esri/core/reactiveUtils",
    "esri/geometry/support/geodesicUtils",
    "esri/Basemap",
    "esri/rest/support/BufferParameters",
    "esri/rest/geometryService"
], (
        Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, WebScene, Map, MapView, Graphic, GraphicsLayer,
        FeatureLayer, uniqueValues, ElevationLayer, Draw, LayerList, Sketch, SketchViewModel, Search,
        BasemapGallery, Expand, Editor, webMercatorUtils, Compass, Multipoint, Polyline, Point,
        geometryEngine, ElevationProfile, reactiveUtils, geodesicUtils, Basemap, BufferParameters, geometryService
    ) => {

        //#region ArcGIS Online User Authentication

        const info = new OAuthInfo({
            appId: "aKPEKesRDLD9a30U",
            portalUrl: "https://cobecconsulting.maps.arcgis.com",
            authNamespace: "portal_oauth_inline",
            flowType: "auto",
            popup: false
        });
        esriId.registerOAuthInfos([info]);
        esriId.getCredential(info.portalUrl + "/sharing");
        esriId.checkSignInStatus(info.portalUrl + "/sharing")
            .then(() => {
                console.log("Sign In Successful.");
            }).catch(() => {
                console.log("User not signed in.")
            });

        //#endregion

        //#region AGOL Hosted Feature Layers

        const airportsLyr = new FeatureLayer ({
            url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0",
            title: "Airports",
            outFields: [
                "IDENT",
                "ICAO_ID",
                "NAME",
                "TYPE_CODE",
                "MIL_CODE",
                "SERVCITY",
                "STATE"
            ],
            elevationInfo: {
                mode: "on-the-ground"
            },
            popupTemplate: {
                title: "Airports",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "IDENT",
                                label: "Identifier"
                            },
                            {
                                fieldName: "TYPE_CODE",
                                label: "Type"
                            },
                            {
                                fieldName: "MIL_CODE",
                                label: "Military Code"
                            },
                            {
                                fieldName: "NAME",
                                label: "Name"
                            }
                        ]
                    }
                ]
            },
            renderer: {
                type: "unique-value",
                field: "TYPE_CODE",
                uniqueValueInfos: [
                    {
                        label: "Aerodrome",
                        value: "AD",
                        symbol: {
                            type: "picture-marker",
                            url: "media/aerodrome_civil.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "15px"
                        }
                    },
                    {
                        label: "Heliport",
                        value: "HP",
                        symbol: {
                            type: "picture-marker",
                            url: "media/heliport.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "15px"
                        }
                    },
                    {
                        label: "Seaplane Base",
                        value: "SP",
                        symbol: {
                            type: "picture-marker",
                            url: "media/seaplane_base.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "17.1875px"
                        }
                    },
                    {
                        label: "Ultralite",
                        value: "UL",
                        symbol: {
                            type: "picture-marker",
                            url: "media/ultralite_port.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "15px"
                        }
                    },
                    {
                        label: "Glider",
                        value: "GL",
                        symbol: {
                            type: "picture-marker",
                            url: "media/gliderport.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "15px"
                        }
                    },
                    {
                        label: "Balloonport",
                        value: "BP",
                        symbol: {
                            type: "picture-marker",
                            url: "media/balloonport.png",
                            contentType: "image/png",
                            width: "15px",
                            height: "15px"
                        }
                    }
                ]
            },
            minScale: 2500000
        });
    
        const classAirspaceLyr = new FeatureLayer ({
            url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0",
            definitionExpression: "LOCAL_TYPE = 'CLASS_B' OR LOCAL_TYPE = 'CLASS_C' OR LOCAL_TYPE = 'CLASS_D'",
            outFields: [
                "IDENT",
                "ICAO_ID",
                "NAME",
                "TYPE_CODE",
                "CLASS",
                "LOCAL_TYPE",
                "LOWER_VAL",
                "UPPER_VAL"
            ],
            popupTemplate: {
                title: "Class Airspace",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "IDENT",
                                label: "Identifier"
                            },
                            {
                                fieldName: "TYPE_CODE",
                                label: "Type"
                            },
                            {
                                fieldName: "LOCAL_TYPE",
                                label: "Local Type"
                            },
                            {
                                fieldName: "ICAO_ID",
                                label: "ICAO ID"
                            }
                        ]
                    }
                ]
            },
            visible: false
        });
    
        const fixesLyr = new FeatureLayer ({
            url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/FIX_BASE/FeatureServer/0",
            title: "Fixes",
            popupTemplate: {
                title: "Fixes",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "FIX_ID",
                                label: "Identifier"
                            },
                            {
                                fieldName: "FIX_USE_CODE",
                                label: "Type"
                            }
                        ]
                    }
                ]
            },
            renderer: {
                type: "unique-value",
                field: "FIX_USE_CODE",
                defaultSymbol: {
                    type: "simple-marker",
                    size: 4,
                    color: [0, 0, 0]
                },
                uniqueValueInfos: [
                    {
                        label: "Regular Public Transport",
                        value: "RP",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [255, 0, 0]
                        }
                    },
                    {
                        label: "Waypoint",
                        value: "WP",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [255, 180, 0]
                        }
                    },
                    {
                        label: "MR",
                        value: "MR",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [200, 200, 200]
                        }
                    },
                    {
                        label: "Navigation Reference System",
                        value: "NRS",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [255, 0, 0]
                        }
                    },
                    {
                        label: "MW",
                        value: "MW",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [255, 158, 244]
                        }
                    },
                    {
                        label: "Computer Navigation Fix",
                        value: "CN",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [181, 0, 161]
                        }
                    },
                    {
                        label: "RADAR",
                        value: "RADAR",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [0, 207, 3]
                        }
                    },
                    {
                        label: "VFR",
                        value: "VFR",
                        symbol: {
                            type: "simple-marker",
                            size: 4,
                            color: [33, 52, 255]
                        }
                    }
                ]
            },
            minScale: 1500000
        });
    
        const navaidsLyr = new FeatureLayer ({
            url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/NAVAIDSystem/FeatureServer/0",
            title: "NAVAIDS",
            popupTemplate: {
                title: "NAVAIDS",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "IDENT",
                                label: "Identifier"
                            },
                            {
                                fieldName: "CHANNEL",
                                label: "Channel"
                            },
                            {
                                fieldName: "NAS_USE",
                                label: "NAS Use"
                            },
                            {
                                fieldName: "US_LOW",
                                label: "US LOW"
                            },
                            {
                                fieldName: "US_HIGH",
                                label: "US HIGH"
                            }
                        ]
                    }
                ]
            },
            elevationInfo: {
                mode: "on-the-ground"
            },
            minScale: 1500000
        });
    
        const obstaclesLyr = new FeatureLayer ({
            url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Digital_Obstacle_File/FeatureServer/0",
            title: "Obstacles",
            popupTemplate: {
                title: "Obstacles",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "Type_Code",
                                label: "Type"
                            },
                            {
                                fieldName: "OAS_Number",
                                label: "OAS Number"
                            },
                            {
                                fieldName: "Quantity",
                                label: "Quantity"
                            },
                            {
                                fieldName: "AMSL",
                                label: "AMSL"
                            }
                        ]
                    }
                ]
            },
            renderer: {
                type: "simple",
                symbol: {
                    type: "picture-marker",
                    url: "media/obstacle.png",
                    contentType: "image/png",
                    width: "12px",
                    height: "18.33px"
                }
            },
            labelingInfo: {
                symbol: {
                    type: "text",
                    color: "black",
                    font: {
                        family: "Playfair Display",
                        size: 10,
                        weight: "normal"
                    }
                },
                labelPlacement: "above-center",
                labelExpressionInfo: {
                    expression: "$feature.AMSL + TextFormatting.NewLine + '(' + $feature.AGL + ')'"
                }
            },
            minScale: 500000,
            visible: false 
        });
    
        const vertiportsLyr = new FeatureLayer ({
            url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/Vertiport/FeatureServer/0",
            title: "Vertiports",
            popupTemplate: {
                title: "Vertiport",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "Name",
                                label: "Name"
                            }
                        ]
                    }
                ]
            },
            renderer: {
                type: "simple",
                symbol: {
                    type: "picture-marker",
                    url: "media/vertiport.png",
                    contentType: "image/png",
                    width: "15px",
                    height: "15px"
                }
            },
            minScale: 2500000,
            definitionExpression: "Program = 'Archer'"
        });
    
        const existingRoutesLyr = new FeatureLayer ({
            url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/LADRS_Routes/FeatureServer/0",
            title: "Existing Routes",
            renderer: {
                type: "unique-value",
                field: "OBJECTID",
                defaultSymbol: {
                    type: "simple-line",
                    color: "gray",
                    width: 2
                },
                uniqueValueInfos: []
            },
            popupTemplate: {
                title: "{route_name}",
                content: [
                    {
                        type: "fields",
                        fieldInfos: [
                            {
                                fieldName: "route_name",
                                label: "Name"
                            },
                            {
                                fieldName: "departing_fac",
                                label: "Departure Facility"
                            },
                            {
                                fieldName: "arriving_facility",
                                label: "Arrival Facility"
                            },
                            {
                                fieldName: "route_distance",
                                label: "Distance"
                            }
                        ]
                    }
                ],
                actions: [
                    {
                        title: "Edit Route",
                        id: "edit-attributes",
                        className: "esri-icon-edit"
                    }
                ]
            },
            definitionExpression: "1=0"
        });

        //#endregion

        //#region Client Side Graphics

        const lineGraphicsLyr = new GraphicsLayer ({
            title: "Proposed Path",
            graphics: []
        });

        const pointGraphicsLyr = new GraphicsLayer ({
            title: "Proposed Vertices",
            graphics: []
        });

        const routeBuffer = new GraphicsLayer ({
            title: "Route Protection - 0.6nm",
            graphics: []
        });

        //#endregion

        //#region Map View Configurations

        const map = new Map ({
            basemap: "gray-vector",
            ground: "world-elevation",
            layers: [
                navaidsLyr,
                obstaclesLyr,
                fixesLyr,
                airportsLyr,
                classAirspaceLyr,
                vertiportsLyr,
                existingRoutesLyr,
                routeBuffer
            ]
        });

        const mapView = new MapView ({
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

        const sceneView = new SceneView ({
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

        const appConfig = {
            mapView: mapView,
            sceneView: sceneView,
            activeView: mapView,
            container: "view-div"
        };

        //#endregion

        //#region Layer Filters

        let routeSelection = document.createElement("calcite-combobox");
        routeSelection.setAttribute("id", "route-filter-value");
        routeSelection.setAttribute("placeholder", "Filter Value");
        routeSelection.setAttribute("max-items", "5");
        routeSelection.setAttribute("scale", "s");
        let routeSwitchLabel = document.createElement("calcite-label");
        routeSwitchLabel.setAttribute("layout", "inline");
        let routeSwitch = document.createElement("calcite-switch");
        routeSwitch.setAttribute("class", "filter-switch");
        routeSwitch.setAttribute("id", "route-filter-switch");
        routeSwitchLabel.appendChild(routeSwitch);
        let routeFilterNode = [routeSelection, routeSwitchLabel]

        // Airports Filter
        let airportFieldSelect = document.createElement("calcite-combobox");
        airportFieldSelect.setAttribute("id", "airport-field-select");
        airportFieldSelect.setAttribute("class", "filter-field-dropdown");
        airportFieldSelect.setAttribute("scale", "s");
        airportFieldSelect.setAttribute("placeholder", "Select a field");
        airportFieldSelect.setAttribute("selection-mode", "single");
        airportFieldSelect.setAttribute("max-items", "3");
        let airportFieldType = document.createElement("calcite-combobox-item");
        airportFieldType.setAttribute("value", "TYPE_CODE");
        airportFieldType.setAttribute("text-label", "Type");
        let airportFieldState = document.createElement("calcite-combobox-item");
        airportFieldState.setAttribute("value", "STATE");
        airportFieldState.setAttribute("text-label", "State");
        let airportFieldMil = document.createElement("calcite-combobox-item");
        airportFieldMil.setAttribute("value", "MIL_CODE");
        airportFieldMil.setAttribute("text-label", "Military Use");
        airportFieldSelect.appendChild(airportFieldType);
        airportFieldSelect.appendChild(airportFieldState);
        airportFieldSelect.appendChild(airportFieldMil);
        let airportFilterValue = document.createElement("calcite-combobox");
        airportFilterValue.setAttribute("id", "airport-filter-value");
        airportFilterValue.setAttribute("scale", "s");
        airportFilterValue.setAttribute("placeholder", "Filter Value");
        airportFilterValue.setAttribute("max-items", "3");
        let airportSwitchLabel = document.createElement("calcite-label");
        airportSwitchLabel.setAttribute("layout", "inline");
        let airportSwitch = document.createElement("calcite-switch");
        airportSwitch.setAttribute("class", "filter-switch");
        airportSwitch.setAttribute("id", "airport-filter-switch");
        airportSwitchLabel.appendChild(airportSwitch);
        let airportFilterNode = [airportFieldSelect, airportFilterValue, airportSwitchLabel];

        airportFieldSelect.addEventListener("calciteComboboxChange", (change) => {
            $("#airport-filter-value").empty();
                let field = change.target.value;
                uniqueValues({
                    layer: airportsLyr,
                    field: field
                }).then((response) => {
                    let unique = [];
                    response.uniqueValueInfos.forEach((val) => {
                        unique.push(val.value);
                    });
                    unique.sort();
                    for (let item of unique) {
                        $("#airport-filter-value").append(
                            "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                        );
                    }
                });
        });

        airportFilterValue.addEventListener("calciteComboboxChange", (selection) => {
            let fieldSelect = $("#airport-field-select")[0]
            let field = fieldSelect.value;
            let value = selection.target.value;
            let valueList = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valueList.push("'" + v + "'");
                }
            } else {
                value = "'" + value + "'";
                valueList.push(value)
            }
            if (airportSwitch.checked == true) {
                mapView.whenLayerView(airportsLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " IN (" + valueList + ")"
                    }
                })
            }
        });

        airportSwitch.addEventListener("calciteSwitchChange", (toggle) => {
            let field = $("#airport-field-select")[0].value;
            let value = $("#airport-filter-value")[0].value;
            if (toggle.target.checked == true) {
                mapView.whenLayerView(airportsLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " = '" + value + "'"
                    }
                });
            } else if (toggle.target.checked == false) {
                mapView.whenLayerView(airportsLyr).then((layerView) => {
                    layerView.filter = {
                        where: "1=1"
                    }
                });
            }
        });

        // Airspace Filter
        let airspaceFieldSelect = document.createElement("calcite-combobox");
        airspaceFieldSelect.setAttribute("id", "airspace-field-select");
        airspaceFieldSelect.setAttribute("class", "filter-field-dropdown");
        airspaceFieldSelect.setAttribute("scale", "s");
        airspaceFieldSelect.setAttribute("placeholder", "Select a field");
        airspaceFieldSelect.setAttribute("selection-mode", "single");
        airspaceFieldSelect.setAttribute("max-items", "3");
        let airspaceFieldClass = document.createElement("calcite-combobox-item");
        airspaceFieldClass.setAttribute("value", "CLASS");
        airspaceFieldClass.setAttribute("text-label", "Class");
        airspaceFieldSelect.appendChild(airspaceFieldClass)
        let airspaceFilterValue = document.createElement("calcite-combobox");
        airspaceFilterValue.setAttribute("id", "airspace-filter-value");
        airspaceFilterValue.setAttribute("scale", "s");
        airspaceFilterValue.setAttribute("placeholder", "Filter Value");
        airspaceFilterValue.setAttribute("max-items", "3");
        let airspaceSwitchLabel = document.createElement("calcite-label");
        airspaceSwitchLabel.setAttribute("layout", "inline");
        let airspaceSwitch = document.createElement("calcite-switch");
        airspaceSwitch.setAttribute("class", "filter-switch");
        airspaceSwitch.setAttribute("id", "airspace-filter-switch");
        airspaceSwitchLabel.appendChild(airspaceSwitch);
        let airspaceFilterNode = [airspaceFieldSelect, airspaceFilterValue, airspaceSwitchLabel];

        airspaceFieldSelect.addEventListener("calciteComboboxChange", (change) => {
            $("#airspace-filter-value").empty();
            let field = change.target.value;
            uniqueValues({
                layer: classAirspaceLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#airspace-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });

        airspaceFilterValue.addEventListener("calciteComboboxChange", (selection) => {
            let fieldSelect = $("#airspace-field-select")[0]
            let field = fieldSelect.value;
            let value = selection.target.value;
            let valueList = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valueList.push("'" + v + "'");
                }
            } else {
                value = "'" + value + "'";
                valueList.push(value);
            }
            if (airspaceSwitch.checked == true) {
                mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " IN (" + valueList + ")"
                    }
                })
            }
        });

        airspaceSwitch.addEventListener("calciteSwitchChange", (toggle) => {
            let field = $("#airspace-field-select")[0].value;
            let value = $("#airspace-filter-value")[0].value;
            let valueList = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valueList.push("'" + v + "'");
                }
            } else {
                value = "'" + value + "'";
                valueList.push(value);
            }
            if (toggle.target.checked == true) {
                mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " IN (" + valueList + ")"
                    }
                });
            } else if (toggle.target.checked == false) {
                mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                    layerView.filter = {
                        where: "1=1"
                    }
                });
            }
        });

        // Fixes Filter
        let fixesFieldSelect = document.createElement("calcite-combobox");
        fixesFieldSelect.setAttribute("id", "fixes-field-select");
        fixesFieldSelect.setAttribute("class", "filter-field-dropdown");
        fixesFieldSelect.setAttribute("scale", "s");
        fixesFieldSelect.setAttribute("placeholder", "Select a field");
        fixesFieldSelect.setAttribute("selection-mode", "single");
        fixesFieldSelect.setAttribute("max-items", "3");
        let fixesFilterValue = document.createElement("calcite-combobox");
        fixesFilterValue.setAttribute("id", "fixes-filter-value");
        fixesFilterValue.setAttribute("scale", "s");
        fixesFilterValue.setAttribute("placeholder", "Filter Value");
        fixesFilterValue.setAttribute("max-items", "3");
        let fixesSwitchLabel = document.createElement("calcite-label");
        fixesSwitchLabel.setAttribute("layout", "inline");
        let fixesSwitch = document.createElement("calcite-switch");
        fixesSwitch.setAttribute("class", "filter-switch");
        fixesSwitch.setAttribute("id", "fixes-filter-switch");
        fixesSwitchLabel.appendChild(fixesSwitch);
        let fixesFilterNode = [fixesFieldSelect, fixesFilterValue, fixesSwitchLabel];

        // NAVAIDS Filter
        let navaidsFieldSelect = document.createElement("calcite-combobox");
        navaidsFieldSelect.setAttribute("id", "navaids-field-select");
        navaidsFieldSelect.setAttribute("class", "filter-field-dropdown");
        navaidsFieldSelect.setAttribute("scale", "s");
        navaidsFieldSelect.setAttribute("placeholder", "Select a field");
        navaidsFieldSelect.setAttribute("selection-mode", "single");
        navaidsFieldSelect.setAttribute("max-items", "3");
        let navaidsFieldClass = document.createElement("calcite-combobox-item");
        navaidsFieldClass.setAttribute("value", "CLASS_TXT");
        navaidsFieldClass.setAttribute("text-label", "Class");
        navaidsFieldSelect.appendChild(navaidsFieldClass)
        let navaidsFilterValue = document.createElement("calcite-combobox");
        navaidsFilterValue.setAttribute("id", "navaids-filter-value");
        navaidsFilterValue.setAttribute("scale", "s");
        navaidsFilterValue.setAttribute("placeholder", "Filter Value");
        navaidsFilterValue.setAttribute("max-items", "3");
        let navaidsSwitchLabel = document.createElement("calcite-label");
        navaidsSwitchLabel.setAttribute("layout", "inline");
        let navaidsSwitch = document.createElement("calcite-switch");
        navaidsSwitch.setAttribute("class", "filter-switch");
        navaidsSwitch.setAttribute("id", "navaids-filter-switch");
        navaidsSwitchLabel.appendChild(navaidsSwitch);
        let navaidsFilterNode = [navaidsFieldSelect, navaidsFilterValue, navaidsSwitchLabel];

        navaidsFieldSelect.addEventListener("calciteComboboxChange", (change) => {
            $("#navaids-filter-value").empty();
            let field = change.target.value;
            uniqueValues({
                layer: navaidsLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#navaids-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });

        navaidsFilterValue.addEventListener("calciteComboboxChange", (selection) => {
            let fieldSelect = $("#navaids-field-select")[0]
            let field = fieldSelect.value;
            let value = selection.target.value;
            let valueList = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valueList.push("'" + v + "'");
                }
            } else {
                value = "'" + value + "'";
                valueList.push(value);
            }
            if (navaidsSwitch.checked == true) {
                mapView.whenLayerView(navaidsLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " IN (" + valueList + ")"
                    }
                })
            }
        });

        navaidsSwitch.addEventListener("calciteSwitchChange", (toggle) => {
            let field = $("#navaids-field-select")[0].value;
            let value = $("#navaids-filter-value")[0].value;
            let valueList = [];
            if (Array.isArray(value)) {
                for (let v of value) {
                    valueList.push("'" + v + "'");
                }
            } else {
                value = "'" + value + "'";
                valueList.push(value);
            }
            if (toggle.target.checked == true) {
                mapView.whenLayerView(navaidsLyr).then((layerView) => {
                    layerView.filter = {
                        where: field + " IN (" + valueList + ")"
                    }
                });
            } else if (toggle.target.checked == false) {
                mapView.whenLayerView(navaidsLyr).then((layerView) => {
                    layerView.filter = {
                        where: "1=1"
                    }
                });
            }
        });

        //#endregion
    
        //#region Map Widgets

        // After map load, create a customized Layer List widget
        // Place in left pane layer-list div
        // Add custom actions for legend and item details
        let layerList;

        mapView.when(() => {
            layerList = new LayerList({
                view: mapView,
                container: "layer-list",
                listItemCreatedFunction: (event) => {
                    const item = event.item;
                    if (item.layer.url != null) {
                        item.actionsSections = [
                            [
                                {
                                    title: "Legend",
                                    className: "esri-icon-legend",
                                    id: "item-legend"
                                },
                                {
                                    title: "Filter",
                                    className: "esri-icon-filter",
                                    id: "item-filter"
                                },
                                {
                                    title: "Item Details",
                                    className: "esri-icon-description",
                                    id: "item-details"
                                }
                            ]
                        ]
                    };

                    if (item.layer.type != "group") {
                        item.panel = {
                            className: "esri-icon-legend",
                            content: "legend",
                            open: true
                        };
                    }
                }
            });

            layerList.on("trigger-action", (event) => {
                const id = event.action.id;
                if (id === "item-details") {
                    window.open(event.item.layer.url);
                } else if (id === "item-legend") {
                    event.item.panel.content = "legend"
                    event.item.panel.className = "esri-icon-legend"
                } else if (id === "item-filter") {
                    event.item.panel.className = "esri-icon-filter"
                    if (event.item.title == "Existing Routes") {
                        event.item.panel.content = routeFilterNode;
                    } else if (event.item.title == "Class Airspace") {
                        event.item.panel.content = airspaceFilterNode;
                    } else if (event.item.title == "Airports") {
                        event.item.panel.content = airportFilterNode;
                    } else if (event.item.title == "Designated Points") {
                        event.item.panel.content = fixesFilterNode;
                    } else if (event.item.title == "NAVAIDS") {
                        event.item.panel.content = navaidsFilterNode;
                    } 
                }
            });
        });

        const compass = new Compass ({
            view: mapView
        });

        mapView.ui.add(compass, "top-left");

        const search = new Search ({
            view: mapView,
            container: "search-div"
        });

        const basemapGallery = new BasemapGallery ({
            view: mapView
        });

        const bgExpand = new Expand ({
            mapView,
            content: basemapGallery,
            expandIconClass: "esri-icon-basemap"
        });

        mapView.ui.add(bgExpand, { position: "bottom-left" });

        const btn2d = $("#btn2d")[0];
        const btn3d = $("#btn3d")[0];

        mapView.ui.add(btn3d, { position: "bottom-left" });
        sceneView.ui.add(btn2d, { position: "bottom-left" });

        mapView.when(() => {
            const sketch = new Sketch ({
                layer: lineGraphicsLyr,
                view: mapView,
                creationMode: "update",
                availableCreateTools: ["polyline"],
                snappingOptions: {
                    enabled: true,
                    featureSources: [
                        {
                            layer: navaidsLyr,
                            enabled: true
                        },
                        {
                            layer: fixesLyr,
                            enabled: true
                        },
                        {
                            layer: airportsLyr,
                            enabled: true
                        },
                        {
                            layer: vertiportsLyr,
                            enabled: true
                        }
                    ]                
                }
            });
            //mapView.ui.add(sketch, { position: "top-right" });
        });

        //#endregion
    
        //#region Elevation Profile

        const elevationProfile = new ElevationProfile ({
            view: mapView,
            profiles: [
                {
                    type: "ground"
                },
                {
                    type: "input",
                    title: "Flight Plan"
                }
            ],
            visibleElements: {
                legend: false,
                clearButton: false,
                settingsButton: false,
                sketchButton: false,
                selectButton: false,
                uniformChartScalingToggle: false
            },
            container: "elevation-profile",
            unit: "nautical-miles"
        });

        elevationProfile.viewModel.effectiveUnits.elevation = "feet";

        const elevationProfile3D = new ElevationProfile ({
            view: sceneView,
            profiles: [
                {
                    type: "ground"
                },
                {
                    type: "input",
                    title: "Flight Plan"
                }
            ],
            visibleElements: {
                legend: false,
                clearButton: false,
                settingsButton: false,
                sketchButton: false,
                selectButton: false,
                uniformChartScalingToggle: false
            },
            container: "elevation-profile3d",
            unit: "nautical-miles"
        });

        elevationProfile3D.viewModel.effectiveUnits.elevation = "feet";

        //#endregion

        //#region Pointer Hover X/Y/Z Coordinates

        mapView.when(() => {
            const elevation = new ElevationLayer({
                url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            return elevation.load();
        }).then((elevation) => {
            elevation.createElevationSampler(mapView.extent)
                .then((sampler) => {
                    mapView.on("pointer-move", (move) => {
                        let mapPt = mapView.toMap(move);
                        let coordinates = sampler.queryElevation(mapPt)
                        $("#pointer-coords").html("Lat: " + coordinates.latitude + "  Long: " + coordinates.longitude + "  Elev: " + (coordinates.z) + " ft");
                    })
                })
        });

        //#endregion

        //#region 2D/3D Conversion

        $("#btn2d").on("click", () => { switchView() });

        $("#btn3d").on("click", () => { switchView() });

        function switchView () {
            const is3D = appConfig.activeView.type === "3d";
            const activeViewpoint = appConfig.activeView.viewpoint.clone();
        
            appConfig.activeView.container = null;
        
            if (is3D) {
                layerList.view = mapView;

                appConfig.mapView.viewpoint = activeViewpoint;
                appConfig.mapView.container = appConfig.container;
               
                map.basemap = "gray-vector";

                to2DSymbology();

                appConfig.activeView = appConfig.mapView;

                $("#elevation-profile").css("display", "block");
                $("#elevation-profile3d").css("display", "none");
                $("#create-route").css("display", "block")
            } else {
                layerList.view = sceneView;

                appConfig.sceneView.viewpoint = activeViewpoint;
                appConfig.sceneView.container = appConfig.container;

                map.basemap = new Basemap({
                    portalItem: {
                        id: "0560e29930dc4d5ebeb58c635c0909c9"
                    }
                });

                to3DSymbology();

                appConfig.activeView = appConfig.sceneView;

                $("#elevation-profile").css("display", "none");
                $("#elevation-profile3d").css("display", "block");
                $("#create-route").css("display", "none")
            }
        }

        function to2DSymbology () {
            classAirspaceLyr.renderer = {
                type: "simple",
                symbol: {
                    type: "simple-fill",
                    style: "none",
                    outline: {
                        color: [0,0,0,1],
                        width: "1px"
                    }
                }
            };
        }

        function to3DSymbology () {
            classAirspaceLyr.elevationInfo = {
                mode: "relative-to-ground",
                featureExpressionInfo: {
                    expression: "Number($feature.LOWER_VAL)"
                },
                unit: "us-feet"
            };

            classAirspaceLyr.renderer = {
                type: "simple",
                symbol: {
                    type: "polygon-3d",
                    symbolLayers: [{
                        type: "extrude",
                        material: { color: [0, 0, 0, 0.10] }
                    }]
                },
                visualVariables: [
                    {
                        type: "size",
                        valueExpression: "Number($feature.UPPER_VAL) - Number($feature.LOWER_VAL)",
                        units: "feet"
                    }
                ]
            };
        }

        //#endregion

        //#region Sync 2D/3D Views

        const views = [mapView, sceneView];
        let activeView;

        const sync = (source) => {
            if (!activeView || !activeView.viewpoint || activeView !== source) {
                return;
            }

            for (const view of views) {
                if (view !== activeView) {
                    view.viewpoint = activeView.viewpoint;
                }
            }
        };

        for (const view of views) {
            view.watch(["interacting", "animation"],
            () => {
                activeView = view;
                sync(activeView);
            });

            view.watch("viewpoint", () => sync(view));
        }

        //#endregion

        //#region Global Variables

        let oid,
            selectedFeature,
            editor,
            multipointVertices = [],
            userLineColor;

        //#endregion

        //#region Populate List of Existing Routes

        populateExistingRoutes();

        function populateExistingRoutes () {
            mapView.when(() => {
                const query = {
                    where: "program = 'Archer'", // Modify where clause depending on the user program
                    outFields: ["*"]
                };

                existingRoutesLyr.queryFeatures(query)
                    .then((r) => {
                        for (let f of r.features) {
                            $("#existing-routes").append(
                                "<calcite-list-item value='" + f.attributes.OBJECTID + "' label='" + f.attributes.route_name + "' description='Distance: " + parseFloat(f.attributes.route_distance).toFixed(2) + " nautical miles'></calcite-list-item>"
                            )
                        }
                        $("#existing-routes")[0].loading = false;
                    });
            });
        }

        //#endregion

        //#region Select Routes for Visibility

        $("#existing-routes").on("calciteListItemSelect", (e) => {
            oid = parseInt(e.target.value);
            let routeSelected = e.target.selected;
            let selectedArr = [];

            updateRouteRenderer(oid, routeSelected);

            for (let i of e.currentTarget.selectedItems) {
                selectedArr.push(i.value);
            }

            let wrappedInQuotes = selectedArr.map((oid) => `'${oid}'`);
            let itemString = wrappedInQuotes.join(",");

            existingRoutesLyr.definitionExpression = "Program = 'Archer' AND OBJECTID IN (" + itemString + ")";
        });

        function updateRouteRenderer (objectId, routeSelected) {
            let routeColor, geom, routeBufferName;

            // Query routes for matching OID
            existingRoutesLyr.queryFeatures(
                {
                    where: "OBJECTID = " + objectId,
                    outFields: ["*"],
                    returnGeometry: true
                }
            ).then((r) => {
                // Set variables from the queried feature
                routeColor = r.features[0].attributes.display_color;
                geom = r.features[0].geometry;
                routeBufferName = r.features[0].attributes.route_name;
            }).then(() => {
                if (routeSelected == true) {
                    existingRoutesLyr.renderer.addUniqueValueInfo(
                        {
                            label: routeBufferName,
                            value: objectId,
                            symbol: {
                                type: "simple-line",
                                color: routeColor,
                                width: 2
                            }
                        }
                    );

                    console.log(existingRoutesLyr.renderer);

                    // Create a 0.6nm protection buffer around the selected route
                    const buffer = geometryEngine.buffer(geom, 0.3, "nautical-miles");
                    routeBuffer.add(
                        new Graphic ({
                            geometry: buffer,
                            symbol: {
                                type: "simple-fill",
                                color: [255, 20, 20, 0.25],
                                outline: {
                                    color: [0, 0, 0, 0.25],
                                    width: 1
                                }
                            },
                            attributes: {
                                "route": objectId
                            }
                        })
                    );
                } else {
                    // Remove the Unique Renderer Info for the deselected OID
                    existingRoutesLyr.renderer.removeUniqueValueInfo(objectId);

                    console.log(existingRoutesLyr.renderer);

                    // Find the graphic for the route that was deslected and remove the corresponding buffer
                    let removeGraphic = routeBuffer.graphics.find((g) => {
                        return g.attributes.route === objectId;
                    });
                    routeBuffer.remove(removeGraphic);
                }
            });
        }

        //#endregion
   
        //#region Create New Route
   
        const pointSketchViewModel = new SketchViewModel ({
            layer: pointGraphicsLyr,
            view: mapView,
            pointSymbol: {
                type: "simple-marker",
                style: "circle",
                color: "blue",
                size: "8px"
            },
            snappingOptions: {
                enabled: true,
                featureSources: [
                    {
                        layer: navaidsLyr,
                        enabled: true
                    },
                    {
                        layer: fixesLyr,
                        enabled: true
                    },
                    {
                        layer: airportsLyr,
                        enabled: true
                    },
                    {
                        layer: vertiportsLyr,
                        enabled: true
                    }
                ]
            },
            labelOptions: { enabled: true },
            tooltipOptions: { enabled: true }
        });

        // Open Creator Toolbar and Color Picker
        $("#create-route").on("click", () => {
            $("#route-toolbar").css("display", "block");
            $("#color-picker-panel").css("display", "grid");
            multipointVertices = [];
            elevationProfile.input = null;
            $("#waypoint-list").css("display", "none");
            mapView.popup.close();
        });

        // Confirm the selected line color
        $("#confirm-color").on("click", () => {
            $("#add-route-vertices")[0].disabled = false;
            userLineColor = $("#color-picker")[0].value;
            $("#color-picker-panel").css("display", "none"); 
        });

        // Start adding route vertices
        $("#add-route-vertices").on("click", () => {
            mapView.focus();
            pointSketchViewModel.create("multipoint", { hasZ: true });
            $("#add-route-vertices")[0].disabled = true;
        });

        // After add vertices is clicked, the sketch view model becomes active and starts creating a multipoint collection
        pointSketchViewModel.on("create", (e) => {
            if (e.state == "complete") {
                console.log("complete feature");
            } else if (e.state == "start") {
                $("#waypoint-table tbody tr").remove();

                let coords = [e.toolEventInfo.added[0][0], e.toolEventInfo.added[0][1], 0];

                createTableRow([coords]);

                multipointVertices.push(coords);

                $("#waypoint-list").css("display", "block");
            } else if (e.state == "active") {
                if (e.toolEventInfo.type == "vertex-add") {
                    let coords = [e.toolEventInfo.added[0][0], e.toolEventInfo.added[0][1], 0];

                    createTableRow([coords]);

                    multipointVertices.push(coords);

                    drawPath(multipointVertices);

                    if (multipointVertices.length > 1) {
                        $("#complete-route")[0].disabled = false;
                    }

                    $("#cancel-vertices")[0].disabled = false;
                }
            }
        });

        $("#waypoint-table").on("input", (e) => {
            if (e.target.cellIndex == 3) {
                // Check if z-values are non-negative numbers
                // true = green & false = red
                if (!isNaN(e.target.innerHTML) && parseFloat(e.target.innerHTML) >= 0) {
                    e.target.bgColor = "#C6EFCE";
                } else {
                    e.target.bgColor = "#FFC7CE";
                }
            } else if (e.target.cellIndex == 2) {
                // Check if y-values are numbers between -90 and 90
                // true = green & false = red
                if (!isNaN(e.target.innerHTML) && (parseFloat(e.target.innerHTML) >= -90 && parseFloat(e.target.innerHTML) <= 90)) {
                    e.target.bgColor = "#C6EFCE";
                } else {
                    e.target.bgColor = "#FFC7CE";
                }
            } else if (e.target.cellIndex == 1) {
                // Check if x-values are numbers between -180 and 180
                // true = green & false = red
                if (!isNaN(e.target.innerHTML) && (parseFloat(e.target.innerHTML) >= -180 && parseFloat(e.target.innerHTML) <= 180)) {
                    e.target.bgColor = "#C6EFCE";
                } else {
                    e.target.bgColor = "#FFC7CE";
                }
            }

            let table = document.getElementById("waypoint-table"),
                rows = table.getElementsByTagName("tr"),
                newVertices = [],
                i, j, cells;
            
            for (i=0, j=rows.length; i<j; ++i) {
                cells = rows[i].getElementsByTagName("td");
                if (!cells.length) {
                    continue;
                }

                let long = cells[1].innerHTML,
                    lat = cells[2].innerHTML,
                    alt = cells[3].innerHTML;

                let point = new Point ({
                    latitude: lat,
                    longitude: long,
                    z: alt/3.281,
                    spatialReference: 3857
                });

                let coord = [point.x, point.y, point.z];

                newVertices.push(coord);
            }

            multipointVertices = newVertices;

            let polyline = new Polyline ({
                hasZ: true,
                spatialReference: mapView.spatialReference,
                paths: multipointVertices
            });

            const graphic = new Graphic ({
                geometry: polyline,
                symbol: {
                    type: "simple-line",
                    color: userLineColor,
                    width: "3",
                    style: "short-dash"
                }
            });

            drawPath(multipointVertices);

            elevationProfile.input = graphic;
        });

        function createTableRow (vertice) {
            let multipoint = new Multipoint ({
                points: vertice,
                spatialReference: mapView.spatialReference
            });

            let mapPt = multipoint.getPoint(0);

            let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
            let nextVert = nextRow.insertCell(0);
            let nextX = nextRow.insertCell(1);
            let nextY = nextRow.insertCell(2);
            let nextZ = nextRow.insertCell(3);

            nextVert.innerHTML = nextRow.rowIndex;
            nextX.innerHTML = mapPt.longitude.toFixed(6);
            nextX.setAttribute("contentEditable", "true");
            nextY.innerHTML = mapPt.latitude.toFixed(6);
            nextY.setAttribute("contentEditable", "true");
            nextZ.innerHTML = (mapPt.z * 3.281).toFixed(0);
            nextZ.setAttribute("contentEditable", "true");
        }

        function drawPath (vertices) {
            mapView.graphics.removeAll();

            let polyline = new Polyline ({
                hasZ: true,
                spatialReference: mapView.spatialReference,
                paths: vertices
            });

            const graphic = new Graphic ({
                geometry: polyline,
                symbol: {
                    type: "simple-line",
                    color: userLineColor,
                    width: "3",
                    style: "short-dash"
                }
            });

            mapView.graphics.add(graphic);
            elevationProfile.input = graphic;
        }

        $("#complete-route").on("click", (e) => {
            e.currentTarget.disabled = true;
            pointSketchViewModel.complete();
            $("#save")[0].disabled = false;
            $("#edit-vertices")[0].disabled = true;
            $("#cancel-vertices")[0].disabled = true;
        });

        // Open Save Route modal to enter attributes and push route to layer
        $("#save").on("click", () => {
            $("#route-save-modal")[0].open = true;
        });

        $("#route-save").on("click", () => {

            // Get the user entered values for the route attributes
            let rName = $("#route-name")[0].value;
            let rArrival = $("#route-arr")[0].value;
            let rDepart = $("#route-dep")[0].value;

            let path = [];

            let multipoint = new Multipoint ({
                points: multipointVertices,
                spatialReference: mapView.spatialReference
            });

            for (let i=0; i<multipoint.points.length; i++) {
                let mapPt = multipoint.getPoint(i);
                let coords = [mapPt.longitude, mapPt.latitude, mapPt.z];
                path.push(coords);
            }

            let polyline = {
                type: "polyline",
                paths: path
            };

            let polylineGraphic = new Graphic ({
                geometry: polyline,
                attributes: {
                    "route_name": rName,
                    "departing_fac": rDepart,
                    "arriving_fac": rArrival,
                    "display_color": userLineColor,
                    "program": "Archer" // Change this to match the program that is licensed
                }
            });

            let rDistance = geometryEngine.geodesicLength(polylineGraphic.geometry, "nautical-miles");

            polylineGraphic.attributes["route_distance"] = rDistance;

            const edits = {
                addFeatures: [polylineGraphic]
            };

            existingRoutesLyr
                .applyEdits(edits)
                .then((r) => {

                    // Update the routes renderer with the new route
                    oid = r.addFeatureResults[0].objectId;

                    updateRouteRenderer(oid, true);

                    let selectedArr = [oid];

                    for (let i of $("#existing-routes")[0].selectedItems) {
                        selectedArr.push(i.value);
                    }
        
                    let wrappedInQuotes = selectedArr.map((oid) => `'${oid}'`);
                    let itemString = wrappedInQuotes.join(",");
        
                    existingRoutesLyr.definitionExpression = "Program = 'Archer' AND OBJECTID IN (" + itemString + ")";

                    // Delete the current list of existing routes
                    $("#existing-routes").empty();
                    // Repopulate existing routes list with new values after 1 second delay
                    setTimeout(() => {
                        populateExistingRoutes();
                    }, 1000);

                    selectExistingRoute(oid, appConfig.activeView.type);

                    mapView.graphics.removeAll();

                    $("#route-name")[0].value = "";
                    $("#route-arr")[0].value = "";
                    $("#route-dep")[0].value = "";
                    
                    // Close modal
                    // Reset vertices, sketch, table
                    $("#route-save-modal")[0].open = false;
                    $("#waypoint-table tbody tr").remove();
                    $("#waypoint-list").css("display", "none");
                    $("#save")[0].disabled = true;
                    $("#route-toolbar").css("display", "none");

                    multipointVertices = [];

                    pointGraphicsLyr.removeAll();

                    pointSketchViewModel.cancel();

                    routeBuffer.removeAll();
                });
        });

        $("#cancel-vertices").on("click", () => {
            cancelRouteCreation();
        });

        function cancelRouteCreation () {
            pointSketchViewModel.cancel();
            multipointVertices = [];

            $("#waypoint-table tbody tr").remove(); // remove table rows
            $("#waypoint-list").css("display", "none"); // hide table

            // Reset route creation toolbar buttons and hide
            $("#route-toolbar").css("display", "none");
            $("#color-picker-panel").css("display", "none");
            $("#save")[0].disabled = true;
            $("#complete-route")[0].disabled = true;
            $("#edit-vertices")[0].disabled = true;
            $("#cancel-vertices")[0].disabled = true;

            mapView.graphics.removeAll(); // remove incomplete route
            elevationProfile.input = null; // clear elevation profile graphic
        }

        //#endregion

        //#region Select Existing Route

        mapView.on("click", (e) => {
            const opts = {
                include: existingRoutesLyr
            };

            mapView.hitTest(e, opts)
                .then((r) => {
                    if (r.results.length) {
                        oid = r.results[0].graphic.attributes.OBJECTID;
                        selectExistingRoute(oid, appConfig.activeView.type);
                    }
                });
        });

        sceneView.on("click", (e) => {
            const opts = {
                include: existingRoutesLyr
            };

            sceneView.hitTest(e, opts)
                .then((r) => {
                    if (r.results.length) {
                        oid = r.results[0].graphic.attributes.OBJECTID;
                        selectExistingRoute(oid, appConfig.activeView.type);
                    }
                });
        });

        function selectExistingRoute (objectId, dimensions) {
            const query = {
                where: "OBJECTID = " + objectId,
                outFields: ["*"],
                returnGeometry: true,
                returnZ: true
            };

            existingRoutesLyr.queryFeatures(query)
                .then((r) => {
                    selectedFeature = r.features[0];

                    if (dimensions == "2d") {
                        mapView
                            .goTo(selectedFeature.geometry.extent.expand(2))
                            .then(() => {
                                $("#waypoint-list").css("display", "block");

                                selectedFeatureTable(selectedFeature.geometry.paths);

                                selectedFeatureProfile(selectedFeature.geometry.paths);

                                mapView.openPopup({
                                    features: [selectedFeature]
                                });
                            })
                            .catch((error) => {
                                if (error.name != "AbortError") {
                                    console.log(error);
                                }
                            });
                    } else if (dimensions == "3d") {
                        sceneView
                            .goTo(selectedFeature.geometry.extent.expand(2))
                            .then(() => {
                                $("#waypoint-list").css("display", "block");

                                selectedFeatureTable(selectedFeature.geometry.paths);

                                selectedFeatureProfile(selectedFeature.geometry.paths);

                                sceneView.openPopup({
                                    features: [selectedFeature]
                                });
                            })
                            .catch((error) => {
                                if (error.name != "AbortError") {
                                    console.log(error);
                                }
                            });
                    }
                });              
        }

        function selectedFeatureTable (vertices) {
            $("#waypoint-table tbody tr").remove();

            for (let v of vertices[0]) {
                let point = new Point ({
                    hasZ: true,
                    x: v[0],
                    y: v[1],
                    z: v[2],
                    spatialReference: mapView.spatialReference
                });
    
                let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
                let nextVert = nextRow.insertCell(0);
                let nextX = nextRow.insertCell(1);
                let nextY = nextRow.insertCell(2);
                let nextZ = nextRow.insertCell(3);
        
                nextVert.innerHTML = nextRow.rowIndex
                nextX.innerHTML = point.longitude.toFixed(6);
                nextX.setAttribute("contentEditable", "true");
                nextY.innerHTML = point.latitude.toFixed(6);
                nextY.setAttribute("contentEditable", "true");
                nextZ.innerHTML = (point.z * 3.281).toFixed(0);
                nextZ.setAttribute("contentEditable", "true");
            }
        }

        function selectedFeatureProfile (vertices) {
            let polyline = new Polyline ({
                hasZ: true,
                spatialReference: mapView.spatialReference,
                paths: vertices
            });

            const graphic = new Graphic ({
                geometry: polyline,
                symbol: {
                    type: "simple-line",
                    color: "#008B8B",
                    width: "0",
                    style: "short-dash"
                }
            });

            elevationProfile.input = graphic;
            elevationProfile3D.input = graphic;
        }

        //#endregion

        //#region Edit Existing Route

        // Editing in 2D
        reactiveUtils.on(
            () => mapView.popup,
            "trigger-action",
            (e) => {
                if (e.action.id === "edit-attributes") {
                    $("#save-vertices").css("display", "block");
                    
                    editRouteAttributes();
                }
            }
        );

        mapView.when(() => {
            editor = new Editor ({
                view: mapView,
                visibleElements: {
                    snappingControls: false,
                    sketchTooltipControls: false
                },
                snappingOptions: {
                    enabled: true,
                    selfEnabled: false,
                    featureSources: [
                        {
                            layer: navaidsLyr,
                            enabled: true
                        },
                        {
                            layer: fixesLyr,
                            enabled: true
                        },
                        {
                            layer: airportsLyr,
                            enabled: true
                        },
                        {
                            layer: vertiportsLyr,
                            enabled: true
                        }
                    ]
                },
                tooltipOptions: { enabled: true },
                labelOptions: { enabled: true },
                container: document.createElement("div"),
                layerInfos: [
                    {
                        layer: existingRoutesLyr,
                        formTemplate: {
                            title: "Route Attributes",
                            description: "Enter or Modify all route attributes below.",
                            elements: [
                                {
                                    type: "field",
                                    fieldName: "route_name",
                                    label: "Route Name"
                                },
                                {
                                    type: "field",
                                    fieldName: "departing_fac",
                                    label: "Departing Facility"
                                },
                                {
                                    type: "field",
                                    fieldName: "arriving_fac",
                                    label: "Arriving Facility"
                                }
                            ]
                        }
                    }
                ]
            })
        });

        existingRoutesLyr.on("edits", (e) => {
            // After a route is deleted
            if (e.deletedFeatures.length > 0) {

                // Close editor widget
                editor.viewModel.cancelWorkflow();
                mapView.ui.remove(editor);

                // Delete the current list of existing routes
                $("#existing-routes").empty();

                // Repopulate existing routes list with new values after 1 second delay
                // Close the deleted routes popup
                setTimeout(()=> {
                    populateExistingRoutes();
                    mapView.popup.close();
                }, 1000);

                // Find and remove the buffer graphic for the route that was deleted
                let removeGraphic = routeBuffer.graphics.find((g) => {
                    return g.attributes.route === e.deletedFeatures[0].objectId;
                });
                routeBuffer.remove(removeGraphic);
            }
        });

        $("#save-vertices").on("click", () => {
            let table = document.getElementById("waypoint-table"),
                rows = table.getElementsByTagName("tr"),
                newVertices = [],
                i, j, cells;

            for (i=1, j=rows.length; i<j; ++i) {
                cells = rows[i].getElementsByTagName("td");

                let long = cells[1].innerHTML,
                    lat = cells[2].innerHTML,
                    alt = cells[3].innerHTML;
                
                let point = new Point ({
                    latitude: lat,
                    longitude: long,
                    z: alt/3.281,
                    spatialReference: 4326
                });
    
                let coord = [point.x, point.y, point.z];
    
                newVertices.push(coord);
            }

            let polyline = {
                type: "polyline",
                paths: newVertices,
                hasZ: true
            };
    
            let polylineGraphic = new Graphic ({
                geometry: polyline,
                attributes: {
                    "OBJECTID": oid
                }
            });

            let rDistance = geometryEngine.geodesicLength(polylineGraphic.geometry, "nautical-miles");
    
            polylineGraphic.attributes["route_distance"] = rDistance;
    
            const edits = {
                updateFeatures: [polylineGraphic]
            };
            mapView.graphics.add(polylineGraphic);
    
            existingRoutesLyr
                .applyEdits(edits)
                .then(() => { 
                    drawPath(selectedFeature.geometry.paths);
    
                    const query = {
                        where: "OBJECTID = " + oid,
                        outFields: ["*"],
                        returnGeometry: true,
                        returnZ: true
                    };
        
                    existingRoutesLyr.queryFeatures(query)
                        .then((r) => {
                            selectedFeature = r.features[0];
                            mapView
                                .goTo(selectedFeature.geometry.extent.expand(2))
                                .then(() => {
                                    $("#waypoint-list").css("display", "block");
                                    selectedFeatureTable(selectedFeature.geometry.paths);
                                    selectedFeatureProfile(selectedFeature.geometry.paths);
                                    mapView.popup.dockEnabled = true;
                                    mapView.popup.dockOptions = {
                                        position: "bottom-right",
                                        buttonEnabled: false
                                    };
                                    mapView.popup.open({
                                        features: [selectedFeature]
                                    });
                                    
                                    editor.viewModel.cancelWorkflow();
                                    mapView.ui.remove(editor);
                                })
                                .catch((error) => {
                                    if (error.name != "AbortError") {
                                        console.log(error);
                                    }
                                });
                        });
                });
        });

        function editRouteAttributes () {
            if (!editor.activeWorflow) {
                mapView.popup.visible = false;

                editor.startUpdateWorkflowAtFeatureEdit(
                    mapView.popup.selectedFeature
                );

                mapView.ui.add(editor, "bottom-right");
            }

            reactiveUtils.when(
                () => editor.viewModel.state === "ready",
                () => {
                    mapView.ui.remove(editor);
                    mapView.popup.open(
                        {
                            features: [selectedFeature],
                            shouldFocus: true
                        }
                    );
                    $("#save-vertices").css("display", "none");
                }
            );

            console.log(mapView.popup.selectedFeature);
        }

        // Editing in 3D
        reactiveUtils.on(
            () => sceneView.popup,
            "trigger-action",
            (e) => {
                if (e.action.id === "edit-attributes") {
                    $("#save-vertices").css("display", "block");
                    
                    editRouteAttributes3d();
                }
            }
        );

        sceneView.when(() => {
            editor = new Editor ({
                view: sceneView,
                visibleElements: {
                    snappingControls: false,
                    sketchTooltipControls: false
                },
                snappingOptions: {
                    enabled: true,
                    selfEnabled: false,
                    featureSources: [
                        {
                            layer: navaidsLyr,
                            enabled: true
                        },
                        {
                            layer: fixesLyr,
                            enabled: true
                        },
                        {
                            layer: airportsLyr,
                            enabled: true
                        },
                        {
                            layer: vertiportsLyr,
                            enabled: true
                        }
                    ]
                },
                tooltipOptions: { enabled: true },
                labelOptions: { enabled: true },
                container: document.createElement("div"),
                layerInfos: [
                    {
                        layer: existingRoutesLyr,
                        formTemplate: {
                            title: "Route Attributes",
                            description: "Enter or Modify all route attributes below.",
                            elements: [
                                {
                                    type: "field",
                                    fieldName: "route_name",
                                    label: "Route Name"
                                },
                                {
                                    type: "field",
                                    fieldName: "departing_fac",
                                    label: "Departing Facility"
                                },
                                {
                                    type: "field",
                                    fieldName: "arriving_fac",
                                    label: "Arriving Facility"
                                }
                            ]
                        }
                    }
                ]
            });
        });

        function editRouteAttributes3d () {
            if (!editor.activeWorflow) {
                sceneView.popup.visible = false;

                editor.startUpdateWorkflowAtFeatureEdit(
                    sceneView.popup.selectedFeature
                );

                sceneView.ui.add(editor, "bottom-right");
            }

            reactiveUtils.when(
                () => editor.viewModel.state === "ready",
                () => {
                    sceneView.ui.remove(editor);
                    sceneView.popup.open(
                        {
                            features: [selectedFeature],
                            shouldFocus: true
                        }
                    );
                    $("#save-vertices").css("display", "none");
                }
            );
        }

        //#endregion

    } 


)
