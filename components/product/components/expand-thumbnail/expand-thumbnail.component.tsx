import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';
import clsx from 'clsx';

import { ImageThumbnails } from '../zoom/components/thumbnails.component';
import { hasTouchScreen } from '../../helper';
import {
  setMobileScreenSize,
  isUnder,
  setButtonBackGround,
  getRectangleSizes,
  getBigPictureCoordinateFromMouse,
  getImageActualSize,
  useTouchDistance,
  getTouchMoveCoordinates
} from '../../helper';

// a kétszeres nagyítás a kép originál méretéből számolódik (nem amekkorába ki van rakva)
export const INCREASE_RATIO = 4;
export const IMAGE_BASESCALE_RATIO_MOBILE = 1;
export const IMAGE_BASESCALE_RATIO_DESKTOP = 0.7;
export const SMALL_SIZE = 700;
interface ExpandThumbnailProps {
  src?: string;
  onShowThumbnail: (show: boolean) => void;
  onChangeImage: (index: number | 'left' | 'right') => boolean;
  images: string[];
}

/**
 * Az éppen aktuális képre kattintva kiteszi a képernyőre, illetve belekattintva, kinagyítja
 * @param src A nagyítandó kép url-je
 * @param onShowThumbnail A thumbnail-t megjeleníti vagy eltünteti
 * @param onChangeImage meghívásával változtatja a főképet a thumbnail alapján, kaphat index-et (hanyadik thumbnail legyen) , vagy 'left' / 'right' -léptetés esetén
 */
export const ExpandThumbnail = (props: ExpandThumbnailProps) => {
  const { src, onShowThumbnail, onChangeImage, images } = props;
  const isTouchScreen = hasTouchScreen();
  const imageRef = React.useRef<HTMLImageElement>();
  const wrapperRef = React.useRef<HTMLDivElement>();
  const screenRef = React.useRef<HTMLDivElement>();
  const [isZoom, setIsZoom] = React.useState<boolean>(false);


  const { distanceX, distanceY, nextTouch, startingPoint } = useTouchDistance();
  //Touch screen-nél az alap helyzete a top/left koordinátának nagyítás utn, amikhez hozzáadódik a touchXShift/touchYShift ami folyamatosan nŐ/csökken
  const touchX = React.useRef<number>(1);
  const touchY = React.useRef<number>(1);

  const originImageSizeWidth = React.useRef<number>(0);
  const distanceBetweenWrapperAndOriginImageWidth = React.useRef<number>(0);
  const leftIncreasedImage = React.useRef<number>(0);
  const originImageSizeHeight = React.useRef<number>(0);
  const distanceBetweenWrapperAndOriginImageHeight = React.useRef<number>(0);
  const topIncreasedImage = React.useRef<number>(0);

  React.useEffect(() => {
    // le kell venni a bodyról a scroll-bart amikor kirakjuk a thumbnailt fullscren-ben
    document.body.style.overflow = 'hidden';
    // pinch zomm levétele a komopnensről, mert elrontja a koordinátákat
    document.body.style.touchAction = 'none';
    setMobileScreenSize(screenRef);
    setTimeout(() => {
      setImageScaleRatio('zoomOut');
    }, 200);
    window.addEventListener('resize', windowResize);
    return () => {
      window.removeEventListener('resize', windowResize);
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    };
  }, []);

  const windowResize = () => {
    placeImageCenter();
    setMobileScreenSize(screenRef);
    setImageScaleRatio('zoomOut');
    setZoom(false);
  };

  /**
   * Beállítja a kép méretét zoom-olásnál, mobilon. desktopon ..
   * @param isZoom
   */
  const setImageScaleRatio = (isZoom: 'zoomOut' | 'zoomIn') => {
    if (imageRef.current) {
      const smallSize = isUnder(SMALL_SIZE);
      if (isZoom === 'zoomOut') {
        smallSize
          ? (imageRef.current.style.transform = `scale(${IMAGE_BASESCALE_RATIO_MOBILE})`)
          : (imageRef.current.style.transform = `scale(${IMAGE_BASESCALE_RATIO_DESKTOP})`);
      } else {
        (imageRef.current as HTMLImageElement).style.transform = `scale(${INCREASE_RATIO})`;
      }
      setButtonBackGround(smallSize);
    }
  };

  /**
   * Kezeli a zoom-olás után a gombok style-ját
   * @param isZoom
   */
  const setZoom = (isZoomIn: boolean) => {
    setIsZoom(isZoomIn);
    (imageRef.current as HTMLImageElement).style.cursor = isZoomIn ? 'zoom-out' : 'zoom-in';
    setButtonBackGround(isZoomIn);
  };

  /**
   * Leveszi a top/left proprty-ket ezáltal középre helyezi a képet
   */
  const placeImageCenter = () => {
    if (imageRef.current) {
      imageRef.current.style.removeProperty('top');
      imageRef.current.style.removeProperty('left');
    }
  };

  /**
   * Bezár gombra kattintást kezeli
   */
  const handleClose = () => {
    onShowThumbnail(false);
  };

  /**
   * Vissza gombra kattintást kezeli
   */
  const onBackward = () => {
    const isNotFirstOrLast = handleImageChange('left');
    isZoom && isNotFirstOrLast && setButtonBackGround(false);
  };

  /**
   * Előre gombra kattintást kezeli
   */
  const onForward = () => {
    const isNotFirstOrLast = handleImageChange('right');
    !isZoom && isNotFirstOrLast && setButtonBackGround(false);
  };

  /**
   * Kezeli a kép cseréjét, ha nem az első vagy utolsó, akkor középre rakja a képet és kizoom-ol,
   * egyébként semmit ne csinál csak visszaad egy false-t
   * @param index
   * @return Visszaadja, hogy van e következő elem, ha van true ha nincs false
   */
  const handleImageChange = (index: number | 'left' | 'right'): boolean => {
    const isNotFirstOrLast = onChangeImage(index);
    if (isNotFirstOrLast) {
      placeImageCenter();
      setZoom(false);
    }
    return isNotFirstOrLast;
  };

  /**
   * Kezeli a képre kattintást
   */
  const handleZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isZoom) {
      //ha ki van nagyítva a kép
      setImageScaleRatio('zoomOut');
      placeImageCenter();
      setZoom(false);
    } else {
      if (imageRef.current && wrapperRef.current) {
        const { imageRect, wrapperRect } = getRectangleSizes(imageRef.current, wrapperRef.current);

        // át kell számolni hol lesz az image left/top mivel itt még nincs kinagyítva
        const { width, height } = getImageActualSize(
          imageRect.width,
          imageRect.height,
          isUnder(SMALL_SIZE),
          INCREASE_RATIO
        );
        // meg kell tudni hogy nagyítás után, az egér aktuális pozíciójának megfelelően, hova legyen állítva a kép
        const { imageRectX, imageRectY } = getBigPictureCoordinateFromMouse(
          width,
          height,
          wrapperRect.width,
          wrapperRect.height,
          e.clientX,
          e.clientY,
          INCREASE_RATIO
        );

        if (!isTouchScreen) {
          imageRef.current.style.left = imageRectX + 'px';
          imageRef.current.style.top = imageRectY + 'px';
        }

        setImageScaleRatio('zoomIn');
        setZoom(true);
      }
    }
  };

  /**
   * Kezeli ha a felhasználó mozgatja az egeret a zoom-olt képen ( tehát mozgatja azt), desktopon és touchscreenen is
   * @param cordX
   * @param cordY
   */
  const userMoveInWrapper = (cordX: number, cordY: number) => {
    if (imageRef.current && wrapperRef.current) {
      const { imageRect, wrapperRect } = getRectangleSizes(imageRef.current, wrapperRef.current);

      if (!isTouchScreen) {
        //Nem touch screen-en
        const { imageRectX, imageRectY } = getBigPictureCoordinateFromMouse(
          imageRect.width,
          imageRect.height,
          wrapperRect.width,
          wrapperRect.height,
          cordX,
          cordY,
          INCREASE_RATIO
        );
        //ha a kép kinagyítva kissebb mint a képernyő akkor nem mozgatja
        if (imageRect.width > wrapperRect.width) {
          imageRef.current.style.left = imageRectX + 'px';
        }
        if (imageRect.height > wrapperRect.height) {
          imageRef.current.style.top = imageRectY + 'px';
        }
      } else {
        // Touch screen
        const {newX,newY} = getTouchMoveCoordinates(distanceX,distanceY,touchX.current,touchY.current,leftIncreasedImage.current,
        distanceBetweenWrapperAndOriginImageWidth.current, topIncreasedImage.current, distanceBetweenWrapperAndOriginImageHeight.current)
       
        touchX.current = newX;
        touchY.current = newY;
        //ha a kép kinagyítva kissebb mint a képernyő akkor nem mozgatja
        if (imageRect.width  >  wrapperRect.width) {
          imageRef.current.style.left = newX + 'px';
        }
        if (imageRect.height > wrapperRect.height) {
          imageRef.current.style.top = newY + 'px';
        }
      }
    }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isZoom && userMoveInWrapper(e.clientX, e.clientY);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches[0]) {
      const x = e.targetTouches[0].clientX;
      const y = e.targetTouches[0].clientY;
      nextTouch(x, y);
      isZoom && userMoveInWrapper(x, y);
    }
  };

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches[0] && imageRef.current && wrapperRef.current) {
      startingPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
  };

  const onTransitionEnd = (e: React.TransitionEvent<HTMLImageElement>) => {
    //csak ascal-elés esetén fut le (zoom in/out)
    if (imageRef.current && wrapperRef.current && e.propertyName === 'transform') {
      const { imageRect, wrapperRect } = getRectangleSizes(imageRef.current, wrapperRef.current);
      //kiszámolja, hogy touch screen esetén,nagyítás után mi lessz a left és top kezdeti koordínátája
      //ez lessz az alap, amihez majd hozzáadódik az elmozdítás ( touchXShift,touchYShift)
      // a left és top pozíciónál a kezdeti (nagyítás/kicsinyítés) elötti értékeket kell venni
      touchX.current = Math.abs(wrapperRect.width - imageRect.width / INCREASE_RATIO) / 2;
      touchY.current = Math.abs(wrapperRect.height - imageRect.height / INCREASE_RATIO) / 2;
      //beállítja azokat az értékrkrt amik kelleni fognak mobilon, a zoomolt kép mozgatásához
      if(isTouchScreen){
        //kinagyítás elötti kép szélesség
        originImageSizeWidth.current = imageRect.width/INCREASE_RATIO;
        //az eredeti kép széle és a wrapper közti távolság
        distanceBetweenWrapperAndOriginImageWidth.current = (wrapperRect.width -originImageSizeWidth.current)/2; 
        //a kinagyított kép széle és a wrapper közti távolság
        leftIncreasedImage.current = (imageRect.width-wrapperRect.width) / 2;
        //kinagyítás elötti kép magasság
        originImageSizeHeight.current = imageRect.height/INCREASE_RATIO;
        //az eredeti kép teteje és a wrapper közti távolság
        distanceBetweenWrapperAndOriginImageHeight.current = (wrapperRect.height -originImageSizeHeight.current)/2; 
        //a kinagyított kép tetejeés a wrapper közti távolság
        topIncreasedImage.current = (imageRect.height-wrapperRect.height) / 2;
      }
    }
  };
  return (
    <Box sx={style} ref={screenRef} className="zoom_thumbnail">
      <div
        className="image_wrapper"
        ref={wrapperRef as React.MutableRefObject<HTMLDivElement | null>}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
      >
        <img
          className="image"
          ref={imageRef as React.MutableRefObject<HTMLImageElement | null>}
          onClick={handleZoom}
          src={src}
          alt="kep"
          onLoad={() => {
            setImageScaleRatio('zoomOut');
          }}
          onTransitionEnd={onTransitionEnd}
        />
      </div>
      <div className={clsx('close_wrapper', isZoom ? 'hide' : 'show')}>
        <CloseIcon className="close_icon" onClick={handleClose} fontSize="large" />
      </div>
      <div className="backward_wrapper">
        <ArrowBackIosSharpIcon className="backward_icon" onClick={onBackward} fontSize="large" />
      </div>
      <div className="forward_wrapper">
        <ArrowForwardIosSharpIcon className="forward_icon" onClick={onForward} fontSize="large" />
        <div className="fake" />
      </div>
      <div className="thumbnail-wrapper">
        <ImageThumbnails images={images} onChangeImage={handleImageChange} />
      </div>
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  backgroundColor: 'white',
  top: 0,
  zIndex: 16,

  '& .image_wrapper': {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  '& .button_backGround_on': {
    borderRadius: '50%',
    backgroundColor: 'rgba(177, 173, 173, 0.5)',
  },
  '& .close_icon, .forward_icon, .backward_icon': {
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 1,
    fontSize: '60px',
    margin: '15px',

    '@media (max-width: 700px)': {
      fontSize: '40px',
    },
  },
  '& .backward_wrapper, .forward_wrapper, .close_wrapper': {
    position: 'absolute',
    zIndex: 1,
    width: '90px',
    height: '90px',
    '@media (max-width: 400px)': {
      width: '70px',
      height: '70px',
    },
  },
  '& .close_wrapper': {
    top: 0,
    right: 0,
  },
  '& .backward_wrapper': {
    top: '50%',
  },
  '& .forward_wrapper': {
    top: '50%',
    right: 0,
  },
  '& .backward_icon, .forward_icon': {
    top: '-50%',
  },
  '& .hide': {
    display: 'none',
  },
  '& .show': {
    display: 'block',
  },
  '& .image': {
    position: 'absolute',
    transform: 'scale(0)',
    transition: 'all 700ms cubic-bezier(0,0,0,1) .01s',
    maxWidth: '100%',
    maxHeight: '100%',
    cursor: 'zoom-in',
  },
  '& .thumbnail_wrapper': {
    position: 'absolute',
    zIndex: 1,
    bottom: '0',
    left: '50%',
    transform: 'translate(-50%, 0%)',
  },
});
