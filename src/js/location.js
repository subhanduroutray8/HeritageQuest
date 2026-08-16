let currentLocation = null;

export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };

                resolve(currentLocation);
            },
            (error) => {
                reject(new Error(getLocationError(error)));
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    });
}

function getLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            return "Location permission was denied.";
        case error.POSITION_UNAVAILABLE:
            return "Your location is currently unavailable.";
        case error.TIMEOUT:
            return "Location request timed out.";
        default:
            return "Unable to get your location.";
    }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters

    const toRadians = (degrees) => degrees * Math.PI / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}