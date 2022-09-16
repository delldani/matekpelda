import React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import {
  calculateActualPicture,
  useCoordinateDirection,
  getShift,
  getBigPictureCoordinateFromMouse,
  getImageActualSize,
  addClassToSVGElements,
  removeClassNameFromSVGElements,
  useTouchDistance,
  getTouchMoveCoordinates
} from './helper';

describe('Header conponent calculateActualPicture helper funtion test.', () => {
  test('calculateActualPicture function testing, array length 10, index = 5, make step to left', () => {
    const newPicture = calculateActualPicture('left', 5, 10);
    expect(newPicture).toBe(4);
  });
  test('calculateActualPicture function testing, array length 10, actual picture  = 5, make step to right, give back 6', () => {
    const newPicture = calculateActualPicture('right', 5, 10);
    expect(newPicture).toBe(6);
  });
  test('calculateActualPicture function testing, array length 10, actual picture  = 0, make step to left, give back 0', () => {
    const newPicture = calculateActualPicture('left', 0, 10);
    expect(newPicture).toBe(0);
  });
  test('calculateActualPicture function testing, array length 10, actual picture  = 12, make step to left, give back null', () => {
    const newPicture = calculateActualPicture('left', 12, 10);
    expect(newPicture).toBe(null);
  });
  test('calculateActualPicture function testing, array length = 10, actual picture = 5, index = 2 give back 2', () => {
    const newPicture = calculateActualPicture(2, 5, 10);
    expect(newPicture).toBe(2);
  });
  test('calculateActualPicture function testing, array length = 10, actual picture = 5, index = 11 give back null', () => {
    const newPicture = calculateActualPicture(11, 5, 10);
    expect(newPicture).toBe(null);
  });
});

const TestComponent = () => {
  const [X, setX] = React.useState(0);
  const [Y, setY] = React.useState(0);

  const { distanceX, distanceY, nextTouch, startingPoint } = useTouchDistance();
  const getCoordinate = useCoordinateDirection();
  const { xGrow, yGrow } = getCoordinate(X, Y);

  return (
    <div>
      <button onClick={() => setX(X + 1)}>upX</button>
      <button onClick={() => setX(X - 1)}>downX</button>
      <button onClick={() => setY(Y + 1)}>upY</button>
      <button
        onClick={() => {
          startingPoint(100, 100);
        }}
      >
        startingPoint
      </button>
      <button
        onClick={() => {
          nextTouch(110, 110);
        }}
      >
        nextTouch_110_110
      </button>
      <button
        onClick={() => {
          nextTouch(90, 90);
        }}
      >
        nextTouch_90_90
      </button>
      <div data-testid="xGrow">{xGrow ? 'true' : 'false'}</div>
      <div data-testid="yGrow">{yGrow ? 'true' : 'false'}</div>
      <div data-testid="distanceX">{distanceX}</div>
      <div data-testid="distanceY">{distanceY}</div>
      <div className="svg_parent">
        <svg className="svg_element class_name_to_remove">
          <path />
        </svg>
      </div>
    </div>
  );
};

describe('Header conponent useCoordinateDirection helper funtion test.', () => {
  test('useCoordinateDirection render in testComponent and gives {false,false} in the first time', () => {
    render(<TestComponent />);
    const elementXGrow = screen.getByTestId('xGrow');
    const elementYGrow = screen.getByTestId('yGrow');

    expect(elementXGrow.innerHTML).toBe('false');
    expect(elementYGrow.innerHTML).toBe('false');
  });

  test('useCoordinateDirection gives {true,false} if added 1 to x coordinate, and y remained the same', () => {
    render(<TestComponent />);
    const elementXGrow = screen.getByTestId('xGrow');
    const elementYGrow = screen.getByTestId('yGrow');
    const buttonXUp = screen.getByText('upX');

    fireEvent.click(buttonXUp);
    expect(elementXGrow.innerHTML).toBe('true');
    expect(elementYGrow.innerHTML).toBe('false');
  });

  test('useCoordinateDirection gives {true,tre} if added 1 to x coordinate, and added 1 to y', () => {
    render(<TestComponent />);
    const elementXGrow = screen.getByTestId('xGrow');
    const elementYGrow = screen.getByTestId('yGrow');
    const buttonXUp = screen.getByText('upX');
    const buttonYUp = screen.getByText('upY');

    fireEvent.click(buttonXUp);
    expect(elementXGrow.innerHTML).toBe('true');
    fireEvent.click(buttonYUp);
    expect(elementYGrow.innerHTML).toBe('true');
  });

  test('useCoordinateDirection gives {false,false} after added 1 to X  then substracted 1 from X', () => {
    render(<TestComponent />);
    const elementXGrow = screen.getByTestId('xGrow');
    const elementYGrow = screen.getByTestId('yGrow');
    const buttonXUp = screen.getByText('upX');
    const buttonXDown = screen.getByText('downX');

    fireEvent.click(buttonXUp);
    expect(elementXGrow.innerHTML).toBe('true');
    expect(elementYGrow.innerHTML).toBe('false');
    fireEvent.click(buttonXDown);
    expect(elementXGrow.innerHTML).toBe('false');
    expect(elementYGrow.innerHTML).toBe('false');
  });
});

describe('Header conponent getShift helper funtion test.', () => {
  test('getShift gives back 12.5 from 50 if INCREASE_RATIO 2,and, 20 from 50 if INCREASE_RATIO 5', () => {
    let INCREASE_RATIO = 2;
    expect(getShift(50, INCREASE_RATIO)).toBe(12.5);
    INCREASE_RATIO = 5;
    expect(getShift(50, INCREASE_RATIO)).toBe(20);
  });
});

describe('Header conponent getBigPictureCoordinateFromMouse helper funtion test.', () => {
  test('getBigPictureCoordinateFromMouse gives back right result', () => {
    const INCREASE_RATIO = 2;
    const result = getBigPictureCoordinateFromMouse(1500, 1200, 1200, 900, 100, 100, INCREASE_RATIO);
    expect(result).toStrictEqual({ imageRectX: 350, imageRectY: 266.6666666666667 });
  });
});

describe('Header conponent getImageActualSize helper funtion test.', () => {
  test('getImageActualSize gives back right result', () => {
    expect(getImageActualSize(560, 560, false, 2)).toStrictEqual({ width: 1600, height: 1600 });
  });
});

describe('Header conponent addClassToSVGElements helper funtion test.', () => {
  test('addClassToSVGElements works properly.', () => {
    const { container } = render(<TestComponent />);
    const classList = container.getElementsByClassName('svg_element')[0]?.classList;
    expect(classList?.toString()).toBe('svg_element class_name_to_remove');
    addClassToSVGElements(['svg_parent'], 'test_class_name');
    expect(classList?.toString()).toBe('svg_element class_name_to_remove test_class_name');
  });
});

describe('Header conponent removeClassNameFromSVGElements helper funtion test.', () => {
  test('removeClassNameFromSVGElements works properly.', () => {
    const { container } = render(<TestComponent />);
    const classList = container.getElementsByClassName('svg_element')[0]?.classList;
    expect(classList?.toString()).toBe('svg_element class_name_to_remove');
    removeClassNameFromSVGElements(['svg_parent'], 'class_name_to_remove');
    expect(classList?.toString()).toBe('svg_element');
  });
});

describe('Header conponent useTouchDistance helper funtion test.', () => {
  test('useTouchDistance works properly.', () => {
   
    render(<TestComponent />);
    const elementDistanceX = screen.getByTestId('distanceX');
    const elementDistanceY = screen.getByTestId('distanceY');
    const buttonStartingPoint = screen.getByText('startingPoint');
    const buttonNextTouch = screen.getByText('nextTouch_110_110');
    const buttonNextTouch2 = screen.getByText('nextTouch_90_90');

    expect(elementDistanceX.innerHTML).toBe('0');
    expect(elementDistanceY.innerHTML).toBe('0');
    fireEvent.click(buttonStartingPoint);
    fireEvent.click(buttonNextTouch);
    expect(elementDistanceX.innerHTML).toBe('-10');
    expect(elementDistanceY.innerHTML).toBe('-10');
    fireEvent.click(buttonNextTouch2);
    expect(elementDistanceX.innerHTML).toBe('20');
    expect(elementDistanceY.innerHTML).toBe('20');
  });
});

describe('Header conponent getTouchMoveCoordinates helper funtion test.', () => {
  test('getTouchMoveCoordinates works properly.', () => {
   
   const { newX,newY } = getTouchMoveCoordinates(10,10,100,100,100,0,100,0)
    expect(newX.toString()).toBe("90");
    expect(newY.toString()).toBe('90');
   
  });
});

//nx run k2-web-components:test --testFile=product/product.spec.ts

/**
 * Különbözó nagyításoknál, mobil zoom ban csak a kép széléíg lehet húzni a képet
 * minden működik álló, fekvő téglalap és négyzet esetén
 * lehet lépkedni a képek között , a végén nem megy tovább
 */