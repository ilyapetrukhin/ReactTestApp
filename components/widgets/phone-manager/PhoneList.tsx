import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Collapse,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/system';
import type { Phone } from 'src/types/contact';
import PhoneAdd from './PhoneAdd';
import PhoneItem from './Phone';
import { TransitionGroup } from 'react-transition-group';

interface PhonesListProps {
  phones: Phone[];
  sx?: SxProps<Theme>;
  onAdd?: (phone: Phone | null) => void;
  onEdit?: (phone: Phone | null) => void;
  onDelete?: (phoneId: number) => void;
}

const PhonesListRoot = styled('div')();

const PhoneList: FC<PhonesListProps> = (props) => {
  const { phones, onAdd, onDelete, onEdit, ...other } = props;
  const [editingPhone, setEditingPhone] = useState<number | null>(null);

  const handlePhoneEditInit = (phoneId: number): void => {
    setEditingPhone(phoneId);
  };

  const handlePhoneEditCancel = (): void => {
    setEditingPhone(null);
  };

  const handlePhoneEditComplete = (phone: Phone): void => {
    setEditingPhone(null);
    if (onEdit) {
      onEdit(phone);
    }
  };

  const handleAddPhone = (phone: Phone): void => {
    if (onAdd) {
      onAdd(phone);
    }
  };

  const handleDeletePhone = (phoneId: number): void => {
    if (onDelete) {
      onDelete(phoneId);
    }
  };

  return (
    <PhonesListRoot {...other}>
      <TransitionGroup>
        {phones.map((phone) => (
          <Collapse key={phone.id}>
            <PhoneItem
              phone={phone}
              editing={editingPhone === phone.id}
              onEditCancel={handlePhoneEditCancel}
              onEditComplete={handlePhoneEditComplete}
              onEditInit={(): void => handlePhoneEditInit(phone.id)}
              onDelete={handleDeletePhone}
            />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box
        sx={{
          mt: 1
        }}
      >
        <PhoneAdd onAdd={handleAddPhone} />
      </Box>
    </PhonesListRoot>
  );
};

PhoneList.propTypes = {
  // @ts-ignore
  phones: PropTypes.array.isRequired,
  sx: PropTypes.object,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default PhoneList;
