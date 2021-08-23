import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import MapStyles from "../styles/Map.css";
import axios from "axios";
import { format } from "timeago.js";
import logo from "../images/ITER_LOGO.png";
import { width } from "@material-ui/system";
import { Toolbar } from "@material-ui/core";

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
    right: 80,
    top: 1350,
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    history.push("/login");
  };
  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapStyle="mapbox://styles/basstian94/ckskoius30zlk17mpivkha51r"
      onDblClick={handleAddClick}
      transitionDuration="200"
    >
      <NavigationControl style={navControlStyle} />
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 2}
            offsetTop={-viewport.zoom * 4}
          >
            <Room
              style={{
                fontSize: viewport.zoom * 4,
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
              anchor="bottom"
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
          anchor="left"
          onClose={() => setNewPlace(null)}
        >
          <div>
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Enter a review of the place"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
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
      <Toolbar>
        <img
          style={{
            height: "200px",
            width: "200px",
          }}
          className="header__logo"
          src={logo}
          alt=""
        />
        {currentUser ? (
          <div className="buttons">
            <button className="buttonlogout" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        ) : (
          console.log("you are not login")
        )}
      </Toolbar>
    </ReactMapGL>
  );
}

export default Map;
