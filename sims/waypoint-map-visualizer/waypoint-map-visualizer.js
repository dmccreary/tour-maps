import React, { useState, useEffect } from 'react';
import { MapPin, Upload, Navigation } from 'lucide-react';

export default function WaypointMapVisualizer() {
  const [waypoints, setWaypoints] = useState([]);
  const [csvInput, setCsvInput] = useState('');
  const [showPath, setShowPath] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 56.5, lon: -4 });
  const [zoom, setZoom] = useState(7);

  const defaultData = `Name,Long,Lat
Ibis,55.948399,-3.186841
Norton House Hotel & Spa,55.932422,-3.384189
Creggans Inn,56.175403,-5.083672
Clan MacDuff Hotel,56.795479,-5.140878
Eilean Iarmain Hotel,57.145349,-5.799012
Eilean Iarmain Hotel,57.145349,-5.799012
Coul House Hotel,57.571843,-4.572125
Coul House Hotel,57.571843,-4.572125
Dunkeld House Hotel,56.564644,-3.610856
The Waterfront,56.2227,-2.6994
Woodside Hotel,56.189625,-4.055882
Ibis,55.948399,-3.186841`;

  useEffect(() => {
    parseCSV(defaultData);
  }, []);

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return;
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length >= 3) {
        data.push({
          name: parts[0].trim(),
          lat: parseFloat(parts[1]),
          lon: parseFloat(parts[2])
        });
      }
    }
    setWaypoints(data);
    
    if (data.length > 0) {
      const avgLat = data.reduce((sum, p) => sum + p.lat, 0) / data.length;
      const avgLon = data.reduce((sum, p) => sum + p.lon, 0) / data.length;
      setMapCenter({ lat: avgLat, lon: avgLon });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setCsvInput(text);
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const handleCSVChange = (e) => {
    const text = e.target.value;
    setCsvInput(text);
    parseCSV(text);
  };

  const latLonToPixel = (lat, lon, bounds) => {
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * 100;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  const getBounds = () => {
    if (waypoints.length === 0) return null;
    
    const lats = waypoints.map(w => w.lat);
    const lons = waypoints.map(w => w.lon);
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    const latPadding = (maxLat - minLat) * 0.1;
    const lonPadding = (maxLon - minLon) * 0.1;
    
    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLon: minLon - lonPadding,
      maxLon: maxLon + lonPadding
    };
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getTotalDistance = () => {
    let total = 0;
    for (let i = 1; i < waypoints.length; i++) {
      total += calculateDistance(
        waypoints[i-1].lat, waypoints[i-1].lon,
        waypoints[i].lat, waypoints[i].lon
      );
    }
    return total.toFixed(1);
  };

  const bounds = getBounds();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Navigation className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Waypoint Map Visualizer</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Waypoints</div>
              <div className="text-2xl font-bold text-indigo-600">{waypoints.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Distance</div>
              <div className="text-2xl font-bold text-green-600">{getTotalDistance()} km</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Segments</div>
              <div className="text-2xl font-bold text-purple-600">{Math.max(0, waypoints.length - 1)}</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPath}
                onChange={(e) => setShowPath(e.target.checked)}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">Show Path Lines</span>
            </label>
            
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors text-center">
                  <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-600">Upload CSV File</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Map View</h2>
          <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-200">
            {bounds && (
              <svg className="absolute inset-0 w-full h-full">
                {showPath && waypoints.length > 1 && (
                  <g>
                    {waypoints.map((wp, i) => {
                      if (i === 0) return null;
                      const prev = waypoints[i - 1];
                      const p1 = latLonToPixel(prev.lat, prev.lon, bounds);
                      const p2 = latLonToPixel(wp.lat, wp.lon, bounds);
                      return (
                        <line
                          key={`path-${i}`}
                          x1={`${p1.x}%`}
                          y1={`${p1.y}%`}
                          x2={`${p2.x}%`}
                          y2={`${p2.y}%`}
                          stroke="#4f46e5"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.6"
                        />
                      );
                    })}
                  </g>
                )}
              </svg>
            )}
            
            {bounds && waypoints.map((wp, i) => {
              const pos = latLonToPixel(wp.lat, wp.lon, bounds);
              const isFirst = i === 0;
              const isLast = i === waypoints.length - 1;
              
              return (
                <div
                  key={i}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                    isFirst ? 'bg-green-500' : isLast ? 'bg-red-500' : 'bg-indigo-500'
                  }`} />
                  <div className="absolute left-6 top-0 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="font-semibold">{wp.name}</div>
                    <div className="text-gray-500">
                      {wp.lat.toFixed(4)}, {wp.lon.toFixed(4)}
                    </div>
                    {i > 0 && (
                      <div className="text-indigo-600">
                        {calculateDistance(
                          waypoints[i-1].lat, waypoints[i-1].lon,
                          wp.lat, wp.lon
                        ).toFixed(1)} km from previous
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
              <span>Waypoint</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              <span>End</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Waypoint List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">#</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Latitude</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Longitude</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Distance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {waypoints.map((wp, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">{i + 1}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-800">{wp.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{wp.lat.toFixed(6)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{wp.lon.toFixed(6)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {i > 0 ? `${calculateDistance(
                        waypoints[i-1].lat, waypoints[i-1].lon,
                        wp.lat, wp.lon
                      ).toFixed(1)} km` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}