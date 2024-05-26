document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const cellWidth = "30px";
  const width = 10; // board width
  const height = 10;
  let isHorizontal = true;
  const shipPositions = [];
  const shipToStore = [];

  const navirex5 = [
    [0, width, width * 2, width * 3, width * 4],
    [0, 1, 2, 3, 4],
  ];

  const navirex4 = [
    [0, width, width * 2, width * 3],
    [0, 1, 2, 3],
  ];

  const navirex3 = [
    [0, width, width * 2],
    [0, 1, 2],
  ];

  const navirex2 = [
    [0, width],
    [0, 1],
  ];

  ships = [navirex5, navirex4, navirex3, navirex3, navirex2];

  let currentNavireIndex = -1; // index of the selected ship

  const board = document.getElementById("my-board");
  const boardOpponent = document.getElementById("opponent-board");
  const orientationButton = document.getElementById("orientation");

  createBoard();
  listAllShipsOnPanel();
  handleShipSelection();

  orientationButton.addEventListener("click", toggleOrientation);
  const cells = document.querySelectorAll("#my-board div");

  // écouteurs d'évenments sur my-board
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      handleCube(cell, "selected");
    });

    // cell.addEventListener("mouseenter", () => {
    //   let currentIndex = parseInt(cell.dataset.index);
    //   let stopIndex = (currentIndex % width) - 5;
    //   if (stopIndex > 0) {
    //     currentIndex = currentIndex - stopIndex;
    //   }

    //   navirex5[1].forEach((elt) => {
    //     const cube = document.querySelector(
    //       `[data-index="${elt + currentIndex}"]`
    //     );

    //     cube.classList.add("blue");
    //   });
    // });

    // cell.addEventListener("mouseleave", () => {
    //   currentIndex = parseInt(cell.dataset.index);
    //   let stopIndex = (currentIndex % width) - 5;
    //   if (stopIndex > 0) {
    //     currentIndex = currentIndex - stopIndex;
    //   }
    //   navirex5[1].forEach((elt) => {
    //     const cube = document.querySelector(
    //       `[data-index="${elt + currentIndex}"]`
    //     );
    //     cube.classList.remove("blue");
    //   });
    // });

    cell.addEventListener("mouseenter", () => {
      handleCube(cell, "add");
    });

    cell.addEventListener("mouseleave", () => {
      handleCube(cell, "remove");
    });
  });

  function handleCube(cell, action) {
    if (currentNavireIndex < 0) {
      return;
    }

    let currentBoat = isHorizontal
      ? ships[currentNavireIndex][1]
      : ships[currentNavireIndex][0];
    let currentIndex = parseInt(cell.dataset.index);
    currentIndex = computeIndexPosition(currentIndex, currentBoat);

    const containsAnySelected = currentBoat.some((elt) => {
      const cube = document.querySelector(
        `[data-index="${elt + currentIndex}"]`
      );
      return cube.classList.contains("selected");
    });

    currentBoat.forEach((elt, index, array) => {
      const cube = document.querySelector(
        `[data-index="${elt + currentIndex}"]`
      );

      if (containsAnySelected) {
        return;
      }

      switch (action) {
        case "add":
          cube.classList.add("blue");
          break;
        case "remove":
          cube.classList.remove("blue");
          break;
        case "selected":
          cube.classList.add("selected");
          shipToStore.push(elt + currentIndex);
          const boat = document.querySelector(
            `.ship[data-index="${currentNavireIndex}"]`
          );
          boat.style.display = "none";
          if (index === array.length - 1) {
            // on ne fait cette opération une fois atteint le dernier élément du tableau atteint
            currentNavireIndex = -1;
            shipPositions.push([...shipToStore]);
            shipToStore.length = 0; // on vide le tableau
            if (shipPositions.length === ships.length) {
              joinButton.style.display = "block";
            }
          }
          break;
      }
    });
  }

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const div = document.createElement("div");
      div.style.width = cellWidth;
      div.style.height = cellWidth;
      div.dataset.index = i;
      board.appendChild(div);
      boardOpponent.appendChild(div.cloneNode());
    }
  }
  function listAllShipsOnPanel() {
    ships.forEach((ship, index) => {
      const panel = document.querySelector(".panel");
      const p = document.createElement("p");
      p.classList.add("ship");
      p.dataset.index = index;
      panel.appendChild(p);

      for (let cell of ship[0]) {
        const div = document.createElement("div");
        div.style.width = cellWidth;
        div.style.height = cellWidth;
        p.appendChild(div);
      }
    });
  }

  function handleShipSelection() {
    const boats = document.querySelectorAll(".ship");
    boats.forEach((boat) => {
      boat.addEventListener("click", (e) => {
        currentNavireIndex = parseInt(boat.dataset.index);
        boat.classList.add("boat-selected-panel");
      });
    });
  }

  function toggleOrientation() {
    isHorizontal = !isHorizontal;
    orientationButton.textContent = isHorizontal ? "Horizontal" : "Vertical";
  }
  function computeIndexPosition(currentIndex, currentBoat) {
    if (isHorizontal) {
      let stopIndex = width - currentBoat.length;
      let moduloIndex = currentIndex % width;
      if (moduloIndex > stopIndex) {
        currentIndex = currentIndex - (moduloIndex - stopIndex);
      }
    } else {
      let rowIndex = Math.floor(currentIndex / width);
      let maxRowIndex = height - currentBoat.length;
      if (rowIndex > maxRowIndex) {
        currentIndex = currentIndex - (rowIndex - maxRowIndex) * width;
      }
    }

    return currentIndex;
  }

  const joinButton = document.getElementById("join-game");
  const opponentCells = document.querySelectorAll("#opponent-board div");

  joinButton.addEventListener("click", () => {
    socket.emit("join-game", shipPositions);
  });

  opponentCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      socket.emit("attack", cell.dataset.index);
    });
  });

  socket.on("touched", (index) => {
    console.log("touched", index);
    const cell = document.querySelector(
      `#opponent-board div[data-index="${index}"]`
    );
    cell.classList.add("touched");
  });

  socket.on("missed", (index) => {
    console.log("missed", index);
    const cell = document.querySelector(
      `#opponent-board div[data-index="${index}"]`
    );
    cell.textContent = "*";
  });
});
