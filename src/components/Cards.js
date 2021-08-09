import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import "../styles/Cards.css";

function Cards() {
  const [people, setPeople] = useState([
    {
      name: "Fito Paez",
      url: "https://www.eltiempo.com/files/image_640_428/uploads/2020/04/17/5e9a781b751e4.jpeg",
    },
    {
      name: "Luis Alberto Spinetta",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Spinetta%2C_1969.jpg/200px-Spinetta%2C_1969.jpg",
    },
    {
      name: "Gustavo Cerati",
      url: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Gustavo_Cerati.jpg",
    },
    {
      name: "Charly García",
      url: "https://elrockescultura.com/wp-content/uploads/2017/10/charly-garcia-1827195194.jpg",
    },
  ]);
  const swiped = (direction, nameToDelete) => {
    console.log("removing: " + nameToDelete);
    //setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + "left the screen!");
  };

  return (
    <div className="tinderCards">
      <div className="tinderCards__cardContainer">
        {people.map((person) => (
          <TinderCard
            className="swipe"
            key={person.name}
            preventSwipe={["up", "down"]}
            onSwipe={(dir) => swiped(dir, person.name)}
            onCardLeftScreen={() => outOfFrame(person.name)}
          >
            <div
              style={{ backgroundImage: "url(" + person.url + ")" }}
              className="card"
            >
              <h3>{person.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
}

export default Cards;
