import React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

interface SizeChangerProps {
  active?: number;
  labels: string[];
}

export const SizeChanger = (props: SizeChangerProps) => {
  const { active = 0, labels = [] } = props;

  const [activeStep, setActiveStep] = React.useState(active);

  React.useEffect(() => {
    setActiveStep(active);
  }, [active]);

  const onClickItem = (index: number) => {
    setActiveStep(index);
  };

  const stepper = [];

  for (let i = 0; i < labels.length - 1; i++) {
    stepper.push(
      <div key={i} className={clsx('size-item ', i === activeStep && 'item-active')} onClick={() => onClickItem(i)}>
        <div className={'size-label'}>{labels[i]}</div>
        <div className={i === activeStep ? 'line line-active' : 'line'} />
      </div>
    );
  }

  return (
    <Box sx={style} className="sizes">
      {stepper}
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  alignItems: 'center',
  '& .size-item': {
    width: '63px',
    height: '48px',
    border: '1px solid black',
    borderBottomColor: 'black',
    marginRight: '5px',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  '& .item-active': {
    borderBottomColor: theme.palette.secondary.main,
  },
  '& .line': {
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '100%',
    borderBottom: `4px solid ${theme.palette.secondary.main}`,
    display: 'none',
  },
  '& .line-active': {
    display: 'block',
  },
});
