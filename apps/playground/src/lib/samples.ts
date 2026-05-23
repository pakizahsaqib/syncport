export type SampleId =
  | "crm-leads"
  | "ecommerce-orders"
  | "saas-users"
  | "newsletter"
  | "support-tickets";

export const SAMPLE_DATA: Record<SampleId, unknown> = {
  "crm-leads": [
    {
      id: "lead_001",
      name: "Sarah Chen",
      email: "sarah.chen@acme.io",
      company: "Acme Corp",
      phone: "+1 415 555 0101",
      source: "website",
      score: 82,
    },
    {
      id: "lead_002",
      name: "Marcus Johnson",
      email: "marcus@northwind.dev",
      company: "Northwind Labs",
      phone: "+1 212 555 0192",
      source: "referral",
      score: 91,
    },
    {
      id: "lead_003",
      name: "Elena Rodriguez",
      email: "elena@brightpath.co",
      company: "Brightpath",
      source: "conference",
      score: 67,
    },
  ],
  "ecommerce-orders": [
    {
      orderId: "ORD-88421",
      customer: "Jamie Lee",
      email: "jamie@example.com",
      total: 249.99,
      currency: "USD",
      items: 3,
      status: "fulfilled",
      createdAt: "2025-05-20T14:32:00Z",
    },
    {
      orderId: "ORD-88422",
      customer: "Alex Kim",
      email: "alex.k@example.com",
      total: 89.5,
      currency: "USD",
      items: 1,
      status: "processing",
      createdAt: "2025-05-21T09:15:00Z",
    },
  ],
  "saas-users": [
    {
      userId: "usr_7f3a",
      name: "Priya Patel",
      email: "priya@startup.io",
      plan: "pro",
      mrr: 49,
      seats: 5,
      lastActive: "2025-05-22T18:00:00Z",
    },
    {
      userId: "usr_9b2c",
      name: "Tom Wilson",
      email: "tom@agency.co",
      plan: "enterprise",
      mrr: 499,
      seats: 25,
      lastActive: "2025-05-23T08:45:00Z",
    },
  ],
  newsletter: [
    { email: "reader1@mail.com", subscribedAt: "2025-01-10", tags: ["product", "changelog"] },
    { email: "reader2@mail.com", subscribedAt: "2025-02-14", tags: ["weekly-digest"] },
    { email: "reader3@mail.com", subscribedAt: "2025-03-01", tags: ["product"] },
  ],
  "support-tickets": [
    {
      ticketId: "TKT-4401",
      subject: "Billing discrepancy",
      requester: "billing@client.com",
      priority: "high",
      status: "open",
      assignee: "support-team-a",
    },
    {
      ticketId: "TKT-4402",
      subject: "API rate limits",
      requester: "dev@client.com",
      priority: "medium",
      status: "pending",
      assignee: "support-team-b",
    },
  ],
};

export const SAMPLE_LABELS: Record<SampleId, string> = {
  "crm-leads": "CRM Leads",
  "ecommerce-orders": "Ecommerce Orders",
  "saas-users": "SaaS Users",
  newsletter: "Newsletter Subscribers",
  "support-tickets": "Support Tickets",
};
