import React, { MouseEvent, useEffect, useRef, useState } from "react";
import Menu from "../menu/menu";
import { IBall } from "../../types";
import {
  blue,
  fieldHeight,
  fieldWidth,
  green,
  radius,
  red,
} from "../../constants";
import { calcDelta, createBallsArr } from "../../utils";

const Field = () => {
  const fieldRef = useRef(null);
  const [balls, setBalls] = useState<Array<IBall>>([]);
  const [isAnimation, setAnimation] = useState(false);
  let [raf, setRaf] = useState<number | null>(null);
  const [mouseDown, setDown] = useState<{ x: null | number; y: null | number }>(
    {
      x: null,
      y: null,
    }
  );
  const [chosenBall, setChosenBall] = useState<number>(-1);
  const [ballColor, setColor] = useState<string | null>(null);
  const [modalPlace, setModalPlace] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const drawBall = (ball: IBall, ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  const controlWallsShock = (asix: "x" | "y", ball: IBall) => {
    const border = asix === "x" ? fieldWidth : fieldHeight;
    const speed = asix === "x" ? "speed_x" : "speed_y";
    if (ball[asix] < radius || ball[asix] > border - radius) {
      ball[asix] = ball[asix] < radius ? radius * 1.01 : border - radius;
      ball[speed] = -ball[speed] * 0.5;
    }
    return ball;
  };

  const watchCollision = () => {
    setBalls((balls) => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          if (
            Math.sqrt(
              Math.pow(balls[j].x - balls[i].x, 2) +
                Math.pow(balls[j].y - balls[i].y, 2)
            ) <=
            2 * radius
          ) {
            const delta = calcDelta([balls[i], balls[j]]);
            // разобраться с направлениями отстрела)
            balls[i].speed_x = (balls[j].speed_x - balls[i].speed_x) * 0.5;
            balls[j].speed_x = (balls[i].speed_x - balls[j].speed_x) * 0.5;
            balls[i].speed_y = (balls[j].speed_y - balls[i].speed_y) * 0.5;
            balls[j].speed_y = (balls[i].speed_y - balls[j].speed_y) * 0.5;
            balls[i].x =
              balls[i].x - balls[j].x > 0
                ? balls[j].x + delta.x * 1.05
                : balls[j].x - delta.x * 1.05;
            balls[i].y =
              balls[i].y - balls[j].y > 0
                ? balls[j].y + delta.y * 1.05
                : balls[j].y - delta.y * 1.05;
          }
        }
      }
      return balls;
    });
  };

  const watchWallShock = () => {
    setBalls((balls) => {
      const ballsShocked = balls.map((ball, index) => {
        if (ball.speed_x !== 0) {
          ball.speed_x = Math.abs(ball.speed_x) < 0.08 ? 0 : ball.speed_x;
          ball.x += ball.speed_x;
          ball = controlWallsShock("x", ball);
        }
        if (ball.speed_y !== 0) {
          ball.speed_y = Math.abs(ball.speed_y) < 0.08 ? 0 : ball.speed_y;
          ball.y += ball.speed_y;
          ball = controlWallsShock("y", ball);
        }
        return ball;
      });
      return ballsShocked;
    });
  };

  const controlShock = () => {
    watchWallShock();
    watchCollision();
  };

  const drawField = () => {
    const canvasElement = fieldRef.current!;
    const ctx = (canvasElement! as HTMLCanvasElement).getContext("2d")!;
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);
    ctx.strokeRect(0, 0, fieldWidth, fieldHeight);
    balls.forEach((ball) => {
      drawBall(ball, ctx);
    });
    const isAnyMove = balls.some(
      (ball) => ball.speed_x !== 0 || ball.speed_y !== 0
    );
    controlShock();
    setAnimation(isAnyMove);
    if (!isModalOpen && isAnyMove && raf === null) {
      setRaf(window.requestAnimationFrame(() => drawField()));
    }
  };

  useEffect(() => {
    const canvasElement = fieldRef.current;
    if (
      canvasElement &&
      (canvasElement as HTMLCanvasElement)?.getContext("2d")
    ) {
      if (balls.length === 0) {
        createBallsArr(balls, setBalls);
      }
      drawField();
    } else {
      // canvas-unsupported code here
    }
  }, [ballColor, setColor]);

  useEffect(() => {
    if (isAnimation) {
      console.log("Animation", isAnimation);
      setRaf(window.requestAnimationFrame(() => drawField()));
    } else if (typeof raf === "number" && !isAnimation) {
      console.log("stop Animation", isAnimation, "raf", raf);
      window.cancelAnimationFrame(raf as number);
      setChosenBall(-1);
      setRaf(null);
    }
  }, [isAnimation]);

  const checkClickBall = (event: MouseEvent) => {
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;
    const indexClickBall = balls.findIndex(
      (ball) =>
        Math.abs(clickX - ball.x) <= 20 && Math.abs(clickY - ball.y) <= 20
    );
    return indexClickBall;
  };

  const handleMouseDown = (event: any) => {
    const indexBall = checkClickBall(event);
    if (indexBall != -1) {
      setDown({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
    }
    setChosenBall(indexBall);
  };

  const handleMouseUp = (event: any) => {
    setModalOpen(false);
    const mouseUp = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    const isMoving =
      Math.abs(mouseDown.x! - mouseUp.x!) > radius ||
      Math.abs(mouseDown.y! - mouseUp.y!) > radius;
    if (chosenBall != -1 && isMoving) {
      // начало движения
      const ballSpeed = {
        x: (mouseUp.x! - mouseDown.x!) * 0.01,
        y: (mouseUp.y! - mouseDown.y!) * 0.01,
      };
      setBalls((balls) => {
        balls[chosenBall].speed_x = ballSpeed.x;
        balls[chosenBall].speed_y = ballSpeed.y;
        return balls;
      });
      raf = window.requestAnimationFrame(() => drawField()) as number;
    } else if (chosenBall != -1 && !isMoving) {
      console.log("menu on ball", chosenBall);
      setModalPlace({ x: balls[chosenBall].x, y: balls[chosenBall].y });
      setColor(balls[chosenBall].color);
      setModalOpen(true);
    }
    setDown({ x: null, y: null });
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={fieldRef}
        width={fieldWidth}
        height={fieldHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      ></canvas>
      {isModalOpen && (
        <Menu
          modalPlace={modalPlace ? modalPlace : { x: 0, y: 0 }}
          ballColor={ballColor}
          setColor={setColor}
          chosenBall={chosenBall}
          setBalls={setBalls}
          setModalOpen={setModalOpen}
          setModalPlace={setModalPlace}
        />
      )}
    </div>
  );
};

export default Field;
