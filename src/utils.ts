import { Dispatch, SetStateAction } from "react";
import { fieldHeight, fieldWidth, number, radius, red } from "./constants";
import { IBall } from "./types";

const createBall = (
  x: number,
  y: number,
  radius: number,
  color: string = red,
  speed_x: number = 0,
  speed_y: number = 0
): IBall => {
  return { x, y, radius, color, speed_x, speed_y };
};

export const createBallsArr = (
  balls: Array<IBall>,
  setBalls: Dispatch<SetStateAction<Array<IBall>>>
) => {
  for (let i = 0; i < number; i++) {
    let x = Math.random() * (fieldWidth - 2 * radius) + radius;
    let y = Math.random() * (fieldHeight - 2 * radius) + radius;
    while (
      balls.find(
        (ball) =>
          Math.abs(x - ball.x) < 2 * radius && Math.abs(y - ball.y) < 2 * radius
      )
    ) {
      x = Math.random() * (fieldWidth - 2 * radius) + radius;
      y = Math.random() * (fieldHeight - 2 * radius) + radius;
    }
    balls.push(createBall(x, y, radius));
  }
  setBalls(balls);
};

export const calcDelta = (shockedBalls: Array<IBall>) => {
  const delta_x = shockedBalls[0].x - shockedBalls[1].x;
  const delta_y = shockedBalls[0].y - shockedBalls[1].y;
  const tg = delta_y / delta_x;
  const cos = Math.sqrt(1 / (1 + tg * tg));
  const sin = Math.sqrt(1 - cos * cos);
  return { x: 2 * radius * cos, y: 2 * radius * sin };
};
