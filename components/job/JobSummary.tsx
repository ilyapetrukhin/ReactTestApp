/* eslint-disable */
import React, { useMemo } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {format, formatDistanceToNowStrict} from 'date-fns';
import numeral from 'numeral';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem, Theme,
  Typography
} from '@mui/material';
import {useDispatch, useSelector} from "../../store";
import {scrollTo} from "../../slices/jobDetail";
import {JobDetailScrollTo} from "../../types/job";
import { alpha, styled } from "@mui/material/styles";
import {getTotal} from "../../utils/invoice";
import {SxProps} from "@mui/system";

const SummaryListItemRoot = styled('div')(
  ({ theme }) => (
    {
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.20),
        cursor: 'pointer',
        '& button': {
          visibility: 'visible'
        }
      }
    }
  )
);

interface JobSummaryProps {
  schedule?: string;
  sx?: SxProps<Theme>;
}

const JobSummary: FC<JobSummaryProps> = (props) => {
  const { schedule, ...rest } = props;
  const { jobTemplate, invoices } = useSelector((state) => state.jobDetail);
  const dispatch = useDispatch();

  const handleScrollTo = (view: JobDetailScrollTo): void => {
    dispatch(scrollTo(view));
  };

  // const handleUnlike = (): void => {
  //   setIsLiked(false);
  //   setLikes((prevLikes) => prevLikes - 1);
  // };

  const totalCost = useMemo(
    () => {
      let res = 0;
      if (invoices) {
        res = getTotal(invoices);
      }
      return res;
    },
    [invoices],
  );

  return (
    <Card {...rest}>
      <CardHeader title="Summary" />
      <Divider />
      <List>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                flex: 1
              }}
            >
              Technician
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 2,
                flex: 2
              }}
            >
              John Citizen
            </Typography>
          </ListItem>
        </SummaryListItemRoot>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                flex: 1
              }}
            >
              Contact
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 2,
                flex: 2
              }}
            >
              Fred Lilley
            </Typography>
          </ListItem>
        </SummaryListItemRoot>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                flex: 1
              }}
            >
              Pool
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 2,
                flex: 2
              }}
            >
              John Citizen
            </Typography>
          </ListItem>
        </SummaryListItemRoot>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                flex: 1
              }}
            >
              Job type
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 2,
                flex: 2
              }}
            >
              { jobTemplate ? jobTemplate.name : '-' }
            </Typography>
          </ListItem>
        </SummaryListItemRoot>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
            onClick={() => handleScrollTo('invoice')}
          >
            <Typography
              color="textSecondary"
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                flex: 1
              }}
            >
              Invoice
            </Typography>
            <Typography
              color="textPrimary"
              variant="body2"
              sx={{
                ml: 2,
                flex: 2
              }}
            >
              {numeral(totalCost).format('$0,0.00')}
            </Typography>
          </ListItem>
        </SummaryListItemRoot>
        <SummaryListItemRoot>
          <ListItem
            disableGutters
            sx={{
              px: 2,
            }}
          >
            {
              schedule != null && (
                <>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      flex: 1
                    }}
                  >
                  Schedule
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="body2"
                  sx={{
                    ml: 2,
                    flex: 2
                  }}
                >
                  {schedule}
                </Typography>
              </>
              )
            }
          </ListItem>
        </SummaryListItemRoot>
      </List>
    </Card>
  );
};

JobSummary.propTypes = {
  schedule: PropTypes.string,
  sx: PropTypes.object
};

export default JobSummary;
