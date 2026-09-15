import { PolicyPageData } from '../../types/policy';

export const RETURN_POLICY_DATA: PolicyPageData = {
  title: 'Return & Refund Policy',
  intro: [
    'At The Baby Step, we want every parent to have a safe and satisfactory shopping experience. Since our products are primarily baby-care and personal-care products, certain hygiene and safety restrictions apply to returns and exchanges.',
  ],
  sections: [
    {
      id: 1,
      title: 'Return Eligibility',
      lead: 'A product may be returned if:',
      items: [
        'The product received is damaged, defective or leaking.',
        'The wrong product has been delivered.',
        'The product received is different from the product ordered.',
        'The product is received in an unacceptable condition due to transit damage.',
        'The product does not match the description/specifications provided on our website.',
      ],
      note: 'For eligible issues, customers should contact us within 48 hours of delivery with photographs/video of the product and packaging.',
    },
    {
      id: 2,
      title: 'Non-Returnable Products',
      lead: 'For hygiene, safety and quality reasons, opened or used baby-care products generally cannot be returned. The following products are non-returnable once opened or used:',
      items: [
        'Baby Balm',
        'Baby Body Lotion',
        'Baby Wash & Shampoo',
        'Tummy Roll-On',
        'Baby Wipes',
        'Baby Laundry Detergent',
        'Bottle & Nipple Cleaner',
        'Other personal-care, liquid or hygiene products',
      ],
      note: 'Products that have been opened, used, tampered with or whose seal has been broken may not qualify for return.',
    },
    {
      id: 3,
      title: 'Condition of Returned Products',
      lead: 'Approved returns must be:',
      items: [
        'Unused and unopened',
        'In original packaging',
        'With original labels/seals intact',
        'Accompanied by invoice/order details',
        'Free from customer-caused damage',
      ],
    },
    {
      id: 4,
      title: 'Return Shipping',
      paragraphs: [
        'If the return is due to a wrong, damaged or defective product, The Baby Step may arrange or reimburse the return shipping, subject to verification.',
        'For other approved returns, return shipping charges may be borne by the customer.',
      ],
    },
    {
      id: 5,
      title: 'Refund',
      paragraphs: [
        'Once the returned product is received and inspected, we will notify the customer about the approval or rejection of the refund.',
        'Approved refunds will generally be processed to the original payment method.',
        'Depending on the payment provider/bank, the amount may take additional time to reflect in the customer’s account.',
        'Where a refund is legally or contractually due, The Baby Step will process it within the applicable timeframe. Government e-commerce guidance also emphasizes timely processing of accepted refunds.',
      ],
    },
    {
      id: 6,
      title: 'Cancellation',
      paragraphs: [
        'An order may be cancelled before it is dispatched.',
        'Once an order has been shipped, cancellation may not be possible and the customer may need to follow the applicable return process.',
      ],
    },
    {
      id: 7,
      title: 'How to Request a Return',
      lead: 'Email us at:',
      returnRequest: {
        email: 'care@thebabystep.com',
        phone: '+91 98765 43210',
        note: 'Please attach photographs/video of the product and packaging wherever applicable.',
      },
    },
  ],
};
