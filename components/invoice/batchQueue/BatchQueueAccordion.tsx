/* eslint-disable react/prop-types */
import React, { FC, memo, useCallback, useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import numeral from 'numeral';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { BatchQueue } from 'src/types/batchQueue';
import ContactInvoicesListTable from 'src/components/invoice/batchQueue/ContactInvoicesListTable';

const ChipStyled = styled(Chip)(({ theme }) => ({
  '&.MuiChip-colorDefault': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    minWidth: theme.spacing(15),
    fontWeight: 'bold',
  },
}));

const AccordionSummaryStyled = styled(AccordionSummary)(() => ({
  '& .MuiAccordionSummary-content': {
    maxWidth: '100%',
  },
  '& .Mui-expanded.MuiAccordionSummary-expandIconWrapper': {
    transform: 'rotate(90deg)',
  },
}));

interface BatchQueueAccordionProps {
  queue: BatchQueue;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

const BatchQueueAccordion: FC<BatchQueueAccordionProps> = memo(
  ({ queue, expanded, onExpand, onCollapse }) => {
    const name = useMemo(
      () => [queue.first_name, queue.last_name]
        .filter((name) => name != null)
        .join(' '),
      [queue.first_name, queue.last_name]
    );

    const countOfInvoicesText = useMemo(
      () => `${queue.contact_invoices.length} invoice${
        queue.contact_invoices.length > 1 ? 's' : ''
      }`.toUpperCase(),
      [queue.contact_invoices.length]
    );

    const totalAmountText = useMemo(
      () => numeral(queue.total).format('$0,0.00'),
      [queue.total]
    );

    const handleChange = useCallback(
      (event: React.SyntheticEvent, expanded: boolean) => {
        if (expanded) {
          onExpand();
        } else {
          onCollapse();
        }
      },
      [onExpand]
    );

    return (
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        sx={{
          '&:first-of-type': {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }
        }}
        disableGutters
      >
        <AccordionSummaryStyled
          expandIcon={<ChevronRightIcon color="primary" />}
        >
          <Grid
            container
            spacing={1}
          >
            <Grid
              item
              md={2}
              xs={12}
              display="flex"
              alignItems="center"
            >
              <ChipStyled
                label={countOfInvoicesText}
              />
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
              display="flex"
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                variant="body2"
                color="textPrimary"
                fontWeight="bold"
                noWrap
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mx: 1 }}
              >
                |
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                noWrap
                style={{ wordWrap: 'break-word' }}
              >
                {queue.contact.full_address}
              </Typography>
            </Grid>
            <Grid
              item
              md={2}
              xs={6}
              display="flex"
              alignItems="center"
            >
              <Typography
                variant="body2"
                color="textPrimary"
                textAlign="right"
                fontWeight="bold"
              >
                {totalAmountText}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummaryStyled>
        <AccordionDetails sx={{ padding: 0 }}>
          <ContactInvoicesListTable
            contactInvoices={queue.contact_invoices}
            isActive={expanded}
            contactId={queue.contact_id}
          />
        </AccordionDetails>
      </Accordion>
    );
  }
);

export default BatchQueueAccordion;
