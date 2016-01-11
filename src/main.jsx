import React from "react"

import "./style.css"
import Vector from "./Vector"
import SnakeGame from "./SnakeGame"
import MultiSnakeGame from "./MultiSnakeGame"
import Board from "./Board"
import Bacon from "baconjs"
import _ from "underscore"

// TODO: what happens when server is unavailable for a while and socket closes?
const ws = new WebSocket("ws://localhost:8080/snakeSocket")
const playerName = window.location.pathname.substr(1)

ws.onopen = () => {
  const wsMessages = Bacon.fromEvent(ws, "message").map(".data")
  const playerStates = wsMessages.map(msg => JSON.parse(msg))
  const fruitStates = playerStates.map(state => state.fruitPosition)

  const newSnakeCallback = (snakePositions) => {
    ws.send(JSON.stringify({ playerName: playerName, positions: snakePositions }))
  }

  React.render(<MultiSnakeGame
                        boardSize={new Vector(20, 20)}
                        playerName={playerName}
                        playerStates={playerStates}
                        fruitStates={fruitStates}
                        onNewSnake={newSnakeCallback} />, document.getElementById("app"))
}

// TODO: single or multiplayer mode switched by URL param
ws.onerror = () => {
  React.render(<SnakeGame boardSize={new Vector(20, 20)} />, document.getElementById("app"))
}
