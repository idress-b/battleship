document.addEventListener("DOMContentLoaded", () => {
  const cellWidth = "30px";
  const width = 10; // board width

  const navirex5 = [
    [0, width, width * 2, width * 3, width * 4],
    [0, 1, 2, 3, 4],
  ];

  currentNavire = navirex5;

  console.log(navirex5[0]);
  const board = document.querySelector(".board");

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const div = document.createElement("div");
      div.style.width = cellWidth;
      div.style.height = cellWidth;
      div.dataset.index = i;
      board.appendChild(div);
    }
  }

  createBoard();

  const cells = document.querySelectorAll(".board div");

  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      console.log("click");
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
    let currentIndex = parseInt(cell.dataset.index);

    let stopIndex = (currentIndex % width) - 5;
    console.log(
      currentIndex,
      currentIndex + 40,
      currentIndex - (currentIndex + 40 - 99)
    );
    if (stopIndex > 0) {
      currentIndex = currentIndex - stopIndex;
    }

    navirex5[1].forEach((elt) => {
      const cube = document.querySelector(
        `[data-index="${elt + currentIndex}"]`
      );

      action === "add"
        ? cube.classList.add("blue")
        : cube.classList.remove("blue");
    });
  }
});
