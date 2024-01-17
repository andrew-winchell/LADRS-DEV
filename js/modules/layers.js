define([
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Map"
], (FeatureLayer, GraphicsLayer, Map) => {

    const airportsLyr = new FeatureLayer({
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

    const classAirspaceLyr = new FeatureLayer({
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

    const fixesLyr = new FeatureLayer({
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

    const navaidsLyr = new FeatureLayer({
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

    const obstaclesLyr = new FeatureLayer({
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

    const vertiportsLyr = new FeatureLayer({
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

    const existingRoutesLyr = new FeatureLayer({
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

    const aamLyr = new FeatureLayer({
        url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/AAM_Routes/FeatureServer",
        title: "AAM Routes"
    });

    const lineGraphicsLyr = new GraphicsLayer({
        title: "Proposed Path",
        graphics: []
    });

    const pointGraphicsLyr = new GraphicsLayer({
        title: "Proposed Vertices",
        graphics: []
    });

    const routeBuffer = new GraphicsLayer({
        title: "Route Protection - 0.6nm",
        graphics: []
    });

    const map = new Map({
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

    return {
        map: map,
        layers: {
            airportsLyr: airportsLyr,
            classAirspaceLyr: classAirspaceLyr,
            fixesLyr: fixesLyr,
            navaidsLyr: navaidsLyr,
            obstaclesLyr: obstaclesLyr,
            vertiportsLyr: vertiportsLyr,
            existingRoutesLyr: existingRoutesLyr,
            aamLyr: aamLyr
        },
        graphicsLayers: {
            lineGraphicsLyr: lineGraphicsLyr,
            pointGraphicsLyr: pointGraphicsLyr,
            routeBuffer: routeBuffer
        }
    };
    
});