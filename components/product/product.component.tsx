import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { ExpandThumbnail } from './components/expand-thumbnail/expand-thumbnail.component';
import { ProductData } from './components/product-data/product-data.component';
import { ZoomComponent } from './components/zoom/index';
import { ProductType, Translations } from './product.types';
import { SpecData } from './components/spec-data/spec-data.component';
import { calculateActualPicture } from './helper';
interface ProductProps {
  product: ProductType;
  translations?: Translations;
}

const IMAGE_WIDTH = 600;
const PADDING = 90;
 
/**
 * A Termék oldal. Megjeleníti a kinagyítandó képet és a hozzá tartozó adatokat(specifikáció stb), illetve
 * ha rákattintanak egy kis képre(thumbnail-re) akkor azt kirakja fullScreen-be
 * @param props
 * @returns
 */
export const Product = (props: ProductProps) => {
  const { product } = props;

  const [showThumbnail, setShowThumbnail] = React.useState<boolean>(false);
  const [actualPicture, setActualPicture] = React.useState<number>(0);

 const translations = {
    productNumberLabel: 'termék száma',
    compareLabel: 'összehasonlítás',
    stockLabel: 'raktáron',
    sizesLabel: 'mérettek',
    cartButtonLabel: 'vétel',
    sizeButtonLabel: 'méret',
    specificationButtonLabel: 'specifikáció',
    geometryButtonLabel: 'geometria',
    technologyButtonLabel: 'technologia',
    moreTextButtonLabel: 'többet',
    lessTextButton: 'kevesebbet',
  };

  const handleExpandThumbnail = (show: boolean) => {
    setShowThumbnail(show);
  };

  /**
   * Beállítja, hogy melyik legyen az aktuális kép
   * @param index megadható, melyik pozíció legyen, vagy léptetéssel az aktuálí pozícióbtól
   * @return Visszaadja, hogy van e következő elem, ha van true ha nincs false
   */
  const onChangeActualPicture = (index: number | 'left' | 'right') => {
    const nextPicture = calculateActualPicture(index, actualPicture, product.images.length - 1);
    nextPicture !== null && setActualPicture(nextPicture);
    return nextPicture !== actualPicture;
  };

  // showThumbnail esetén portálban fullscren-ben megjeleníti a képet
  return (
    <>
      {showThumbnail ? (
        ReactDOM.createPortal(
          <div className={'portal'}>
            <ExpandThumbnail
              src={product.images[actualPicture]}
              onChangeImage={onChangeActualPicture}
              images={product.images}
              onShowThumbnail={handleExpandThumbnail}
            />
          </div>,
          document.body
        )
      ) : (
        <Box sx={style}>
          <div className={'zoom_main_data'}>
            <ZoomComponent
              actualPictureFromProps={actualPicture}
              images={product.images}
              onExpandThumbnail={handleExpandThumbnail}
              onChangeImage={onChangeActualPicture}
              zoomPosition="right"
              padding={PADDING}
              imageWidth={IMAGE_WIDTH}
            />
            <div className={'product_data_wrapper'}>
              <ProductData translations={translations} product={product} />
            </div>
          </div>
          <SpecData
            translations={translations}
            product={product}
            buttons={[
              translations.specificationButtonLabel,
              translations.geometryButtonLabel,
              translations.technologyButtonLabel,
            ]}
          />
        </Box>
      )}
    </>
  );
};

const style: SxProps<Theme> = {
  '& .zoom_main_data': {
    display: 'flex',
    flexDirection: 'row',
    '@media (max-width: 1140px)': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  '& .portal': {
    position: 'absolute',
    backgroundColor: 'palette.common.white',
    zIndex: 16,
    top: 0,
  },
  '& .product_data_wrapper': {
    flexGrow: '1',
    flexShrink: '1',
    flexBasis: '400px',
    maxWidth: IMAGE_WIDTH + 'px',
    marginLeft: PADDING + 'px',
    '@media (max-width: 1140px)': {
      marginLeft: 0,
    },
    '@media (max-width: 600px)': {
      paddingLeft: '10px',
    },
  },
};
