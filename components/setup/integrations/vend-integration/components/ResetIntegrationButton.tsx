import React, { FC, memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useConfirm } from 'material-ui-confirm';

import { useDispatch, useSelector } from 'src/store';
import { resetConnection } from 'src/slices/vendIntegration';
import ButtonErrorOutlined from 'src/components/ButtonErrorOutlined';

interface ResetIntegrationButtonProps {
  text: string;
}

const ResetIntegrationButton: FC<ResetIntegrationButtonProps> = memo(({ text }) => {
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );
  const { resettingConnection } = useSelector(
    (state) => state.vendIntegration
  );

  const handleReset = useCallback(async () => {
    await confirm({
      title: 'Are you sure?',
      description:
        'This will break the integration between two systems and remove all synced data from Pooltrackr. Are you sure you want to proceed?',
      confirmationText: 'Yes',
      cancellationText: 'No',
    })
      .then(() => dispatch(resetConnection(organisationId)))
      .catch(() => {});
  }, [organisationId]);

  return (
    <ButtonErrorOutlined
      loading={resettingConnection}
      onClick={handleReset}
    >
      {text}
    </ButtonErrorOutlined>
  );
});

ResetIntegrationButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ResetIntegrationButton;
