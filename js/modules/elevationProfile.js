define([
    "esri/widgets/ElevationProfile"
], (ElevationProfile) => {

    function createElevationProfile(view, container) {
        const elevationProfile = new ElevationProfile({
            view: view,
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
            container: container,
            unit: "nautical-miles"
        });
        
        elevationProfile.viewModel.effectiveUnits.elevation = "feet";

        return elevationProfile;
    }

    return {
        createElevationProfile: createElevationProfile
    }
    
    
});