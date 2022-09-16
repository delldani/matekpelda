import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

interface ImageThumbnailsProps {
  images: string[];
  onChangeImage: (index: number) => void;
}

/**
 * A thumnail képek egymás mellett
 * @param images A thumbnail image-ek tömbje
 * @param onChangeImage meghívásával változtatja a főképet a thumbnail alapján, kaphat index-et (hanyadik thumbnail legyen) , vagy 'left' / 'right' -léptetés esetén
 */
export const ImageThumbnails = (props: ImageThumbnailsProps) => {
  const { images, onChangeImage } = props;

  const onClickItem = (index: number) => {
    onChangeImage(index);
  };

  return (
    <Box sx={style} className="thumbnails">
      {images.map((item, index) => {
        return (
          <div
            className="image-thumbnail"
            key={index}
            onClick={() => {
              onClickItem(index);
            }}
          >
            <img src={item} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={'kep'} />
          </div>
        );
      })}
    </Box>
  );
};

const style: SxProps<Theme> = (theme: Theme) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: '5px',
  '& .image-thumbnail': {
    width: '80px',
    height: '80px',

    '@media (max-width: 600px)': {
      width: '14vw',
      height: '14vw',
    },
    border: '1px solid black',
    backgroundSize: 'cover',
    cursor: 'pointer',
    marginTop: '10px',
    marginBottom: '10px',
  },
});
