import React from 'react';
import { PolicyPageLayout } from '../../components/Policy/PolicyPageLayout';
import { PolicySection } from '../../types/policy';
import { PRIVACY_POLICY_DATA } from './privacyPolicyData';

export const PrivacyPolicyPage: React.FC = () => {
  const renderCustomSection = (sec: PolicySection) => {
    // Section 8: Privacy Email
    if (sec.privacyEmail) {
      return (
        <div className="mt-2 text-xs sm:text-sm">
          <p className="text-slate-700 font-medium">
            Privacy Email:{' '}
            <a
              href={`mailto:${sec.privacyEmail}`}
              className="text-brand-blue font-bold hover:underline"
            >
              {sec.privacyEmail}
            </a>
          </p>
        </div>
      );
    }

    // Section 12: Contact Us
    if (sec.contactInfo) {
      return (
        <div className="mt-3 space-y-1.5 text-xs sm:text-sm text-slate-700">
          <p className="font-bold text-brand-navy">{sec.contactInfo.company}</p>
          <p>
            Email:{' '}
            <a
              href={`mailto:${sec.contactInfo.email}`}
              className="text-brand-blue font-medium hover:underline"
            >
              {sec.contactInfo.email}
            </a>
          </p>
          <p>
            Customer Support:{' '}
            <span className="font-medium text-slate-700">
              {sec.contactInfo.support}
            </span>
          </p>
          <p>
            Phone:{' '}
            <span className="font-medium text-slate-700">
              {sec.contactInfo.phone}
            </span>
          </p>
          <p>
            Address:{' '}
            <span className="font-medium text-slate-700">
              {sec.contactInfo.address}
            </span>
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <PolicyPageLayout
      data={PRIVACY_POLICY_DATA}
      renderCustomSection={renderCustomSection}
    />
  );
};

export default PrivacyPolicyPage;
