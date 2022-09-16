import React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';

import { ProductType, Translations } from '../../product.types';
import { Specification } from './specification.component';
import { SxProps, Theme } from '@mui/material';

interface SpecDataProps {
  translations: Translations;
  product: ProductType;
  buttons: string[];
}

/**
 * Az adatok az adott termékről (specifikáció, leírás stb)
 * @param props
 * @returns
 */
export const SpecData = (props: SpecDataProps) => {
  const { translations, product, buttons } = props;

  const [active, setActive] = React.useState<number>(0);

  const topBarButtons = buttons.map((button, index) => {
    return (
      <div
        className={clsx('topbar_button', active === index && 'active_button')}
        key={index}
        onClick={() => setActive(index)}
      >
        {button}
      </div>
    );
  });

  return (
    <Box sx={style}>
      <div className="spec_data_wrapper">
        <div className={'spec_data'}>
          <div className={'topbar_buttons'}>{topBarButtons}</div>
        </div>
        <Specification translations={translations} product={product} />
      </div>
    </Box>
  );
};

const style: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  '& .spec_data_wrapper': {
    maxWidth: '1000px',
  },
  '& .spec_data': {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '100px',
    marginBottom: '50px',
  },
  '& .topbar_buttons': {
    display: 'inline-flex',
    justifyContent: 'space-between',
    flexBasis: '600px',
  },
  '& .topbar_button': {
    minWidth: '150px',
    width: '30%',
    height: '50px',
    border: '1px solid black',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .active_button': {
    backgroundColor: 'primary.main',
    color: 'common.white',
    border: 'none',
  },
};
