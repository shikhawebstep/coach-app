import React from 'react';
import MapView, { Marker } from "react-native-maps";

export default function MiniMapView({ region, studentName, address, style }) {
    return (
        <MapView
            style={style}
            initialRegion={region}
            scrollEnabled={false}
            zoomEnabled={false}
        >
            <Marker
                coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                }}
                title={studentName}
                description={address}
            />
        </MapView>
    );
}
