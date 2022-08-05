import React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

import { ProductType, Translations } from '../../product.types';

interface SpecificationProps {
  translations: Translations;
  product: ProductType;
}

export const Specification = (props: SpecificationProps) => {
  const { translations, product } = props;

  const [isMoreText, setMoreText] = React.useState<boolean>(false);

  return (
    <Box sx={style}>
      <div className={clsx('specialisation', !isMoreText && 'lowHeight')}>
        <div className={'column'}>
          <h3>FRAME</h3>
          <p>Addict Disc HMF Carbon technology Endurance geometry / Replaceable Derailleur Hanger</p>
          <h3>FORK</h3>
          <p>Addict Disc HMF 1 1/8`-1 1/4` Carbon steerer Alloy Dropout</p>
          <h3>REAR DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS 24 Speed Electronic Shift System</p>

          <h3>RFRONT DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS Electronic Shift System</p>
          <h3>SHIFTERS</h3>
          <p>SRAM FORCE eTap AXS HRD Shift-Brake System</p>
          <h3>CRANKSET</h3>
          <p>SRAM FORCE Crankset 46/33 T</p>
          <h3>CHAIN</h3>
          <p>SRAM FORCE</p>

          <h3>RFRONT DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS Electronic Shift System</p>
        </div>

        <div className={'column'}>
          <h3>SHIFTERS</h3>
          <p>SRAM FORCE eTap AXS HRD Shift-Brake System</p>
          <h3>CRANKSET</h3>
          <p>SRAM FORCE Crankset 46/33 T</p>
          <h3>CHAIN</h3>
          <p>SRAM FORCE</p>

          <h3>RFRONT DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS Electronic Shift System</p>
          <h3>FRAME</h3>
          <p>Addict Disc HMF Carbon technology Endurance geometry / Replaceable Derailleur Hanger</p>
          <h3>FORK</h3>
          <p>Addict Disc HMF 1 1/8`-1 1/4`` Carbon steerer Alloy Dropout</p>
          <h3>REAR DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS 24 Speed Electronic Shift System</p>

          <h3>RFRONT DERAILLEUR</h3>
          <p>SRAM FORCE eTap AXS Electronic Shift System</p>
        </div>
        <div className={clsx(!isMoreText && 'fade')} />
      </div>
      <div className={'moreText'} onClick={() => setMoreText(!isMoreText)}>
        {isMoreText ? translations.lessTextButton : translations.moreTextButtonLabel}
      </div>
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  '& .specialisation': {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down(1000)]: {
      flexDirection: 'column',
    },
  },
  '& .lowHeight': {
    height: '300px',
  },
  '& .column': {
    position: 'relative',
    padding: '10px',
    [theme.breakpoints.down(1000)]: {
      width: '100%',
    },
  },
  '& .fade': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(transparent 150px, white)',
  },
  '& .moreText': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid black',
    width: '150px',
    height: '50px',
    margin: '50px auto 50px auto',
    cursor: 'pointer',
  },
});
