import "./style.css";
import { Renderer } from "./Renderer";
import { Game } from "./Game";

const ticTacToe = new Game(new Renderer())
ticTacToe.startGame()

