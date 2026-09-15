export interface PolicySection {
  id: number;
  title: string;
  lead?: string;
  items?: string[];
  note?: string;
  paragraphs?: string[];
  privacyEmail?: string;
  contactInfo?: {
    company: string;
    email: string;
    support: string;
    phone: string;
    address: string;
  };
  returnRequest?: {
    email: string;
    phone: string;
    note: string;
  };
}

export interface PolicyPageData {
  brand?: string;
  title: string;
  intro: string[];
  sections: PolicySection[];
}
