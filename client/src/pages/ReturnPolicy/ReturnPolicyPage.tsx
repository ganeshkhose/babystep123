import React from 'react';
import { PolicyPageLayout } from '../../components/Policy/PolicyPageLayout';
import { PolicySection } from '../../types/policy';
import { RETURN_POLICY_DATA } from './returnPolicyData';

export const ReturnPolicyPage: React.FC = () => {
  const renderCustomSection = (sec: PolicySection) => {
    if (sec.id === 7 && sec.returnRequest) {
      const { email, phone, note } = sec.returnRequest;

      return (
        <div className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
          <p>
            Email:{' '}
            <a
              href={`mailto:${email}?subject=Return%20Request%20-%20The%20Baby%20Step`}
              className="text-brand-blue font-medium hover:underline"
            >
              {email}
            </a>
          </p>
          <p>
            Phone/WhatsApp:{' '}
            <span className="font-medium text-slate-700">{phone}</span>
          </p>
          <p className="font-bold text-brand-navy pt-1">Please mention:</p>
          <p className="font-semibold text-slate-800">
            Order Number + Product Name + Reason for Return
          </p>
          <p className="text-slate-600 font-medium">
            {note}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <PolicyPageLayout
      data={RETURN_POLICY_DATA}
      renderCustomSection={renderCustomSection}
    />
  );
};

export default ReturnPolicyPage;
