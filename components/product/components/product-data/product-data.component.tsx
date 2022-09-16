import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { SizeChanger } from './size-changer.component';
import { ProductType, Translations } from '../../product.types';

interface ProductDataProps {
  translations: Translations;
  product: ProductType;
}

/**
 * Az aktuális termék adatai, a kép mellett megjelenítve
 * @param props
 * @returns
 */
export const ProductData = (props: ProductDataProps) => {
  const { translations, product } = props;

  return (
    <Box sx={style} className={'product_data'}>
      <div className="text-data">
        <h3>{product.productName}</h3>
        <div className="serial-number">
          <p>{translations.productNumberLabel}</p>
          <p>{product.productNumber}</p>
        </div>
        <p>{product.description}</p>
        <div className="compare-wrapper">
          <div className="compare">{translations.compareLabel}</div>
          <div className="compare-check" />
        </div>
        <div className="stock">
          <p>{translations.stockLabel}</p>
          <p>{product.stockState}</p>
        </div>
        <p>{translations.sizesLabel}</p>
        <div className="size-wrapper">
          <SizeChanger labels={['S', 'M', 'L', 'XL']} />
          <div className="size-button">{translations.sizeButtonLabel}</div>
        </div>
        <div className="prize">{product.prise}</div>
        <div className="cart-button">{translations.cartButtonLabel}</div>
      </div>
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  '& .text-data': {
    '& h3': {
      fontSize: '35px',
      fontWeight: 'bold',
    },
  },
  '& .serial-number': {
    display: 'flex',
    '& > p:nth-child(1)': {
      marginRight: '10px',
    },
  },
  '& .compare, .stock': {
    display: 'flex',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  '& .stock > p:nth-child(2)': {
    color: 'secondary.main',
  },
  '& .size-button, .cart-button': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #707070',
    cursor: 'pointer',
  },
  '& .size-button': {
    minWidth: '125px',
    height: '48px',
    padding: '5px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  '& .cart-button': {
    width: '170px',
    height: '35px',
  },
  '& .size-wrapper': {
    display: 'inline-flex',
    justifyContent: 'center',
    '& > div:nth-child(2)': {
      marginLeft: '30px',
    },
  },
  '& .prize': {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'secondary.main',
    marginTop: '40px',
    marginBottom: '40px',
  },
});
