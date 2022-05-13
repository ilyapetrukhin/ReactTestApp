import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useConfirm } from 'material-ui-confirm';
import ManageEntityModal, {
  ManageEntityType,
} from 'src/components/widgets/modals/ManageEntityModal';
import {
  addCCEmail,
  addCustomEmail,
  ignoreContact,
  makePrimary,
  mergeContacts,
  removeCCEmail,
  updateField,
} from 'src/slices/deduplicateContactTool';
import { useDispatch, useSelector } from 'src/store';

import DataCleaningContactTableRow from './DataCleaningContactDeduplicateTabTableRow';
import { SelectChangeEvent } from '@mui/material/Select';

interface DataCleaningContactTableRowHOCProps {
  groupKey: string;
  contactIndex: number;
}

const DataCleaningContactTableRowHOC: FC<DataCleaningContactTableRowHOCProps> = memo(({ groupKey, contactIndex }) => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const [editingEmailEntity, setEditingEmailEntity] = useState<ManageEntityType>(null);
  const editEmailOpen = editingEmailEntity != null;

  const group = useSelector(
    (state) => state.deduplicateContactTool.duplicates[groupKey]
  );
  const { switchers, isMerging } = useSelector(
    (state) => state.deduplicateContactTool
  );
  const { id: organisationId } = useSelector(
    (state) => state.account.organisation
  );

  const contact = useMemo(() => {
    if (group == null) {
      return null;
    }
    return group.contactDuplications[contactIndex];
  }, [group]);

  const poolNames = useMemo(
    () => contact?.contact?.pools
      ?.map((pool) => [pool.pool_type?.name, pool.full_address]
        .filter((item) => item != null)
        .join(' '))
      .filter((name) => name.length !== 0),
    [contact?.contact]
  );

  const handleMarkAsPrimary = useCallback(() => {
    dispatch(makePrimary({ groupKey, contactId: contact?.contact?.id }));
  }, [groupKey, contact?.contact?.id]);

  const handleIgnoreContact = useCallback(() => {
    dispatch(ignoreContact({ groupKey, contactId: contact?.contact?.id }));
  }, [groupKey, contact?.contact?.id]);

  const handleMerge = useCallback(() => {
    confirm({
      description:
          'This will delete all contacts except the Primary. The primary contact will be updated as below. All jobs, quotes and invoices will be moved to the Primary contact. Are you sure you want to proceed?',
      confirmationText: 'Yes',
      cancellationText: 'No',
    })
      .then(() => dispatch(mergeContacts(organisationId, group, switchers)))
      .catch(() => {});
  }, [groupKey, contact?.contact?.id]);

  const handleChangeType = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'type',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeCompanyName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'companyName',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeFirstName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'firstName',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeLastName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'lastName',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangePhoneNumbers = useCallback(
    (
      event: SelectChangeEvent<string[]>
    ) => {
      const phones = contact.allPhones.filter((phone) => event.target.value.includes(phone.phone_number));
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'phones',
          value: phones,
        })
      );
    },
    [groupKey, contact?.contact?.id, contact?.allPhones]
  );

  const handleChangeEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'email',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleAddCCEmail = useCallback(
    (email: string) => {
      dispatch(
        addCCEmail({ groupKey, contactId: contact?.contact?.id, email })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleRemoveCCEmail = useCallback(
    (email: string) => {
      dispatch(
        removeCCEmail({ groupKey, contactId: contact?.contact?.id, email })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeAddressIndex = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'addressIndex',
          value: parseInt(event.target.value, 10),
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeContactName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'contactName',
          value: event.target.value,
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleChangeCommsPref = useCallback(
    (
      event: SelectChangeEvent
    ) => {
      dispatch(
        updateField({
          groupKey,
          contactId: contact?.contact?.id,
          fieldName: 'commsPref',
          value: parseInt(event.target.value, 10),
        })
      );
    },
    [groupKey, contact?.contact?.id]
  );

  const handleOpenModalToAddCustomEmail = useCallback(() => {
    setEditingEmailEntity({ name: contact?.email || '', mode: 'edit' });
  }, [contact?.email]);

  const handleAddCustomEmail = useCallback(
    (modifiedEntity: ManageEntityType) => {
      dispatch(
        addCustomEmail({
          groupKey,
          contactId: contact?.contact?.id,
          email: modifiedEntity.name,
        })
      );
      setEditingEmailEntity(null);
    },
    [groupKey, contact?.contact?.id]
  );

  const handleCloseCustomEmail = useCallback(() => {
    setEditingEmailEntity(null);
  }, []);

  if (contact == null) {
    return null;
  }

  return (
    <>
      <DataCleaningContactTableRow
        groupKey={groupKey}
        isPrimary={group.primaryContactDuplicationId === contact.contact?.id}
        isMerging={isMerging}
        createdAt={contact.contact?.created_at}
        type={contact.type}
        companyName={contact.companyName}
        firstName={contact.firstName}
        lastName={contact.lastName}
        phoneNumbers={contact.phones}
        email={contact.email}
        ccEmails={contact.ccEmails}
        addressIndex={contact.addressIndex}
        contactName={contact.contactName}
        commsPref={contact.commsPref}
        active={contact.active}
        firstNames={contact.firstNames}
        lastNames={contact.lastNames}
        allPhoneNumbers={contact.allPhones}
        emails={contact.emails}
        addresses={contact.addresses}
        linkedPools={poolNames}
        contactNames={contact.contactNames}
        handleMarkAsPrimary={handleMarkAsPrimary}
        handleIgnoreContact={handleIgnoreContact}
        handleMerge={handleMerge}
        handleChangeType={handleChangeType}
        handleChangeCompanyName={handleChangeCompanyName}
        handleChangeFirstName={handleChangeFirstName}
        handleChangeLastName={handleChangeLastName}
        handleChangePhoneNumbers={handleChangePhoneNumbers}
        handleChangeEmail={handleChangeEmail}
        handleAddCCEmail={handleAddCCEmail}
        handleDeleteCCEmail={handleRemoveCCEmail}
        handleChangeAddressIndex={handleChangeAddressIndex}
        handleChangeContactName={handleChangeContactName}
        handleChangeCommsPref={handleChangeCommsPref}
        handleAddCustomEmail={handleOpenModalToAddCustomEmail}
      />
      {editEmailOpen && (
      <ManageEntityModal
        entity={editingEmailEntity}
        open={editEmailOpen}
        title="Email"
        inputLabel="Email"
        placeholder="Email"
        nameAttr="email"
        errRequiredMessage="Email is required"
        displaySuccessToast={false}
        onSubmit={handleAddCustomEmail}
        onClose={handleCloseCustomEmail}
      />
      )}
    </>
  );
});

DataCleaningContactTableRowHOC.propTypes = {
  groupKey: PropTypes.string.isRequired,
  contactIndex: PropTypes.number.isRequired,
};

export default DataCleaningContactTableRowHOC;
