import { Dispatch, SetStateAction } from "react";

export interface IBall {
  color: string;
  x: number;
  y: number;
  radius: number;
  speed_x: number;
  speed_y: number;
}

export interface IMenu {
  modalPlace: {x: number, y: number};
  ballColor: string | null;
  setColor: Dispatch<SetStateAction<string | null>>;
  chosenBall: number;
  setBalls: Dispatch<SetStateAction<Array<IBall>>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalPlace: Dispatch<SetStateAction<{x: number, y: number} | null>>;
}
