import { PolicyPageData } from '../../types/policy';

export const PRIVACY_POLICY_DATA: PolicyPageData = {
  brand: 'THE BABY STEP',
  title: 'Privacy Policy',
  intro: [
    'The Baby Step respects your privacy and is committed to protecting the personal information you provide while using our website.',
    'This Privacy Policy explains what information we collect, why we collect it and how we use it.',
  ],
  sections: [
    {
      id: 1,
      title: 'Information We Collect',
      lead: 'When you place an order, create an account or contact us, we may collect:',
      items: [
        'Full name',
        'Mobile number',
        'Email address',
        'Billing address',
        'Shipping address',
        'Order details',
        'Payment-related information',
        'Customer support communications',
        'Website usage information such as device/browser information, where applicable',
      ],
      note: 'We do not intend to collect information that is unnecessary for providing our services.',
    },
    {
      id: 2,
      title: 'How We Use Your Information',
      lead: 'We may use your information to:',
      items: [
        'Process and deliver your orders',
        'Confirm orders and payments',
        'Provide customer support',
        'Process returns, exchanges and refunds',
        'Communicate shipping updates',
        'Respond to enquiries',
        'Improve our website and services',
        'Prevent fraud, misuse and unauthorized transactions',
        'Comply with applicable legal requirements',
        'Send promotional communications where permitted and applicable',
      ],
    },
    {
      id: 3,
      title: 'Payment Information',
      paragraphs: [
        'Payments may be processed through third-party payment gateways.',
        'The Baby Step does not intentionally store complete debit/credit card details on its own systems where the payment provider handles such information.',
        'Payment providers may process information according to their own privacy policies and security practices.',
      ],
    },
    {
      id: 4,
      title: 'Sharing of Information',
      lead: 'We may share necessary information with trusted service providers such as:',
      items: [
        'Courier and logistics companies',
        'Payment gateway/service providers',
        'Website/technology service providers',
        'Customer support providers',
        'Professional advisors where necessary',
        'Government or law-enforcement authorities where legally required',
      ],
      note: 'We do not sell customers’ personal information as a product.',
    },
    {
      id: 5,
      title: 'Cookies',
      lead: 'Our website may use cookies and similar technologies to:',
      items: [
        'Keep the website functioning',
        'Remember preferences',
        'Understand website usage',
        'Improve user experience',
        'Support analytics and marketing, where applicable',
      ],
      note: 'You may be able to control cookies through your browser settings.',
    },
    {
      id: 6,
      title: 'Data Security',
      paragraphs: [
        'We take reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, disclosure or loss.',
        'However, no internet-based system can be guaranteed to be completely secure.',
      ],
    },
    {
      id: 7,
      title: 'Data Retention',
      lead: 'We retain personal information only for as long as reasonably necessary for:',
      items: [
        'Providing our services',
        'Completing transactions',
        'Customer support',
        'Legal, accounting and regulatory requirements',
        'Resolving disputes',
      ],
      note: 'When information is no longer required, it may be deleted or securely disposed of, subject to applicable legal requirements.',
    },
    {
      id: 8,
      title: 'Your Privacy Rights',
      paragraphs: [
        'Subject to applicable law, you may have rights relating to your personal data, including rights to access, correction, deletion/erasure or withdrawal of consent in applicable circumstances.',
        'India’s Digital Personal Data Protection framework and related rules provide the relevant legal framework for processing digital personal data.',
        'Requests can be sent to:',
      ],
      privacyEmail: 'care@thebabystep.com',
    },
    {
      id: 9,
      title: 'Children’s Privacy',
      paragraphs: [
        'Our products are intended for babies and children, but our website and transactions are intended to be handled by parents, guardians or other authorized adults.',
        'We do not knowingly seek to collect personal information directly from children for independent purchasing or account creation.',
      ],
    },
    {
      id: 10,
      title: 'Third-Party Links',
      paragraphs: [
        'Our website may contain links to third-party websites or services. The Baby Step is not responsible for the privacy practices of external websites.',
        'Customers are encouraged to review the privacy policies of those websites.',
      ],
    },
    {
      id: 11,
      title: 'Policy Updates',
      paragraphs: [
        'We may update this Privacy Policy from time to time to reflect changes in our services, technology or applicable laws.',
        'The updated policy will be published on this page with the revised effective date.',
      ],
    },
    {
      id: 12,
      title: 'Contact Us',
      lead: 'For privacy-related questions or requests:',
      contactInfo: {
        company: 'The Baby Step',
        email: 'care@thebabystep.com',
        support: 'care@thebabystep.com',
        phone: '+91 98765 43210',
        address: 'The Baby Step Care Center, Mumbai, Maharashtra, India',
      },
    },
  ],
};
