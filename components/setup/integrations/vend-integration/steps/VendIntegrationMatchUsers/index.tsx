import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableBody,
} from '@mui/material';
import { useDispatch, useSelector } from 'src/store';
import { initialize, updateMatch } from 'src/slices/vendIntegrationMatchUsers';
import MatchUsersRow from './MatchUsersRow';
import toast from 'react-hot-toast';
import ResetIntegrationButton from '../../components/ResetIntegrationButton';
import LoadingScreen from 'src/components/LoadingScreen';

interface VendIntegrationMatchUsersProps {}

const VendIntegrationMatchUsers: FC<VendIntegrationMatchUsersProps> = memo(
  () => {
    const dispatch = useDispatch();
    const { id: organisationId, vend_organisation: vendOrganisation } = useSelector((state) => state.account.organisation);
    const {
      isInitialized,
      mapUserIdToUserRegister,
      registers,
      vendUsers,
    } = useSelector((state) => state.vendIntegrationMatchUsers);
    const userRegisters = useMemo(
      () => Object.values(mapUserIdToUserRegister),
      [mapUserIdToUserRegister]
    );

    const handleChangeUserRegister = useCallback(
      async (userId: number, vendUserId: number, registerId: number) => {
        await dispatch(updateMatch(organisationId, userId, vendUserId, registerId));
        toast.success('User settings have been updated');
      },
      [organisationId]
    );

    useEffect(() => {
      dispatch(initialize(organisationId));
    }, [organisationId]);

    if (!isInitialized) {
      return <LoadingScreen />;
    }

    return (
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Card>
            <CardHeader title="Connected to Vend" />
            <Divider />
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight="bold"
              >
                Connected to account
              </Typography>
              <Typography
                variant="body2"
                color="textPrimary"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                {vendOrganisation.domain_prefix.toUpperCase()}
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
              >
                <ResetIntegrationButton text="Disconnect Vend account" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
        >
          <Card>
            <CardHeader title="User mapping" />
            <Divider />
            <CardContent
              sx={{
                px: 0
              }}
            >
              <TableContainer sx={{ maxHeight: '70vh', px: 2 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight="bold"
                        >
                          Pooltrackr user
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight="bold"
                        >
                          Vend register
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          backgroundColor: 'background.paper',
                        }}
                      >
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          fontWeight="bold"
                        >
                          Vend user
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userRegisters.map((userRegister) => (
                      <MatchUsersRow
                        key={userRegister.id}
                        username={userRegister.user.full_name}
                        userRegister={userRegister}
                        registers={registers}
                        vendUsers={vendUsers}
                        onChange={handleChangeUserRegister}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
);

VendIntegrationMatchUsers.propTypes = {};

export default VendIntegrationMatchUsers;
