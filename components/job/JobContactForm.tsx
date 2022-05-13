/* eslint-disable */
import React, { useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import {
  Box,
  Button,
  Card, CardHeader,
  Chip, Divider,
  FormHelperText, Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import PlusIcon from 'src/icons/Plus';
import ContactSearch from "../widgets/search-inputs/ContactSearch";
import {Contact} from "../../types/contact";
import {useDispatch, useSelector} from "../../store";
import { updateContact } from "../../slices/jobDetail";
import {Edit as EditIcon} from "react-feather";
import JobContactPools from "./JobContactPools";

interface JobContactProps {
  onBack?: () => void;
  onNext?: () => void;
}

const JobContactForm: FC<JobContactProps> = (props) => {
  const { onBack, onNext, ...other } = props;
  const { contact, pool } = useSelector((state) => state.jobDetail);
  const [showContactSearch, setShowContactSearch] = useState<boolean>(false);
  const [tag, setTag] = useState<string>('');
  const dispatch = useDispatch();

  const handleLinkContact = (contact: Contact): void => {
    if (contact) {
      dispatch(updateContact(contact));
      setShowContactSearch(false);
    }
  };

  return (
    <Formik
      initialValues={{
        projectName: '',
        tags: ['Full-Time'],
        startDate: new Date(),
        endDate: new Date(),
        submit: null
      }}
      validationSchema={
        Yup
          .object()
          .shape({
            // projectName: Yup
            //   .string()
            //   .min(3, 'Must be at least 3 characters')
            //   .max(255)
            //   .required('Required'),
            // tags: Yup.array(),
            // startDate: Yup.date(),
            // endDate: Yup.date()
          })
      }
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }): Promise<void> => {
        try {
          // Call API to store step data in server session
          // It is important to have it on server to be able to reuse it if user
          // decides to continue later.
          setStatus({ success: true });
          setSubmitting(false);

          if (onNext) {
            onNext();
          }
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        touched,
        values
      }): JSX.Element => (
        <form
          onSubmit={handleSubmit}
          {...other}
        >
          <Card>
            <CardHeader title="Job contact and pool details" />
            <Divider />
            <Box
              sx={{
                p: 2
              }}
            >
              <Typography
                color="textPrimary"
                variant="h6"
              >
                Contact
              </Typography>
              <Typography
                color="textSecondary"
                variant="body1"
              >
                Proin tincidunt lacus sed ante efficitur efficitur.
                Quisque aliquam fringilla velit sit amet euismod.
              </Typography>
              {contact && !showContactSearch && (
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    mt: 2
                  }}
                >
                  <TextField
                    fullWidth
                    name="contact"
                    disabled
                    placeholder="Choose contact"
                    value={contact ? contact.full_name : ''}
                    variant="outlined"
                  />
                  <IconButton
                    sx={{
                      ml: 2,
                      color: 'primary.main',
                    }}
                    onClick={(): void => setShowContactSearch(true)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              {(showContactSearch || !contact) && (
                <Box sx={{ mt: 2 }}>
                  <Grid
                    sx={{
                      alignItems: 'center'
                    }}
                    container
                    spacing={2}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={9}
                      md={8}
                    >
                      <ContactSearch onSelect={handleLinkContact} />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      md={4}
                    >
                      <Button
                        color="secondary"
                        type="button"
                        startIcon={<PlusIcon fontSize="small" />}
                        // onClick={handleCreateNewContact}
                        variant="contained"
                      >
                        Create new
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {contact && (
                <Box
                  sx={{
                    mt: 2
                  }}
                >
                  <JobContactPools pools={contact.pools} />
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  mt: 6
                }}
              >
                {onBack && (
                  <Button
                    color="primary"
                    onClick={onBack}
                    size="large"
                    variant="text"
                  >
                    Previous
                  </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
};

JobContactForm.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func
};

export default JobContactForm;
