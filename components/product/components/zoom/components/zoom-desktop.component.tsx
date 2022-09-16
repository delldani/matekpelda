import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { ZoomPosition } from '../../../product.types';
import { makeCanvas, isWindowExist } from '../../../helper';

const INCREASE_RATIO = 4;

interface ZoomDesktopProps {
  imageSrc: string | undefined;
  onExpandThumbnail: (show: boolean) => void;
  imageWidth?: number;
  zoomPosition?: ZoomPosition;
  padding: number;
}

/**
 * Desktopon a kép amin a nagyító négyzet van és a kinagyított kép mellette, ami megjelenik
 * @param imageSrc A nagyítandó kép url-je
 * @param onExpandThumbnail Megjeleníti nagyban a képet ha rákattintanak
 * @param zoomPosition A zoomolt kép elhelezkedése: lehet balra a képtől => left, jobbra => right, vagy abszolút koordinátákkal is meg lehet adni a bodyhoz képest => {left,right}
 * A zoom-olt kép mérete a nagyítás(INCREASE_RATIO) és a lencse(imageWidth) szorzata
 */

export const ZoomDesktop = (props: ZoomDesktopProps) => {
  const { imageSrc, onExpandThumbnail, zoomPosition, padding, imageWidth = 650 } = props;

  const HOVER_WIDTH = imageWidth / INCREASE_RATIO;

  const zoomRef = React.useRef<HTMLCanvasElement>();
  const containerRef = React.useRef<HTMLDivElement>();
  const lensRef = React.useRef<HTMLDivElement>();
  const lensImgRef = React.useRef<HTMLCanvasElement>();
  const borderRef = React.useRef<HTMLDivElement>();

  const [isShowZoom, setShowZoom] = React.useState<boolean>(false);

  React.useEffect(() => {
    isWindowExist() && makeCanvas(document.getElementById('canvas3') as HTMLCanvasElement, imageSrc);
  });
  React.useEffect(() => {
    if (isShowZoom) {
      setTimeout(() => {
        if (zoomRef.current && borderRef.current) {
          zoomRef.current.style.opacity = '1';
          borderRef.current.style.opacity = '1';
        }
      }, 200);
    } else {
      if (zoomRef.current && borderRef.current) {
        zoomRef.current.style.opacity = '0';
        borderRef.current.style.opacity = '0';
      }
    }
  }, [isShowZoom]);

  React.useEffect(() => {
    makeCanvas(document.getElementById('canvas1') as HTMLCanvasElement, imageSrc);
    makeCanvas(document.getElementById('canvas2') as HTMLCanvasElement, imageSrc);
  }, [imageSrc]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;

    const container = containerRef.current as HTMLDivElement;
    const lens = lensRef.current as HTMLDivElement;

    const containerRect = container.getBoundingClientRect();
    const lensRect = lens.getBoundingClientRect();

    const limitLeft = 0;
    const limitRight = containerRect.width - lensRect.width;

    const limitTop = 0;
    const limitBottom = containerRect.height - lensRect.height;

    const newX = clientX - containerRect.left - lensRect.width / 2;
    const newY = clientY - containerRect.top - lensRect.height / 2;

    const x = Math.min(Math.max(newX, limitLeft), limitRight);
    const y = Math.min(Math.max(newY, limitTop), limitBottom);

    if (lens) {
      lens.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (lensImgRef.current) {
      lensImgRef.current.style.transform = `translate(-${x}px, -${y}px)`;
    }
    (zoomRef.current as HTMLCanvasElement).style.top = -INCREASE_RATIO * y + 'px';
    (zoomRef.current as HTMLCanvasElement).style.left = -INCREASE_RATIO * x + 'px';
  };
  const onMouseLeave = () => {
    if (lensRef.current) {
      (lensRef.current as HTMLDivElement).style.transform = 'translate(-10000px, -10000px)';
      setShowZoom(false);
    }
  };

  const onMouseEnter = () => {
    setShowZoom(true);
  };

  const onClickShowThumbnail = () => {
    onExpandThumbnail(true);
  };

  interface PortalProps {
    component: JSX.Element;
  }
  const Portal = (props: PortalProps) => {
    const { component } = props;
    return ReactDOM.createPortal(component, document.body);
  };

  return (
    <div>
      <Box sx={style} className="image-lens-component">
        <div
          className="image-container"
          ref={containerRef as React.MutableRefObject<HTMLDivElement>}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          onClick={onClickShowThumbnail}
        >
          <div
            ref={lensRef as React.MutableRefObject<HTMLDivElement>}
            className="lens"
            style={{ width: HOVER_WIDTH + 'px', height: HOVER_WIDTH + 'px' }}
          >
            <canvas
              ref={lensImgRef as React.MutableRefObject<HTMLCanvasElement>}
              id="canvas1"
              width={imageWidth + 'px'}
              height={imageWidth + 'px'}
            />
          </div>
          <canvas
            className={clsx(isShowZoom ? 'show_canvas' : 'hide_canvas')}
            id="canvas2"
            width={imageWidth + 'px'}
            height={imageWidth + 'px'}
          />
        </div>
      </Box>

      {isWindowExist() && isShowZoom ? (
        <Portal
          component={
            <BigPicture
              zoomRef={zoomRef as React.MutableRefObject<HTMLCanvasElement>}
              padding={padding}
              isShowZoom={isShowZoom}
              containerRef={containerRef as React.MutableRefObject<HTMLDivElement>}
              imageWidth={imageWidth}
              zoomPosition={zoomPosition as ZoomPosition}
              borderRef={borderRef as React.MutableRefObject<HTMLDivElement>}
            />
          }
        />
      ) : null}
    </div>
  );
};

interface BigPictureProps {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  zoomRef: React.MutableRefObject<HTMLCanvasElement>;
  zoomPosition: ZoomPosition;
  padding: number;
  imageWidth: number;
  isShowZoom: boolean;
  borderRef: React.MutableRefObject<HTMLDivElement>;
}

/**
 * A kinagyított kép a jobb oldalon
 * @param props
 * @returns
 */
const BigPicture = (props: BigPictureProps) => {
  const { zoomRef, containerRef, imageWidth, isShowZoom, padding, zoomPosition, borderRef } = props;
  const { top, left } = calculateTopAndLeft(zoomPosition, containerRef, padding);

  return (
    <Box sx={pictureStyle} className={clsx(isShowZoom ? 'show_zoom' : 'hide_zoom')}>
      <div
        className="zoom-wrapper"
        style={{ top: top, left: left, width: imageWidth + 'px', height: imageWidth + 'px' }}
      >
        <canvas
          id="canvas3"
          className="zoom"
          ref={zoomRef}
          width={imageWidth * INCREASE_RATIO + 'px'}
          height={imageWidth * INCREASE_RATIO + 'px'}
        />
        <div className="zoom-border" ref={borderRef} style={{ width: imageWidth + 'px', height: imageWidth + 'px' }} />
      </div>
    </Box>
  );
};

const calculateTopAndLeft = (
  zoomPosition: ZoomPosition,
  containerRef: React.MutableRefObject<HTMLDivElement>,
  padding: number
) => {
  let top = 0;
  let left = 0;
  if (zoomPosition === 'right') {
    top = containerRef.current?.offsetTop;
    left = containerRef.current?.offsetLeft + containerRef.current?.getBoundingClientRect().width + padding;
  } else if (zoomPosition === 'left') {
    top = containerRef.current?.offsetTop;
    left = containerRef.current?.offsetLeft - containerRef.current?.getBoundingClientRect().width - padding;
  } else {
    top = zoomPosition.top;
    left = zoomPosition.left;
  }
  return { top, left };
};

const style: SxProps<Theme> = (theme: Theme) => ({
  '& .image-container': {
    position: 'relative',
    display: 'inline-flex',
  },
  '& .show_canvas': {
    filter: 'grayscale(80%) opacity(60%)',
  },
  '& .hide_canvas': {
    filter: 'none',
  },
  '& .lens': {
    position: 'absolute',
    zIndex: 10,
    overflow: 'hidden',
    border: '1px solid #aaa',
    borderColor: 'rgba(170, 170, 170, 0.7)',
    boxShadow: '0 0 5px rgb(0 0 0 / 30%)',
    transformOrigin: '100%',
    cursor: 'zoom-in',
    transform: 'translate(-10000px, -10000px)',
  },
});

const pictureStyle: SxProps<Theme> = (theme: Theme) => ({
  '& .zoom-wrapper': {
    position: 'absolute',
    overflow: 'hidden',
  },
  '& .show_zoom': {
    display: 'block',
  },
  '& .hide_zoom': {
    display: 'none',
  },
  '& .zoom': {
    position: 'absolute',
    top: '-10000px',
    left: '-10000px',
    opacity: '0',
    transition: 'all 400ms cubic-bezier(0,0,0,1) .01s',
    backgroundColor: 'white',
    zIndex: 10,
  },
  '& .zoom-border': {
    position: 'absolute',
    top: '0px',
    left: '0px',
    opacity: '0',
    border: '1px solid #aaa',
    boxShadow: '0 0 5px rgb(0 0 0 / 30%)',
    borderColor: 'rgba(170,170,170,0.7)',
    zIndex: 12,
    transition: 'all 400ms cubic-bezier(0,0,0,1) .01s',
  },
});
