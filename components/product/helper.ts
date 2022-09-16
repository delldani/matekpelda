import React from 'react';
import {
  IMAGE_BASESCALE_RATIO_DESKTOP,
  IMAGE_BASESCALE_RATIO_MOBILE,
  INCREASE_RATIO,
  SMALL_SIZE,
} from './components/expand-thumbnail/expand-thumbnail.component';

export const makeCanvas = (canvas: HTMLCanvasElement, imageSrc: string | undefined) => {
  if (canvas && imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvasContext = canvas.getContext('2d');
      canvasContext?.clearRect(0, 0, canvas.width, canvas.height);
      const wrh = image.width / image.height;
      let newWidth = canvas.width;
      let newHeight = newWidth / wrh;
      if (newHeight > canvas.height) {
        newHeight = canvas.height;
        newWidth = newHeight * wrh;
      }
      const xOffset = newWidth < canvas.width ? (canvas.width - newWidth) / 2 : 0;
      const yOffset = newHeight < canvas.height ? (canvas.height - newHeight) / 2 : 0;

      canvasContext?.drawImage(image, xOffset, yOffset, newWidth, newHeight);
    };
  }
};

export const isWindowExist = () => typeof window !== 'undefined';

/**
 * Visszaadja hogy hányadik lesz az aktuális kép, a képek tömbjéből, a léptetés után
 * @param index jobbra vagy balra az aktuális képtől, vagy kaphatja az új indexet is, akor csak visszaadja(ha rossz az index akkor null)
 * @param actualPicture aktuális kép indexe, ami éppen aktív, ki van rakva
 * @param imagesLength a képek tömb hossza
 * @returns viszaadja a sorban jobbra/ballra álló elemet léptetés után, ha nincs több akkor nem léptet tovább
 */
export const calculateActualPicture = (
  index: number | 'left' | 'right',
  actualPicture: number,
  imagesLength: number
): number | null => {
  // ha az index nincs benne a tömbben akkor null-t ad vissza
  // ha az aktuális kép nincs benne a tömbben akkor null-t ad
  if (index < 0 || index > imagesLength || actualPicture < 0 || actualPicture > imagesLength) {
    return null;
  }
  if (index === 'left') {
    if (actualPicture > 0) {
      return actualPicture - 1;
    } else {
      return actualPicture;
    }
  } else if (index === 'right') {
    if (actualPicture < imagesLength) {
      return actualPicture + 1;
    } else {
      return actualPicture;
    }
  } else {
    return index;
  }
};

/**
 * Visszaadja a kép és wrapper ref alapján a méret adatokat
 * @param image kép ref
 * @param wrapper wrapper ref
 * @returns
 */
export const getRectangleSizes = (image: HTMLImageElement, wrapper: HTMLDivElement) => {
  return { imageRect: image.getBoundingClientRect(), wrapperRect: wrapper.getBoundingClientRect() };
};

/**
 * Visszaadja hol legyen a nagyítás után a kép x / y koordinátája egy a adott egér pozíció alapján
 * @param imageWidth kép szélessége nagyítás után
 * @param imageHeight kép magassága nagyítás után
 * @param wrapperWidth a wrapper szélessége
 * @param wrapperHeight a wrapper magassága
 * @param cordX egér x koordináta teljes képernyőn
 * @param cordY egér y koordináta teljes képernyőn
 * @returns
 */
export const getBigPictureCoordinateFromMouse = (
  imageWidth: number,
  imageHeight: number,
  wrapperWidth: number,
  wrapperHeight: number,
  cordX: number,
  cordY: number,
  increaseRatio: number
) => {
  const shiftX = getShift(imageWidth, increaseRatio);
  const shiftY = getShift(imageHeight, increaseRatio);

  const remainingWidth = imageWidth - wrapperWidth;
  const speedX = -1 * (remainingWidth / wrapperWidth);

  const remainingHeight = imageHeight - wrapperHeight;
  const speedY = -1 * (remainingHeight / wrapperHeight);

  return { imageRectX: cordX * speedX + shiftX, imageRectY: cordY * speedY + shiftY };
};

/**
 * Kiszámolja mobil esetén a zoomolásnál, hogy mi a következő koordinátája a képnek húzás után.
 * Ellenőrzi, hogy ne lehessen túlhúzni a kép szélét a képernyőn
 * @param distanceX utolsó hoizontális húzás hossza
 * @param distanceY utolsó vertikális húzás hossza
 * @param touchX a kép utolsó x koordinátája
 * @param touchY a kép utolsó y koordinátája
 * @param leftIncreasedImage a kinagyított kép széle és a wrapper közti távolság
 * @param distanceBetweenWrapperAndOriginImageWidth az eredeti kép széle és a wrapper közti távolság
 * @param topIncreasedImage a kinagyított kép tetejeés a wrapper közti távolság
 * @param distanceBetweenWrapperAndOriginImageHeight az eredeti kép teteje és a wrapper közti távolság
 * @returns 
 */
export const getTouchMoveCoordinates = (distanceX:number,distanceY:number,touchX:number,touchY:number,leftIncreasedImage:number,
  distanceBetweenWrapperAndOriginImageWidth:number,topIncreasedImage:number,distanceBetweenWrapperAndOriginImageHeight:number
  )=>{
    let newX  = touchX;
    let newY = touchY; 

    if (distanceX < 0 && touchX - distanceX < leftIncreasedImage + distanceBetweenWrapperAndOriginImageWidth) {
      newX = touchX - distanceX;
    }
    if (distanceX > 0 && touchX - distanceX > distanceBetweenWrapperAndOriginImageWidth - leftIncreasedImage) {
      newX = touchX - distanceX;
    }
    //ha lefelé húzzák a képet és a kép szélét ne lehessen túlhúzni a képernyőn
    if (distanceY < 0 && touchY - distanceY < topIncreasedImage + distanceBetweenWrapperAndOriginImageHeight) {
        newY = touchY - distanceY;
    }
    if (distanceY > 0 &&  touchY - distanceY > distanceBetweenWrapperAndOriginImageHeight - topIncreasedImage) {
        newY = touchY - distanceY;
    };

    return {newX,newY};
};


/**
 * Visszaadja, hogy x/y koordináta nőtt-e vagy nem
 * @param x
 * @param y
 * @returns
 */
export const useCoordinateDirection = () => {
  const lastX = React.useRef(0);
  const lastY = React.useRef(0);

  const getDirection = (x: number, y: number) => {
    const xGrow = lastX.current < x;
    const yGrow = lastY.current < y;
    lastX.current = x;
    lastY.current = y;
    return { xGrow, yGrow };
  };

  return getDirection;
};

/**
 * Visszaadja, hogy a nagyítás után (a nagyítás az eredeti képméretből számítódik)mekkora lesz a távolság a kép oldala/teteje és az eredeti kép között
 * @param rectangleSide a kinagyított kép oldala(width vagy height)
 * @returns
 */
export const getShift = (rectangleSide: number, increaseRatio: number) =>
  (rectangleSide / (increaseRatio * 2)) * (increaseRatio - 1);

/**
 * Visszaadja a nagyobb kép méreteit kis méret-ből (700 alatt 0.7 re, felette 1 -re van kirakva a kép)
 * nagyítás esetén más lesz a végeredmény
 */
export const getImageActualSize = (width: number, height: number, isSmallSize: boolean, INCREASE_RATIO: number) => {
  const newWidth =
    (width / (isSmallSize ? IMAGE_BASESCALE_RATIO_MOBILE : IMAGE_BASESCALE_RATIO_DESKTOP)) * INCREASE_RATIO;
  const newHeight =
    (height / (isSmallSize ? IMAGE_BASESCALE_RATIO_MOBILE : IMAGE_BASESCALE_RATIO_DESKTOP)) * INCREASE_RATIO;
  return { width: newWidth, height: newHeight };
};

/**
 * Beállítja mobil miatt a tényleges képernyő méretet, mert a mobil eszközön a kezelősáv is benne van
 * @param screenRef
 */
export const setMobileScreenSize = (screenRef: React.MutableRefObject<HTMLDivElement | undefined>) => {
  if (screenRef.current) {
    //A telefon miatt kell, mert beleveszi alapból a böngésző sávot is..https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    screenRef.current.style.height = window.innerHeight + 'px';
  }
};

/**
 * Meghatározott méret alatt van e a screen
 * @param pxSize méret pixelben, amit vizsgál
 * @returns visszaadja boolean- be hogy igaz -e
 */
export const isUnder = (pxSize: number) => {
  return window.matchMedia(`(max-width: ${pxSize}px)`).matches;
};

/**
 * Hátteret ad vagy levesz a gombokról, hogy látszódjanak a a képen, 700px alatt nem veszi le a hátteret, tehát
 * mobilon mindíg rajta van a háttér
 * @param isBackGround rárak/levesz
 * @param wrapperClassNames Azok az parent element-ek amikben az SVG-k vannak ( nyilak,close-ikon.. )
 * @param classToAddOrDelete Annak a class-nak a neve amir rá kell rakni vagy le kell venni
 */
export const setButtonBackGround = (
  isBackGround: boolean,
  wrapperClassNames = ['close_wrapper', 'backward_wrapper', 'forward_wrapper'],
  classToAddOrDelete = 'button_backGround_on'
) => {
  isBackGround
    ? addClassToSVGElements(wrapperClassNames, classToAddOrDelete)
    : !isUnder(SMALL_SIZE) && removeClassNameFromSVGElements(wrapperClassNames, classToAddOrDelete);
};

/**
 * Rárak class-nevet svg element-re
 * @param wrapperClassNames amikre rá kell rakni, parent class nevek
 * @param classToAdd amit rá kell rakni
 */
export const addClassToSVGElements = (wrapperClassNames: string[], classToAdd: string) => {
  wrapperClassNames.map((wrapperClassName) => {
    //svg element-nek csak így tudtam lekérni az osztályait, és értéket adni neki, ha a parenten keresztül csináltam
    const parent = document.getElementsByClassName(wrapperClassName)[0];
    const svgElement = parent && parent.children[0];
    const classNamesOnSVG = svgElement && svgElement.getAttribute('class');
    if (classNamesOnSVG) {
      !classNamesOnSVG.includes(classToAdd) && svgElement.setAttribute('class', classNamesOnSVG + ' ' + classToAdd);
    }
  });
};

/**
 * Eltávolít class-nevet egy vagy több svg element-ről
 * @param wrapperClassNames  amikről el kell távolítani a classnevet
 * @param classToRemove az eltávolítandó class - név
 */
export const removeClassNameFromSVGElements = (wrapperClassNames: string[], classToRemove: string) => {
  wrapperClassNames.map((wrapperClassName) => {
    const parent = document.getElementsByClassName(wrapperClassName)[0];
    const svgElement = parent && parent.children[0];
    const classNamesOnSVG = svgElement && svgElement.getAttribute('class');
    if (classNamesOnSVG) {
      const clearedClasses = classNamesOnSVG
        .split(' ')
        .filter((className) => className !== classToRemove)
        .join(' ');
      svgElement.setAttribute('class', clearedClasses);
    }
  });
};

let waiting = false;
export function throttle(callback: any, limit: number): any {
  return function () {
    if (!waiting) {
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
      // @ts-ignore: Unreachable code error
      // eslint-disable-next-line prefer-rest-params
      return callback.apply(this, arguments);
    }
  };
}

/**
 * Visszaadja egy touch húzás hosszát
 * visszaadott függvények, értékek
 * startingPoint - ezzel kell megadni a húzás esetén a kezdő pontot
 * nextTouch - minden toushMove event -nél ezzel lehet megadni az új koordinátákat
 * distanceX, distanceY - ezek mutatják meg mekkora húzás törtánt az utolsó touchMove event óta
 * @returns 
 */
export const useTouchDistance = () => {
  const startX = React.useRef(0);
  const startY = React.useRef(0);
  const [distanceX, setDistanceX] = React.useState(0);
  const [distanceY, setDistanceY] = React.useState(0);

  const startingPoint = (x: number, y: number) => {
    startX.current = x;
    startY.current = y;
  };

  const nextTouch = (x: number, y: number) => {
      const newResultX = Math.floor(startX.current - x);
      setDistanceX(newResultX);
      startX.current = x;
      const newResultY = Math.floor(startY.current - y);
      setDistanceY(newResultY);
      startY.current = y;
  };

  return { startingPoint, nextTouch, distanceX, distanceY };
};

export const hasTouchScreen =()=>{

  return false;
  }; 
  