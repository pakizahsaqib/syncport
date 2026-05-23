/** Generic contact input accepted by HubSpot adapter */
export interface HubspotContactInput {
  name?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  company?: string;
  [key: string]: unknown;
}

/** HubSpot contact create/update payload */
export interface HubspotContactPayload {
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    company?: string;
    [key: string]: unknown;
  };
}
