/* eslint-disable react/no-array-index-key */
import React, { FC, memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import {
  Card,
  CardActionArea,
  Dialog,
  CardMedia,
  CardHeader,
  CardContent,
  Typography,
  CardProps,
  DialogTitle,
  IconButton,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

interface CarouselImageProps extends CardProps {
  thumbnailUrls: string[];
  uris: string[];
  notes?: string;
  title: string;
  subtitle: string;
}

const ExpandedCarouselStyled = styled('div')(
  ({ theme }) => (
    {
      '.carousel .slider-wrapper.axis-horizontal .slider': {
        height: '70vh',
        '& .slide.selected > div': {
          cursor: 'pointer',
          height: '100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        },
      },
      '.carousel .thumbs-wrapper.axis-vertical .thumbs': {
        '& .thumb > div': {
          height: theme.spacing(5),
          cursor: 'pointer',
          '& > div': {
            cursor: 'pointer',
            height: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          },
        },
      },
    }
  )
);

const CarouselImage: FC<CarouselImageProps> = memo(
  ({ title, subtitle, thumbnailUrls, uris, notes, ...props }) => {
    const theme = useTheme();
    const [selectedItem, setSelectedItem] = useState(0);

    const [isOpened, setIsOpened] = useState(false);

    const handleOpen = useCallback(() => setIsOpened(true), []);
    const handleClose = useCallback(() => setIsOpened(false), []);
    const handleChangeSelectedItem = useCallback((index: number) => setSelectedItem(index), []);

    const openImageInNewTab = useCallback((index: number) => window.open(uris[index], '_blank'), [uris]);

    return (
      <>
        <Card {...props}>
          <Carousel
            infiniteLoop
            stopOnHover
            showStatus={false}
            autoPlay={!isOpened}
            interval={6000}
            showThumbs={false}
            renderIndicator={() => null}
            selectedItem={selectedItem}
            onClickItem={handleOpen}
            onChange={handleChangeSelectedItem}
          >
            {thumbnailUrls.map((uri, i) => (
              <CardActionArea key={i}>
                <CardMedia
                  sx={{
                    minHeight: theme.spacing(25),
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }}
                  image={uri}
                />
              </CardActionArea>
            ))}
          </Carousel>
          <CardHeader
            sx={{
              display: 'block',
              overflow: 'hidden',
            }}
            title={(
              <Typography
                noWrap
                gutterBottom
                variant="h6"
                component="h4"
              >
                {title}
              </Typography>
            )}
            subheader={subtitle}
          />
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
            >
              {notes}
            </Typography>
          </CardContent>
        </Card>
        <Dialog
          open={isOpened}
          maxWidth="xl"
          onClose={handleClose}
          fullWidth
        >
          {
            isOpened && (
              <>
                <DialogTitle
                  sx={{ m: 0, p: 2 }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                  >
                    {title}
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <ExpandedCarouselStyled>
                  <Carousel
                    infiniteLoop
                    stopOnHover
                    autoFocus
                    selectedItem={selectedItem}
                    renderThumbs={(children) => children.map((c, i) => (
                      <div
                        key={i}
                      >
                        {c}
                      </div>
                    ))}
                    onClickItem={openImageInNewTab}
                    onChange={handleChangeSelectedItem}
                  >
                    {uris.map((uri, i) => (
                      <div
                        key={i}
                        style={{ backgroundImage: `url("${uri}")` }}
                      />
                    ))}
                  </Carousel>
                </ExpandedCarouselStyled>
              </>
            )
          }
        </Dialog>
      </>
    );
  }
);

export default CarouselImage;

CarouselImage.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  thumbnailUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  notes: PropTypes.string,
};
