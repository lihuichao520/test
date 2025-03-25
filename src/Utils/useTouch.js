const TAP_OFFSET = 5;

const getDirection = (x, y) => {
  if (x > y) {
    return 'horizontal';
  }
  if (y > x) {
    return 'vertical';
  }
  return '';
};

const useTouch = () => {
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let offsetX = 0;
  let offsetY = 0;
  let direction = ''; // '' | 'vertical' | 'horizontal'
  let isTap = true;

  const isVertical = () => direction === 'vertical';
  const isHorizontal = () => direction === 'horizontal';

  const reset = () => {
    deltaX = 0;
    deltaY = 0;
    offsetX = 0;
    offsetY = 0;
    direction = '';
    isTap = true;
  };

  const start = (event) => {
    reset();
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  };

  const move = (event) => {
    const touch = event.touches[0];
    // safari back will set clientX to negative number
    deltaX = (touch.clientX < 0 ? 0 : touch.clientX) - startX;
    deltaY = touch.clientY - startY;
    offsetX = Math.abs(deltaX);
    offsetY = Math.abs(deltaY);

    // lock direction when distance is greater than a certain value
    const LOCK_DIRECTION_DISTANCE = 10;
    if (
      !direction
      || (offsetX < LOCK_DIRECTION_DISTANCE
        && offsetY < LOCK_DIRECTION_DISTANCE)
    ) {
      direction = getDirection(offsetX, offsetY);
    }

    if (
      isTap
      && (offsetX > TAP_OFFSET || offsetY > TAP_OFFSET)
    ) {
      isTap = false;
    }
  };

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap,
  };
};

export {
  getDirection,
  useTouch,
};
