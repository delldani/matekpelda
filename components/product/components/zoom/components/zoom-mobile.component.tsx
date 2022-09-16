import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { makeCanvas } from '../../../helper';
interface ZoomMobileProps {
  src: string | undefined;
  onExpandThumbnail: (show: boolean) => void;
  imageWidth: number;
}

/**
 * a kinagyítandó kép mobil méreten
 * @param src A nagyítandó kép url-je
 * @param onExpandThumbnail  A thumbnail-t megjeleníti vagy eltünteti
 * @param images A thumbnail image-ek tömbje
 * @param imageWidth A kép max-szélessége
 */
export const ZoomMobile = (props: ZoomMobileProps) => {
  const { src, onExpandThumbnail, imageWidth } = props;

  const canvasRef = React.useRef<HTMLImageElement>();
  const imageRectangleRef = React.useRef<DOMRect>();

  const INCREASE_RATIO = 3;

  React.useEffect(() => {
    setRectanglesSizes();
    window.addEventListener('resize', windowResize);

    return () => window.removeEventListener('resize', windowResize);
  }, []);

  React.useEffect(() => {
    canvasRef.current?.style.removeProperty('top');
    canvasRef.current?.style.removeProperty('left');
    const element = document.getElementById('canvas');
    element && makeCanvas(element as HTMLCanvasElement, src);
  }, [src]);

  const setRectanglesSizes = () => {
    imageRectangleRef.current = canvasRef.current?.getBoundingClientRect();
  };
  const windowResize = () => {
    setRectanglesSizes();
  };

  /**
   * Vagy egér hoverál a képbe, vagy touch event a képen, kinagyítja a képet
   */
  const userEnterContainer = () => {
    // néha elveszíti mobil eszközön a canvasref - et, újra meg kell adni
    imageRectangleRef.current = canvasRef.current?.getBoundingClientRect();
    (canvasRef.current as HTMLImageElement).style.transform = `scale(${INCREASE_RATIO})`;
    (canvasRef.current as HTMLImageElement).style.transition = 'top,left 400ms cubic-bezier(0,0,0,1) .01s';
  };

  /**
   * Egér kilép vagy touchend event mobilon, visszaállítja a kép méretét kissebbre
   */
  const userLeaveContainer = () => {
    if (canvasRef.current) {
      canvasRef.current.style.transition = 'none';
      canvasRef.current.style.transform = 'scale(1)';

      canvasRef.current.style.top = '0px';
      canvasRef.current.style.left = '0px';
    }
  };

  /**
   * vagy egér mozgatása a kép felett vagy touch -al mozgatás mobilon, mozgatja a képet
   * @param cordX a képen bellüli koordináta X
   * @param cordY a képen bellüli koordináta Y
   */
  const userMoveInContainer = (cordX: number, cordY: number) => {
    if (canvasRef.current && imageRectangleRef.current) {
      const x = cordX - imageRectangleRef.current.left;
      const y = cordY - imageRectangleRef.current.top;

      canvasRef.current.style.top =
        -y * (INCREASE_RATIO - 1) + (INCREASE_RATIO / 2 - 0.5) * imageRectangleRef.current.width + 'px';
      canvasRef.current.style.left =
        -x * (INCREASE_RATIO - 1) + (INCREASE_RATIO / 2 - 0.5) * imageRectangleRef.current.width + 'px';
    }
  };

  const onMouseMoveContainer = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    userMoveInContainer(e.pageX, e.pageY);
  };
  const onTouchMoveContainer = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.targetTouches[0]) {
      userMoveInContainer(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
  };

  const onClickShowThumbnail = () => {
    onExpandThumbnail(true);
  };

  // Konténerben canvas element, ami kinagyítódik és mozog hover esetén, illetve mobilon ha touchMove van ugyanez
  return (
    <Box sx={style} className="mobile-zoom">
      <div
        className={'container'}
        style={{ maxWidth: imageWidth + 'px', maxHeight: imageWidth + 'px' }}
        onClick={onClickShowThumbnail}
        onMouseMove={onMouseMoveContainer}
        onMouseEnter={userEnterContainer}
        onMouseLeave={userLeaveContainer}
        onTouchMove={onTouchMoveContainer}
        onTouchStart={userEnterContainer}
        onTouchEnd={userLeaveContainer}
      >
        <div ref={canvasRef as React.MutableRefObject<HTMLImageElement>} className="canvas-wrapper">
          <canvas
            className="canvas"
            id="canvas"
            width={imageWidth}
            height={imageWidth}
            onLoad={() => {
              setRectanglesSizes();
            }}
          />
        </div>
      </div>
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  '& .container': {
    position: 'relative',
    overflow: 'hidden',
    width: 'calc(100vw - 20px)',
    height: 'calc(100vw - 20px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'none',
    touchAction: 'none', // nem engedi hogy scrollozódjon az oldal amikor touchMove van a képen
    '&:hover': {
      border: '1px solid #aaa',
      borderColor: 'rgba(170, 170, 170, 0.7)',
      boxShadow: '0 0 5px rgb(0 0 0 / 30%)',
    },
    '& .canvas-wrapper': {
      position: 'absolute',
      cursor: 'zoom-in',
      width: '100%',
      height: '100%',
    },
    '& .canvas': {
      width: '100%',
    },
  },
});
