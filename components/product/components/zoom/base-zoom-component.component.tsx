import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { ZoomPosition } from '../../product.types';
import { ZoomDesktop } from './components/zoom-desktop.component';
import { ZoomMobile } from './components/zoom-mobile.component';
import { ImageThumbnails } from './components/thumbnails.component';
import { hasTouchScreen } from '../../helper';

interface ZoomComponentProps {
  images: string[];
  actualPictureFromProps: number;
  onExpandThumbnail: (show: boolean) => void;
  onChangeImage: (index: number | 'left' | 'right') => void;
  zoomPosition: ZoomPosition;
  padding?: number;
  imageWidth: number;
}

/**
 * Megjeleníti a képet, ha ráhoverálunk akkor kiteszi a nagyított képet
 * @param images A képek url-jei
 * @param onExpandThumbnail  A thumbnail-t megjeleníti fullscreen-ben vagy eltünteti
 * @param onChangeImage meghívásával változtatja a főképet a thumbnail alapján, kaphat index-et (hanyadik thumbnail legyen) , vagy 'left' / 'right' -léptetés esetén
 * @param zoomPosition A zoomolt kép elhelezkedése: lehet balra a képtől => left, jobbra => right, vagy abszolút koordinátákkal is meg lehet adni a bodyhoz képest => {left,right}
 * @param padding A kép és a zoomolt kép közötti távolság pixelben
 * @param imageWidth Desktop-nézetben a kép és a zoomolt kép szélessége
 * @param actualPictureFromProps Beállítható a komponens melyik képet mutassa
 */

export const ZoomComponent = (props: ZoomComponentProps) => {
  const {
    images,
    onExpandThumbnail,
    onChangeImage,
    actualPictureFromProps,
    zoomPosition,
    padding = 0,
    imageWidth,
  } = props;

  const [actualPicture, setActualPicture] = React.useState<number>(actualPictureFromProps);
  const [isMobile, setIsMobile] = React.useState<boolean>();
  const zoomRef = React.useRef<HTMLDivElement>();
  const isTouchScreen = hasTouchScreen();

  React.useEffect(() => {
    window.addEventListener('resize', windowResize);
    return () => {
      window.removeEventListener('resize', windowResize);
    };
  }, []);

  React.useEffect(() => {
    setActualPicture(actualPictureFromProps);
  }, [actualPictureFromProps]);

  React.useEffect(() => {
    setScreen();
  });

  const windowResize = () => {
    setScreen();
  };

  const setScreen = () => {
    const isSmallSreen = isMobileOrDesktopSize(
      zoomPosition,
      zoomRef as React.MutableRefObject<HTMLDivElement>,
      imageWidth,
      padding
    );
    setBodyDisplay(isTouchScreen);
    setIsMobile(isSmallSreen);
  };

  const handleChangeImage = (index: number) => {
    setActualPicture(index);
    onChangeImage(index);
  };

  return (
    <Box sx={style} className={'zoom_wrapper'}>
      <div className="zoom" ref={zoomRef as React.MutableRefObject<HTMLDivElement>}>
        {isMobile ? (
          <ZoomMobile src={images[actualPicture]} onExpandThumbnail={onExpandThumbnail} imageWidth={imageWidth} />
        ) : (
          <ZoomDesktop
            imageSrc={images[actualPicture]}
            imageWidth={imageWidth}
            onExpandThumbnail={onExpandThumbnail}
            zoomPosition={zoomPosition}
            padding={padding}
          />
        )}
      </div>
      <ImageThumbnails images={images} onChangeImage={handleChangeImage} />
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  '&.zoom_wrapper': {
    display: 'flex',
    flexDirection: 'column',
  },
});

/**
 * Mobilon nem tölti ki aképernyőt teljesen a width : 100%, ( csak mobil eszközön jön elő )
 * @param isMobile inline-block legyen - e a body display property
 */
const setBodyDisplay = (isTouchScreen: boolean) => {
  if (isTouchScreen) {
    document.body.style.display = 'inline-block';
  } else {
    document.body.style.display = 'unset';
  }
};

const isMobileOrDesktopSize = (
  zoomPosition: ZoomPosition,
  zoomRef: React.MutableRefObject<HTMLDivElement>,
  imageWidth: number,
  padding: number
): boolean => {
  if (zoomPosition === 'right') {
    if (window.innerWidth > zoomRef.current.getBoundingClientRect().right + imageWidth + padding) {
      return false;
    } else {
      return true;
    }
  } else if (zoomPosition === 'left') {
    if (zoomRef.current.getBoundingClientRect().left - imageWidth - padding > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
