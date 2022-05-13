import React from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Theme,
  List,
  Collapse,
} from '@mui/material';
import type { SxProps } from '@mui/system';
import { useDispatch, useSelector } from 'src/store';
import { addException } from 'src/slices/chemicalTest';
import type { ChemicalTestException } from 'src/types/chemical';
import ExceptionItem from './ExceptionItem';
import { CLASSIFICATION_TYPE } from 'src/constants/chemical';
import { TransitionGroup } from 'react-transition-group';

interface ExceptionListProps {
  sx?: SxProps<Theme>;
  onAdd?: (exception: ChemicalTestException | null) => void;
  onEdit?: (exception: ChemicalTestException | null) => void;
  onDelete?: (exceptionId: number) => void;
}

const ExceptionList: FC<ExceptionListProps> = (props) => {
  const { onAdd, onDelete, onEdit, ...other } = props;
  const { chemicalTest, chemicalTestExceptions } = useSelector((state) => state.chemicalTest);
  const dispatch = useDispatch();

  const handleAdd = (): void => {
    const newException: ChemicalTestException = {
      id: `virtual_${chemicalTestExceptions.length + 1}`,
      chemical_test_id: chemicalTest.id,
      exception_name: CLASSIFICATION_TYPE,
      min_value: 0,
      max_value: 0,
      target_value: 0
    };
    dispatch(addException(newException));
  };

  return (
    <Box
      {...other}
    >
      <List
        disablePadding
      >
        <TransitionGroup>
          {chemicalTestExceptions.map((exception) => (
            <Collapse key={exception.id}>
              <>
                <ExceptionItem exception={exception} />
              </>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Box sx={{ mt: 3 }}>
        <Button
          color="primary"
          onClick={handleAdd}
          size="small"
          variant="outlined"
        >
          Add exception
        </Button>
      </Box>
    </Box>
  );
};

ExceptionList.propTypes = {
  sx: PropTypes.object,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ExceptionList;
