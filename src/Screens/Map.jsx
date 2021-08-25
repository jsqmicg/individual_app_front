import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import MapStyles from "../styles/Map.css";
import axios from "axios";
import { format } from "timeago.js";
import logo from "../images/iter_final.png";
import { width } from "@material-ui/system";
import { Toolbar } from "@material-ui/core";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

function Map({ history }) {
  const [currentUser, setCurrentUser] = useState("js");
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 4.64007102459886,
    longitude: -74.10472821284357,
    zoom: 12,
  });

  useEffect(() => {
    const accuracy = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
    const position = navigator.geolocation.getCurrentPosition(
      function (position) {
        setViewport({
          width: "100vw",
          height: "100vh",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 15.6,
        });
      },
      (err) => console.log(err),
      accuracy
    );
    console.log(position);
    const getPins = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/getpins`);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  console.log(viewport.latitude, viewport.longitude);

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );
  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user.name.split(" ")[0];
    setCurrentUser(name);
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/createpin`,
        newPin
      );
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const navControlStyle = {
    right: 40,
    top: 640,
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  return (
    <ReactMapGL
      ref={mapRef}
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/basstian94/ckskoius30zlk17mpivkha51r"
      onDblClick={handleAddClick}
      transitionDuration="200"
    >
      <div className="geocoder">
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          position="bottom-left"
          trackProximity={true}
          proximity={{
            latitude: viewport.latitude,
            longitude: viewport.longitude,
          }}
        />
      </div>
      <NavigationControl style={navControlStyle} />
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 1}
            offsetTop={-viewport.zoom * 2}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 2,
                cursor: "pointer",
                color: "rgb(212, 31, 91)",
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="top"
              onClose={() => setCurrentPlaceId(null)}
              cursor="pointer"
            >
              <div className="cards">
                <label>
                  <b>Place</b>
                </label>
                <h4 className="place">
                  <b>{p.title}</b>
                </h4>
                <label>
                  <b>Review</b>
                </label>
                <p className="desc">{p.desc}</p>
                <label>
                  <b>Rating</b>
                </label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star" />)}
                </div>
                <label>
                  <b>Creator Information</b>{" "}
                </label>
                <p>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                </p>
                <p>
                  <span className="date">{format(p.createdAt)}</span>
                </p>
              </div>
            </Popup>
          )}
        </>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="top"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                <b>Title</b>
              </label>
              <input
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>
                <b>Review</b>
              </label>
              <textarea
                className="textareas"
                placeholder="Enter a review of the place"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>
                <b>Rating</b>
              </label>
              <select
                className="rating"
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitButton" type="submit">
                Add pin
              </button>
            </form>
          </div>
        </Popup>
      )}
      <div className="topbar">
        <img
          style={{
            marginTop: "5px",
            marginLeft: "5px",
            height: "100px",
            width: "100px",
          }}
          src={logo}
          alt=""
        />
        <>
          {currentUser ? (
            <div className="buttons">
              <button className="buttonlogout" onClick={handleLogout}>
                <b>Log Out</b>
              </button>
            </div>
          ) : (
            console.log("you are not login")
          )}
        </>
      </div>
    </ReactMapGL>
  );
}

export default Map;
