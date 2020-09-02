import React from 'react';
import MemberDropdown from './MemberDropdown';
import RemoveButtonGroup from './RemoveButtonGroup';
import MemberGroupTitle from './MemberGroupTitle';
import PlusIcon from './PlusIcon';

const MemberGroup = ({
  members, availableMembers, addMemberName, updateMethods, title
}) => (
  <div>
    <MemberGroupTitle title={title} />
    {members.map(m => (
      <RemoveButtonGroup key={m.index || m.name} onRemoveClick={() => updateMethods.remove(m)}>
        <MemberDropdown type="selected" availableMembers={availableMembers} onClick={updateWith => updateMethods.update(m, updateWith)}>
          {m.title}
        </MemberDropdown>
      </RemoveButtonGroup>
    ))}
    <MemberDropdown
      type={members.length > 0 ? "icon" : "new"}
      onClick={m => updateMethods.add(m)} availableMembers={availableMembers}
    >
      {addMemberName}
      <PlusIcon />
    </MemberDropdown>
  </div>
);

export default MemberGroup;