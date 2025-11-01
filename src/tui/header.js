
const blessed = require('blessed');

module.exports = (grid, screen) => {
  const headerBox = grid.set(0, 0, 1, 12, blessed.box, {
    content: '\n\nJules Checker\n<Made by Reinhart>\n',
    align: 'center',
    valign: 'middle',
    style: {
      fg: 'white',
      bg: 'blue'
    }
  });

  const animationFrames = [
    `
  ██╗██╗   ██╗██╗     ███████╗███████╗
  ██║██║   ██║██║     ██╔════╝██╔════╝
  ██║██║   ██║██║     █████╗  ███████╗
  ██║██║   ██║██║     ██╔══╝  ╚════██║
  ██║╚██████╔╝███████╗███████╗███████║
  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
         C H E C K E R
  < by Reinhart - https://reinhart.pages.dev/ >
    `,
    `
  ██╗██╗   ██╗██╗     ███████╗███████╗
  ██║██║   ██║██║     ██╔════╝██╔════╝
  ██║██║   ██║██║     █████╗  ███████╗
  ██║██║   ██║██║     ██╔══╝  ╚════██║
  ██║╚██████╔╝███████╗███████╗███████║
  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
         C H E C K E R
  < by Reinhart - https://reinhart.pages.dev/ >
    `,
    `
  ██╗██╗   ██╗██╗     ███████╗███████╗
  ██║██║   ██║██║     ██╔════╝██╔════╝
  ██║██║   ██║██║     █████╗  ███████╗
  ██║██║   ██║██║     ██╔══╝  ╚════██║
  ██║╚██████╔╝███████╗███████╗███████║
  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝
         C H E C K E R
  < by Reinhart - https://reinhart.pages.dev/ >
    `,
  ];

  let frameIndex = 0;
  setInterval(() => {
    headerBox.setContent(animationFrames[frameIndex]);
    screen.render();
    frameIndex = (frameIndex + 1) % animationFrames.length;
  }, 500);

  return headerBox;
};
