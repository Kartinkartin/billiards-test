import styled from "./menu.module.css";
import { IMenu } from "../../types";
import { blue, green, red } from "../../constants";

const Menu = ({
    modalPlace,
  ballColor,
  setColor,
  chosenBall,
  setBalls,
  setModalOpen,
}: IMenu) => {
  const formName = "colorForm";
  const inputName = "color";
  const activeInputColor = 'white';

  const handleChange = () => {
    const value = document.forms.namedItem(formName)![inputName].value;
    setColor(value);
    setBalls((balls) => {
      balls[chosenBall].color = value;
      return balls;
    });
    setModalOpen(false);
    setColor(null);
  };

  return (
    <form
      className={styled.menu_container}
      name={formName}
      style={{top: modalPlace.y, left: modalPlace.x}}
    >
      <label
        htmlFor={red}
        className={`${styled.menu_button} ${
          ballColor === red && styled.menu_button_active
        }`}
        style={ballColor === red ? { backgroundColor: activeInputColor } : { backgroundColor: red }}

      >
        Красный
        <input
          id={red}
          type="radio"
          name="color"
          value={red}
          className={styled.menu_input}
          checked={ballColor === red}
          onChange={handleChange}
        />
      </label>
      <label
        htmlFor={blue}
        className={`${styled.menu_button} ${
          ballColor === blue && styled.menu_button_active
        }`}
        style={ballColor === blue ? { backgroundColor: activeInputColor } : { backgroundColor: blue }}


      >
        Синий
        <input
          id={blue}
          type="radio"
          name="color"
          value={blue}
          className={styled.menu_input}
          checked={ballColor === blue}
          onChange={handleChange}
        />
      </label>
      <label
        htmlFor={green}
        style={ballColor === green ? { backgroundColor: activeInputColor } : { backgroundColor: green }}
        className={styled.menu_button}
      >
        Зеленый
      </label>
      <input
        id={green}
        type="radio"
        name="color"
        value={green}
        className={styled.menu_input}
        checked={ballColor === green}
        onChange={handleChange}
      />
    </form>
  );
};
export default Menu;
