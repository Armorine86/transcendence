import "./MenuButton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { MenuButton_ } from "../../interfaces";

const MenuButton = (props: MenuButton_) => {
  const [hover, setHover] = useState(false);
  const handleHover = () => {
    setHover(true);
  };
  const handleOut = () => {
    setHover(false);
  };

  return (
    <li
      onMouseOver={handleHover}
      onMouseOut={handleOut}
      className={props.className}
    >
      <a href="#">
        <FontAwesomeIcon
          className={props.iconClassName}
          icon={props.icon}
        ></FontAwesomeIcon>
      </a>
    </li>
  );
};

export default MenuButton;
